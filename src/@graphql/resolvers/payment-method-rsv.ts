import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { PaymentMethod } from '../../models/payment-method';
import { TPaymentMethodArgs } from '../../@types/payment-method-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';

export const paymentMethodResolvers = {
    Query: {
        getAllPaymentMethods: async (
            _: undefined,
            { queryString: { limit, search, page } }: TPaymentMethodArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(
                PaymentMethod.find(),
                req.query
            )
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const paymentMethods = await withAPIFeatures.query;

            return {
                results: paymentMethods.length,
                paymentMethods,
            };
        },
        getPaymentMethod: async (_: undefined, { _id }: TPaymentMethodArgs) => {
            const paymentMethod = await PaymentMethod.findById(_id);

            return paymentMethod;
        },
    },
    Mutation: {
        createPaymentMethod: async (
            _: undefined,
            { paymentMethod }: TPaymentMethodArgs
        ) => {
            //@ts-ignore
            const id = await new AutoIncrement(
                'paymentMethod_id'
            ).incSequence();

            const newPaymentMethod = await PaymentMethod.create({
                id,
                ...paymentMethod,
            });

            return newPaymentMethod;
        },
        updatePaymentMethod: async (
            _: undefined,
            { _id, paymentMethod }: TPaymentMethodArgs
        ) => {
            const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
                _id,
                paymentMethod,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedPaymentMethod;
        },
        deletePaymentMethod: async (
            _: undefined,
            { _id }: TPaymentMethodArgs
        ) => {
            await PaymentMethod.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
