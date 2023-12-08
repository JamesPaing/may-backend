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
exports.paymentMethodResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const payment_method_1 = require("../../models/payment-method");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
exports.paymentMethodResolvers = {
    Query: {
        getAllPaymentMethods: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(payment_method_1.PaymentMethod.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const paymentMethods = yield withAPIFeatures.query;
            return {
                results: paymentMethods.length,
                paymentMethods,
            };
        }),
        getPaymentMethod: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const paymentMethod = yield payment_method_1.PaymentMethod.findById(_id);
            return paymentMethod;
        }),
    },
    Mutation: {
        createPaymentMethod: (_, { paymentMethod }) => __awaiter(void 0, void 0, void 0, function* () {
            const id = yield new AutoIncrement_1.default('paymentMethod_id').incSequence();
            const newPaymentMethod = yield payment_method_1.PaymentMethod.create(Object.assign({ id }, paymentMethod));
            return newPaymentMethod;
        }),
        updatePaymentMethod: (_, { _id, paymentMethod }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedPaymentMethod = yield payment_method_1.PaymentMethod.findByIdAndUpdate(_id, paymentMethod, {
                new: true,
                runValidators: true,
            });
            return updatedPaymentMethod;
        }),
        deletePaymentMethod: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield payment_method_1.PaymentMethod.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=payment-method-rsv.js.map