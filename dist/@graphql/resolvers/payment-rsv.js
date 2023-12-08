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
exports.paymentResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const payment_1 = require("../../models/payment");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
exports.paymentResolvers = {
    Query: {
        getAllPayments: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(payment_1.Payment.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const payments = yield withAPIFeatures.query;
            return {
                results: payments.length,
                payments,
            };
        }),
        getPayment: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const payment = yield payment_1.Payment.findById(_id);
            return payment;
        }),
    },
    Mutation: {
        createPayment: (_, { payment }) => __awaiter(void 0, void 0, void 0, function* () {
            const id = yield new AutoIncrement_1.default('payment_id').incSequence();
            const newPayment = yield payment_1.Payment.create(Object.assign({ id }, payment));
            return newPayment;
        }),
        updatePayment: (_, { _id, payment }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedPayment = yield payment_1.Payment.findByIdAndUpdate(_id, payment, {
                new: true,
                runValidators: true,
            });
            return updatedPayment;
        }),
        deletePayment: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield payment_1.Payment.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=payment-rsv.js.map