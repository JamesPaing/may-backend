import { Request } from 'express';
import { GraphQLUpload } from 'graphql-upload';
import GraphqlDate from '../../utils/scalars/date-scalar';
import { Deposit } from '../../models/deposit';
import { TDeposit, TDepositArgs } from '../../@types/deposit-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import uploadImage from 'src/utils/uploadImage';
import deleteImage from 'src/utils/deleteImage';

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
    Date: GraphqlDate,
    FileUpload: GraphQLUpload,
};
