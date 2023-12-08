"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderResolvers = void 0;
const graphql_upload_1 = require("graphql-upload");
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const order_1 = require("../../models/order");
const payment_1 = require("../../models/payment");
const order_item_1 = require("../../models/order-item");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const deleteImage_1 = __importDefault(require("../../utils/deleteImage"));
const mongoose_1 = __importDefault(require("mongoose"));
const vendor_1 = require("../../models/vendor");
const user_1 = require("../../models/user");
const pubsub_1 = require("./../pubsub");
const ObjectId = mongoose_1.default.Types.ObjectId;
exports.orderResolvers = {
    Query: {
        getAllOrders: (_, { queryString: { limit, search, searchField, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            searchField && (req.query.searchField = searchField);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(order_1.Order.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const orders = yield withAPIFeatures.query;
            return {
                results: orders.length,
                orders,
            };
        }),
        getOrder: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.Order.findById(_id);
            return order;
        }),
        getOrderHistory: (_, { userId, queryString: { limit } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(order_1.Order.find({ user: userId }), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const orders = yield withAPIFeatures.query;
            return orders.map((order) => ({
                _id: order._id,
                ref: order.ref,
                status: order.status,
                grandTotal: order.total,
                date: order.createdAt,
                itemCount: order.orderItems.length,
            }));
        }),
        getVendorOrderHistory: (_, { vendorId, queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const orders = yield order_1.Order.aggregate([
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
                        vendor: '$popluatedItems.vendor',
                    },
                },
                {
                    $match: {
                        vendor: {
                            $eq: new ObjectId(vendorId),
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
        }),
    },
    Mutation: {
        createOrder: (_, { order }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { screenShot, orderItems, payments } = order;
            if (screenShot) {
                order.screenShot = yield (0, uploadImage_1.default)(screenShot, 'odr', '../../public/uploads/order/', req);
            }
            const paymentIDs = [];
            for (const payment of payments) {
                const id = yield new AutoIncrement_1.default('payment_id').incSequence();
                const castedPayment = payment;
                const newPayment = yield payment_1.Payment.create(Object.assign({ id }, castedPayment));
                paymentIDs.push(newPayment._id);
            }
            const orderItemIDs = [];
            for (const orderItem of orderItems) {
                const id = yield new AutoIncrement_1.default('orderItem_id').incSequence();
                const castedOrderItem = orderItem;
                const newPayment = yield order_item_1.OrderItem.create(Object.assign({ id }, castedOrderItem));
                orderItemIDs.push(newPayment._id);
            }
            const id = yield new AutoIncrement_1.default('order_id').incSequence();
            const newOrder = yield order_1.Order.create(Object.assign(Object.assign({ id }, order), { payments: paymentIDs, orderItems: orderItemIDs }));
            return newOrder;
        }),
        approveOrder: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.Order.findById(_id);
            const orderItems = order === null || order === void 0 ? void 0 : order.orderItems;
            const items = orderItems === null || orderItems === void 0 ? void 0 : orderItems.map((oi) => oi.item);
            const vendors = items === null || items === void 0 ? void 0 : items.map((i) => i.vendor._id);
            const vendor = vendors[0];
            const vendorDetail = yield vendor_1.Vendor.findById(vendor);
            const { coordinates } = vendorDetail === null || vendorDetail === void 0 ? void 0 : vendorDetail.location;
            const [lng, lat] = coordinates;
            const distance = 3;
            const unit = 'mi';
            const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
            if (!lat || !lng) {
                throw new Error('Please provide lat and lng in this format lat,lng.');
            }
            const bikers = yield user_1.User.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radius],
                    },
                },
                role: 'biker',
            });
            const bikerIds = bikers.map((b) => b._id);
            pubsub_1.pubSub.publish('NEW_ORDER_APPROVED', {
                newOrderApproved: {
                    order,
                    bikers: bikerIds,
                },
            });
            order.status = 'processing';
            order === null || order === void 0 ? void 0 : order.save({
                validateBeforeSave: true,
            });
            return order;
        }),
        updateOrder: (_, { _id, order }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { screenShot } = order;
            if (screenShot && typeof screenShot !== 'string') {
                order.screenShot = yield (0, uploadImage_1.default)(screenShot, 'odr', '../../public/uploads/order/', req);
                const p = yield order_1.Order.findById(_id);
                (0, deleteImage_1.default)(p.screenShot, '../../public/uploads/order/');
            }
            const updatedOrder = yield order_1.Order.findByIdAndUpdate(_id, order, {
                new: true,
                runValidators: true,
            });
            return updatedOrder;
        }),
        deleteOrder: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.Order.findById(_id);
            (0, deleteImage_1.default)(order.screenShot, '../../public/uploads/order/');
            yield order_1.Order.findByIdAndDelete(_id);
            return null;
        }),
    },
    Subscription: {
        newOrderApproved: {
            subscribe: () => pubsub_1.pubSub.asyncIterator(['NEW_ORDER_APPROVED']),
        },
    },
    Date: date_scalar_1.default,
    FileUpload: graphql_upload_1.GraphQLUpload,
};
//# sourceMappingURL=order-rsv.js.map