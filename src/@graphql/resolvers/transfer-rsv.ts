import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { Transfer } from '../../models/transfer';
import { Wallet } from '../../models/wallet';
import { TTransferArgs } from '../../@types/transfer-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import { User } from '../../models/user';
import { pubSub } from '../pubsub';

export const transferResolvers = {
    Query: {
        getAllTransfers: async (
            _: undefined,
            { queryString: { limit, search, page } }: TTransferArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(Transfer.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const transfers = await withAPIFeatures.query;

            return {
                results: transfers.length,
                transfers,
            };
        },
        getTransfer: async (_: undefined, { _id }: TTransferArgs) => {
            const transfer = await Transfer.findById(_id);

            return transfer;
        },
        getTransferHistory: async (
            _: undefined,
            { userId, queryString: { limit } }: TTransferArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);

            const withAPIFeatures = new APIFeatures(
                Transfer.find({
                    $or: [{ transferrer: userId }, { receiver: userId }],
                }),
                req.query
            )
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const transfers = await withAPIFeatures.query;

            return transfers;
        },
    },
    Mutation: {
        createTransfer: async (_: undefined, { transfer }: TTransferArgs) => {
            // update transferrer
            const transferrerWallet = await Wallet.findOne({
                owner: transfer.transferrer,
                kind: 'User',
            });

            if (
                transferrerWallet &&
                (transferrerWallet.balance || 0) >= transfer.amount
            ) {
                transferrerWallet.balance! -= transfer.amount;
            } else {
                return;
            }

            // update receiver
            const receiver = await User.findOne({
                $or: [
                    { email: transfer.receiver },
                    { contact: transfer.receiver },
                ],
            });

            if (!receiver) {
                throw 'There is no receiver with this email or phone number';
            }

            // find if there is already a wallet for receiver
            const receiverWallet = await Wallet.findOne({
                kind: 'User',
                owner: receiver || null,
            });

            // if no wallet, create one and add point as well
            if (!receiverWallet) {
                const id = await new AutoIncrement('wallet_id').incSequence();

                const newWallet = await Wallet.create({
                    id,
                    owner: receiver,
                    kind: 'User',
                    balance: transfer.amount,
                });

                // update the user
                await User.findByIdAndUpdate(receiver, {
                    $addToSet: { wallet: newWallet._id },
                });
            } else {
                // just update the wallet
                receiverWallet.balance! += transfer.amount;

                await receiverWallet.save();
            }

            // save transferrrer wallet here
            await transferrerWallet.save();

            //@ts-ignore
            const id = await new AutoIncrement('transfer_id').incSequence();

            const newTransfer = await Transfer.create({
                id,
                ...transfer,
                receiver,
            });

            const obj = {
                transferrer: transfer.transferrer,
                receiver: receiver._id,
                amount: transfer.amount,
            };

            pubSub.publish('TRANSACTION_COMPLETED', {
                transactionCompleted: obj,
            });

            return newTransfer;
        },
        updateTransfer: async (
            _: undefined,
            { _id, transfer }: TTransferArgs
        ) => {
            const updatedTransfer = await Transfer.findByIdAndUpdate(
                _id,
                transfer,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedTransfer;
        },
        deleteTransfer: async (_: undefined, { _id }: TTransferArgs) => {
            await Transfer.findByIdAndDelete(_id);

            return null;
        },
    },
    Subscription: {
        transactionCompleted: {
            subscribe: () => pubSub.asyncIterator(['TRANSACTION_COMPLETED']),
        },
    },
    Date: GraphqlDate,
};
