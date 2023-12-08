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
exports.orderItemResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const order_item_1 = require("../../models/order-item");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
exports.orderItemResolvers = {
    Query: {
        getAllOrderItems: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(order_item_1.OrderItem.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const orderItems = yield withAPIFeatures.query;
            return {
                results: orderItems.length,
                orderItems,
            };
        }),
        getOrderItem: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const orderItem = yield order_item_1.OrderItem.findById(_id);
            return orderItem;
        }),
    },
    Mutation: {
        createOrderItem: (_, { orderItem }) => __awaiter(void 0, void 0, void 0, function* () {
            const id = yield new AutoIncrement_1.default('orderItem_id').incSequence();
            const newOrderItem = yield order_item_1.OrderItem.create(Object.assign({ id }, orderItem));
            return newOrderItem;
        }),
        updateOrderItem: (_, { _id, orderItem }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedOrderItem = yield order_item_1.OrderItem.findByIdAndUpdate(_id, orderItem, {
                new: true,
                runValidators: true,
            });
            return updatedOrderItem;
        }),
        deleteOrderItem: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield order_item_1.OrderItem.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=order-item-rsv.js.map