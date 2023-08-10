import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { Withdrawal } from '../../models/withdrawal';
import { TWithdrawalArgs } from '../../@types/withdrawal-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';

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
    Date: GraphqlDate,
};
