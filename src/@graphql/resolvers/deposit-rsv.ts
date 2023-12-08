import { Request } from 'express';
import { GraphQLUpload } from 'graphql-upload';
import GraphqlDate from '../../utils/scalars/date-scalar';
import { Deposit } from '../../models/deposit';
import { User } from '../../models/user';
import { Wallet } from '../../models/wallet';
import { TDeposit, TDepositArgs } from '../../@types/deposit-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import uploadImage from '../../utils/uploadImage';
import deleteImage from '../../utils/deleteImage';
import { pubSub } from './../pubsub';

export const depositResolvers = {
    Query: {
        getAllDeposits: async (
            _: undefined,
            { queryString: { limit, search, page } }: TDepositArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(Deposit.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const deposits = await withAPIFeatures.query;

            return {
                results: deposits.length,
                deposits,
            };
        },
        getDeposit: async (_: undefined, { _id }: TDepositArgs) => {
            const deposit = await Deposit.findById(_id);

            return deposit;
        },
        getDepositHistory: async (
            _: undefined,
            { userId, queryString: { limit } }: TDepositArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);

            const withAPIFeatures = new APIFeatures(
                Deposit.find({ user: userId }),
                req.query
            )
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const deposits = await withAPIFeatures.query;

            return deposits;
        },
    },
    Mutation: {
        createDeposit: async (
            _: undefined,
            { deposit }: TDepositArgs,
            { req }: { req: Request }
        ) => {
            const { screenShot } = deposit;

            if (screenShot) {
                deposit.screenShot = await uploadImage(
                    screenShot,
                    'dps',
                    '../../public/uploads/deposit/',
                    req
                );
            }
            //@ts-ignore
            const id = await new AutoIncrement('deposit_id').incSequence();

            const newDeposit = await Deposit.create({
                id,
                ...deposit,
            });

            return newDeposit;
        },
        approveDeposit: async (_: undefined, _id: TDepositArgs) => {
            // check if the user is admin

            // change the status of the deposit
            const updatedDeposit = await Deposit.findByIdAndUpdate(
                _id,
                {
                    status: 'approved',
                },
                {
                    runValidators: true,
                }
            );

            // add user point
            // find if there is already a wallet for user
            const userWallet = await Wallet.findOne({
                kind: 'User',
                owner: updatedDeposit?.user,
            });

            // if no wallet, create one and add point as well
            if (!userWallet) {
                const id = await new AutoIncrement('wallet_id').incSequence();

                const newWallet = await Wallet.create({
                    id,
                    owner: updatedDeposit?.user,
                    kind: 'User',
                    balance: updatedDeposit?.amount,
                });

                // update the user
                await User.findByIdAndUpdate(updatedDeposit?.user, {
                    $addToSet: { wallet: newWallet._id },
                });
            } else {
                // just update the wallet
                userWallet.balance =
                    (userWallet.balance || 0) + (updatedDeposit?.amount || 0);

                await userWallet.save();
            }

            const rawUser = updatedDeposit!.user as any;
            const userId = rawUser._id;

            const obj = {
                message: 'Your deposit has been approved.',
                deposit: updatedDeposit!._id,
                user: userId,
            };

            pubSub.publish('DEPOSIT_APPROVED', {
                depositApproved: obj,
            });

            return updatedDeposit;
        },
        updateDeposit: async (
            _: undefined,
            { _id, deposit }: TDepositArgs,
            { req }: { req: Request }
        ) => {
            const { screenShot } = deposit;

            if (screenShot && typeof screenShot !== 'string') {
                // write new image
                deposit.screenShot = await uploadImage(
                    screenShot,
                    'dps',
                    '../../public/uploads/deposit/',
                    req
                );

                // delete old image
                const p: TDeposit | null = await Deposit.findById(_id);

                deleteImage(p!.screenShot, '../../public/uploads/deposit/');
            }

            const updatedDeposit = await Deposit.findByIdAndUpdate(
                _id,
                deposit,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedDeposit;
        },
        deleteDeposit: async (_: undefined, { _id }: TDepositArgs) => {
            const deposit: TDeposit | null = await Deposit.findById(_id);

            deleteImage(deposit!.screenShot, '../../public/uploads/deposit/');

            await Deposit.findByIdAndDelete(_id);

            return null;
        },
    },
    Subscription: {
        depositApproved: {
            subscribe: () => pubSub.asyncIterator(['DEPOSIT_APPROVED']),
        },
    },
    Date: GraphqlDate,
    FileUpload: GraphQLUpload,
};
