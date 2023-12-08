import { Request } from 'express';
import { GraphQLUpload } from 'graphql-upload';
import GraphqlDate from '../../utils/scalars/date-scalar';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { OrderItem } from '../../models/order-item';
import { TOrder, TOrderArgs } from '../../@types/order-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import uploadImage from '../../utils/uploadImage';
import deleteImage from '../../utils/deleteImage';
import mongoose from 'mongoose';
import { Vendor } from '../../models/vendor';
import { User } from '../../models/user';
import { pubSub } from './../pubsub';

const ObjectId = mongoose.Types.ObjectId;

export const orderResolvers = {
    Query: {
        getAllOrders: async (
            _: undefined,
            { queryString: { limit, search, searchField, page } }: TOrderArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            searchField && (req.query.searchField = searchField);
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
        getOrderHistory: async (
            _: undefined,
            { userId, queryString: { limit } }: TOrderArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);

            const withAPIFeatures = new APIFeatures(
                Order.find({ user: userId }),
                req.query
            )
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const orders = await withAPIFeatures.query;

            return orders.map((order: TOrder) => ({
                _id: order._id,
                ref: order.ref,
                status: order.status,
                grandTotal: order.total,
                date: order.createdAt,
                itemCount: order.orderItems.length,
            }));
        },
        getVendorOrderHistory: async (
            _: undefined,
            { vendorId, queryString: { limit, search, page } }: TOrderArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const orders = await Order.aggregate([
                {
                    $lookup: {
                        from: 'orderitems',
                        localField: 'orderItems',
                        foreignField: '_id',
                        as: 'popluatedOrderItems',
                    },
                },
                {
                    $lookup: {
                        from: 'items',
                        localField: 'popluatedOrderItems.item',
                        foreignField: '_id',
                        as: 'popluatedItems',
                    },
                },
                {
                    $addFields: {
                        vendor: '$popluatedItems.vendor', // this is also key point
                    },
                },
                {
                    $match: {
                        vendor: {
                            $eq: new ObjectId(vendorId), // this took you so long
                        },
                    },
                },
                {
                    $project: {
                        ref: 1,
                        itemCount: {
                            $cond: {
                                if: { $isArray: '$orderItems' },
                                then: { $size: '$orderItems' },
                                else: 'NA',
                            },
                        },
                        grandTotal: '$total',
                        status: 1,
                        date: '$createdAt',
                    },
                },
            ]);

            return orders;
        },
    },
    Mutation: {
        createOrder: async (
            _: undefined,
            { order }: TOrderArgs,
            { req }: { req: Request }
        ) => {
            const { screenShot, orderItems, payments } = order;

            // upload iamge
            if (screenShot) {
                order.screenShot = await uploadImage(
                    screenShot,
                    'odr',
                    '../../public/uploads/order/',
                    req
                );
            }

            // create payments
            const paymentIDs = [];

            for (const payment of payments) {
                const id = await new AutoIncrement('payment_id').incSequence();

                const castedPayment = payment as any;

                const newPayment = await Payment.create({
                    id,
                    ...castedPayment,
                });

                paymentIDs.push(newPayment._id);
            }

            // create orderItems
            const orderItemIDs = [];

            for (const orderItem of orderItems) {
                const id = await new AutoIncrement(
                    'orderItem_id'
                ).incSequence();

                const castedOrderItem = orderItem as any;

                const newPayment = await OrderItem.create({
                    id,
                    ...castedOrderItem,
                });

                orderItemIDs.push(newPayment._id);
            }

            //@ts-ignore
            const id = await new AutoIncrement('order_id').incSequence();

            const newOrder = await Order.create({
                id,
                ...order,
                payments: paymentIDs,
                orderItems: orderItemIDs,
            });

            return newOrder;
        },
        approveOrder: async (_: undefined, { _id }: TOrderArgs) => {
            const order = await Order.findById(_id);

            const orderItems = order?.orderItems;

            //@ts-ignore
            const items = orderItems?.map((oi) => oi.item);

            const vendors = items?.map((i) => i.vendor._id);

            const vendor = vendors![0];

            const vendorDetail = await Vendor.findById(vendor);

            //@ts-ignore
            const { coordinates } = vendorDetail?.location;

            const [lng, lat] = coordinates;

            const distance = 3;

            const unit = 'mi';

            const radius =
                unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

            if (!lat || !lng) {
                throw new Error(
                    'Please provide lat and lng in this format lat,lng.'
                );
            }

            const bikers = await User.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radius],
                    },
                },
                role: 'biker',
            });

            const bikerIds = bikers.map((b) => b._id);

            pubSub.publish('NEW_ORDER_APPROVED', {
                newOrderApproved: {
                    order,
                    bikers: bikerIds,
                },
            });

            order!.status = 'processing';

            order?.save({
                validateBeforeSave: true,
            });

            return order;
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
    Subscription: {
        newOrderApproved: {
            subscribe: () => pubSub.asyncIterator(['NEW_ORDER_APPROVED']),
        },
    },
    Date: GraphqlDate,
    FileUpload: GraphQLUpload,
};
