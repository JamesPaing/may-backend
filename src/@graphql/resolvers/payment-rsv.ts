import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { Payment } from '../../models/payment';
import { TPaymentArgs } from '../../@types/payment-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';

export const paymentResolvers = {
    Query: {
        getAllPayments: async (
            _: undefined,
            { queryString: { limit, search, page } }: TPaymentArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(Payment.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const payments = await withAPIFeatures.query;

            return {
                results: payments.length,
                payments,
            };
        },
        getPayment: async (_: undefined, { _id }: TPaymentArgs) => {
            const payment = await Payment.findById(_id);

            return payment;
        },
    },
    Mutation: {
        createPayment: async (_: undefined, { payment }: TPaymentArgs) => {
            //@ts-ignore
            const id = await new AutoIncrement('payment_id').incSequence();

            const newPayment = await Payment.create({
                id,
                ...payment,
            });

            return newPayment;
        },
        updatePayment: async (_: undefined, { _id, payment }: TPaymentArgs) => {
            const updatedPayment = await Payment.findByIdAndUpdate(
                _id,
                payment,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedPayment;
        },
        deletePayment: async (_: undefined, { _id }: TPaymentArgs) => {
            await Payment.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
