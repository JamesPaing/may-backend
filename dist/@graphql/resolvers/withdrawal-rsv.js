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
exports.withdrawalResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const withdrawal_1 = require("../../models/withdrawal");
const wallet_1 = require("../../models/wallet");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
const pubsub_1 = require("./../pubsub");
exports.withdrawalResolvers = {
    Query: {
        getAllWithdrawals: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(withdrawal_1.Withdrawal.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const withdrawals = yield withAPIFeatures.query;
            return {
                results: withdrawals.length,
                withdrawals,
            };
        }),
        getWithdrawal: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const withdrawal = yield withdrawal_1.Withdrawal.findById(_id);
            return withdrawal;
        }),
        getWithdrawalHistory: (_, { userId, queryString: { limit } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(withdrawal_1.Withdrawal.find({ user: userId }), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const withdrawals = yield withAPIFeatures.query;
            return withdrawals;
        }),
    },
    Mutation: {
        createWithdrawal: (_, { withdrawal }) => __awaiter(void 0, void 0, void 0, function* () {
            const id = yield new AutoIncrement_1.default('withdrawal_id').incSequence();
            const newWithdrawal = yield withdrawal_1.Withdrawal.create(Object.assign({ id }, withdrawal));
            return newWithdrawal;
        }),
        approveWithdrawal: (_, _id) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedWithdrawal = yield withdrawal_1.Withdrawal.findByIdAndUpdate(_id, {
                status: 'approved',
            }, {
                runValidators: true,
            });
            const userWallet = yield wallet_1.Wallet.findOne({
                kind: 'User',
                owner: updatedWithdrawal === null || updatedWithdrawal === void 0 ? void 0 : updatedWithdrawal.user,
            });
            if (userWallet) {
                userWallet.balance =
                    (userWallet.balance || 0) -
                        ((updatedWithdrawal === null || updatedWithdrawal === void 0 ? void 0 : updatedWithdrawal.amount) || 0);
                yield userWallet.save();
            }
            const rawUser = updatedWithdrawal.user;
            const userId = rawUser._id;
            const obj = {
                message: 'Your withdrawal has been approved.',
                deposit: updatedWithdrawal._id,
                user: userId,
            };
            pubsub_1.pubSub.publish('WITHDRAWAL_APPROVED', {
                withdrawalApproved: obj,
            });
            return updatedWithdrawal;
        }),
        updateWithdrawal: (_, { _id, withdrawal }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedWithdrawal = yield withdrawal_1.Withdrawal.findByIdAndUpdate(_id, withdrawal, {
                new: true,
                runValidators: true,
            });
            return updatedWithdrawal;
        }),
        deleteWithdrawal: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield withdrawal_1.Withdrawal.findByIdAndDelete(_id);
            return null;
        }),
    },
    Subscription: {
        withdrawalApproved: {
            subscribe: () => pubsub_1.pubSub.asyncIterator(['WITHDRAWAL_APPROVED']),
        },
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=withdrawal-rsv.js.map