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
exports.depositResolvers = void 0;
const graphql_upload_1 = require("graphql-upload");
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const deposit_1 = require("../../models/deposit");
const user_1 = require("../../models/user");
const wallet_1 = require("../../models/wallet");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const deleteImage_1 = __importDefault(require("../../utils/deleteImage"));
const pubsub_1 = require("./../pubsub");
exports.depositResolvers = {
    Query: {
        getAllDeposits: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(deposit_1.Deposit.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const deposits = yield withAPIFeatures.query;
            return {
                results: deposits.length,
                deposits,
            };
        }),
        getDeposit: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const deposit = yield deposit_1.Deposit.findById(_id);
            return deposit;
        }),
        getDepositHistory: (_, { userId, queryString: { limit } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(deposit_1.Deposit.find({ user: userId }), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const deposits = yield withAPIFeatures.query;
            return deposits;
        }),
    },
    Mutation: {
        createDeposit: (_, { deposit }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { screenShot } = deposit;
            if (screenShot) {
                deposit.screenShot = yield (0, uploadImage_1.default)(screenShot, 'dps', '../../public/uploads/deposit/', req);
            }
            const id = yield new AutoIncrement_1.default('deposit_id').incSequence();
            const newDeposit = yield deposit_1.Deposit.create(Object.assign({ id }, deposit));
            return newDeposit;
        }),
        approveDeposit: (_, _id) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedDeposit = yield deposit_1.Deposit.findByIdAndUpdate(_id, {
                status: 'approved',
            }, {
                runValidators: true,
            });
            const userWallet = yield wallet_1.Wallet.findOne({
                kind: 'User',
                owner: updatedDeposit === null || updatedDeposit === void 0 ? void 0 : updatedDeposit.user,
            });
            if (!userWallet) {
                const id = yield new AutoIncrement_1.default('wallet_id').incSequence();
                const newWallet = yield wallet_1.Wallet.create({
                    id,
                    owner: updatedDeposit === null || updatedDeposit === void 0 ? void 0 : updatedDeposit.user,
                    kind: 'User',
                    balance: updatedDeposit === null || updatedDeposit === void 0 ? void 0 : updatedDeposit.amount,
                });
                yield user_1.User.findByIdAndUpdate(updatedDeposit === null || updatedDeposit === void 0 ? void 0 : updatedDeposit.user, {
                    $addToSet: { wallet: newWallet._id },
                });
            }
            else {
                userWallet.balance =
                    (userWallet.balance || 0) + ((updatedDeposit === null || updatedDeposit === void 0 ? void 0 : updatedDeposit.amount) || 0);
                yield userWallet.save();
            }
            const rawUser = updatedDeposit.user;
            const userId = rawUser._id;
            const obj = {
                message: 'Your deposit has been approved.',
                deposit: updatedDeposit._id,
                user: userId,
            };
            pubsub_1.pubSub.publish('DEPOSIT_APPROVED', {
                depositApproved: obj,
            });
            return updatedDeposit;
        }),
        updateDeposit: (_, { _id, deposit }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { screenShot } = deposit;
            if (screenShot && typeof screenShot !== 'string') {
                deposit.screenShot = yield (0, uploadImage_1.default)(screenShot, 'dps', '../../public/uploads/deposit/', req);
                const p = yield deposit_1.Deposit.findById(_id);
                (0, deleteImage_1.default)(p.screenShot, '../../public/uploads/deposit/');
            }
            const updatedDeposit = yield deposit_1.Deposit.findByIdAndUpdate(_id, deposit, {
                new: true,
                runValidators: true,
            });
            return updatedDeposit;
        }),
        deleteDeposit: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const deposit = yield deposit_1.Deposit.findById(_id);
            (0, deleteImage_1.default)(deposit.screenShot, '../../public/uploads/deposit/');
            yield deposit_1.Deposit.findByIdAndDelete(_id);
            return null;
        }),
    },
    Subscription: {
        depositApproved: {
            subscribe: () => pubsub_1.pubSub.asyncIterator(['DEPOSIT_APPROVED']),
        },
    },
    Date: date_scalar_1.default,
    FileUpload: graphql_upload_1.GraphQLUpload,
};
//# sourceMappingURL=deposit-rsv.js.map