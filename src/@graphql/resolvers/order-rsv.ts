import { Request } from 'express';
import { GraphQLUpload } from 'graphql-upload';
import GraphqlDate from '../../utils/scalars/date-scalar';
import { Order } from '../../models/order';
import { TOrder, TOrderArgs } from '../../@types/order-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import uploadImage from 'src/utils/uploadImage';
import deleteImage from 'src/utils/deleteImage';

export const orderResolvers = {
    Query: {
        getAllOrders: async (
            _: undefined,
            { queryString: { limit, search, page } }: TOrderArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(Order.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const orders = await withAPIFeatures.query;

            return {
                results: orders.length,
                orders,
            };
        },
        getOrder: async (_: undefined, { _id }: TOrderArgs) => {
            const order = await Order.findById(_id);

            return order;
        },
    },
    Mutation: {
        createOrder: async (
            _: undefined,
            { order }: TOrderArgs,
            { req }: { req: Request }
        ) => {
            const { screenShot } = order;

            if (screenShot) {
                order.screenShot = await uploadImage(
                    screenShot,
                    'odr',
                    '../../public/uploads/order/',
                    req
                );
            }

            //@ts-ignore
            const id = await new AutoIncrement('order_id').incSequence();

            const newOrder = await Order.create({
                id,
                ...order,
            });

            return newOrder;
        },
        updateOrder: async (
            _: undefined,
            { _id, order }: TOrderArgs,
            { req }: { req: Request }
        ) => {
            const { screenShot } = order;

            if (screenShot && typeof screenShot !== 'string') {
                // write new image
                order.screenShot = await uploadImage(
                    screenShot,
                    'odr',
                    '../../public/uploads/order/',
                    req
                );

                // delete old image
                const p: TOrder | null = await Order.findById(_id);

                deleteImage(p!.screenShot, '../../public/uploads/order/');
            }

            const updatedOrder = await Order.findByIdAndUpdate(_id, order, {
                new: true,
                runValidators: true,
            });

            return updatedOrder;
        },
        deleteOrder: async (_: undefined, { _id }: TOrderArgs) => {
            const order: TOrder | null = await Order.findById(_id);

            deleteImage(order!.screenShot, '../../public/uploads/order/');

            await Order.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
    FileUpload: GraphQLUpload,
};
