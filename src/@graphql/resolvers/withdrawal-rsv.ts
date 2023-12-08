import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { Withdrawal } from '../../models/withdrawal';
import { Wallet } from '../../models/wallet';
import { TWithdrawalArgs } from '../../@types/withdrawal-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import { pubSub } from './../pubsub';

export const withdrawalResolvers = {
    Query: {
        getAllWithdrawals: async (
            _: undefined,
            { queryString: { limit, search, page } }: TWithdrawalArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(
                Withdrawal.find(),
                req.query
            )
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const withdrawals = await withAPIFeatures.query;

            return {
                results: withdrawals.length,
                withdrawals,
            };
        },
        getWithdrawal: async (_: undefined, { _id }: TWithdrawalArgs) => {
            const withdrawal = await Withdrawal.findById(_id);

            return withdrawal;
        },
        getWithdrawalHistory: async (
            _: undefined,
            { userId, queryString: { limit } }: TWithdrawalArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);

            const withAPIFeatures = new APIFeatures(
                Withdrawal.find({ user: userId }),
                req.query
            )
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const withdrawals = await withAPIFeatures.query;

            return withdrawals;
        },
    },
    Mutation: {
        createWithdrawal: async (
            _: undefined,
            { withdrawal }: TWithdrawalArgs
        ) => {
            //@ts-ignore
            const id = await new AutoIncrement('withdrawal_id').incSequence();

            const newWithdrawal = await Withdrawal.create({
                id,
                ...withdrawal,
            });

            return newWithdrawal;
        },
        approveWithdrawal: async (_: undefined, _id: TWithdrawalArgs) => {
            // check if the user is admin

            // change the status of the deposit
            const updatedWithdrawal = await Withdrawal.findByIdAndUpdate(
                _id,
                {
                    status: 'approved',
                },
                {
                    runValidators: true,
                }
            );

            // deduct user point
            // find if there is already a wallet for user
            const userWallet = await Wallet.findOne({
                kind: 'User',
                owner: updatedWithdrawal?.user,
            });

            // if no wallet, create one and add point as well
            if (userWallet) {
                // just update the wallet
                userWallet.balance =
                    (userWallet.balance || 0) -
                    (updatedWithdrawal?.amount || 0);

                await userWallet.save();
            }

            const rawUser = updatedWithdrawal!.user as any;
            const userId = rawUser._id;

            const obj = {
                message: 'Your withdrawal has been approved.',
                deposit: updatedWithdrawal!._id,
                user: userId,
            };

            pubSub.publish('WITHDRAWAL_APPROVED', {
                withdrawalApproved: obj,
            });

            return updatedWithdrawal;
        },
        updateWithdrawal: async (
            _: undefined,
            { _id, withdrawal }: TWithdrawalArgs
        ) => {
            const updatedWithdrawal = await Withdrawal.findByIdAndUpdate(
                _id,
                withdrawal,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedWithdrawal;
        },
        deleteWithdrawal: async (_: undefined, { _id }: TWithdrawalArgs) => {
            await Withdrawal.findByIdAndDelete(_id);

            return null;
        },
    },
    Subscription: {
        withdrawalApproved: {
            subscribe: () => pubSub.asyncIterator(['WITHDRAWAL_APPROVED']),
        },
    },
    Date: GraphqlDate,
};
