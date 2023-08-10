import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { OrderItem } from '../../models/order-item';
import { TOrderItemArgs } from '../../@types/order-item-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';

export const orderItemResolvers = {
    Query: {
        getAllOrderItems: async (
            _: undefined,
            { queryString: { limit, search, page } }: TOrderItemArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(OrderItem.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const orderItems = await withAPIFeatures.query;

            return {
                results: orderItems.length,
                orderItems,
            };
        },
        getOrderItem: async (_: undefined, { _id }: TOrderItemArgs) => {
            const orderItem = await OrderItem.findById(_id);

            return orderItem;
        },
    },
    Mutation: {
        createOrderItem: async (
            _: undefined,
            { orderItem }: TOrderItemArgs
        ) => {
            //@ts-ignore
            const id = await new AutoIncrement('orderItem_id').incSequence();

            const newOrderItem = await OrderItem.create({
                id,
                ...orderItem,
            });

            return newOrderItem;
        },
        updateOrderItem: async (
            _: undefined,
            { _id, orderItem }: TOrderItemArgs
        ) => {
            const updatedOrderItem = await OrderItem.findByIdAndUpdate(
                _id,
                orderItem,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedOrderItem;
        },
        deleteOrderItem: async (_: undefined, { _id }: TOrderItemArgs) => {
            await OrderItem.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
