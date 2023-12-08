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
exports.transferResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const transfer_1 = require("../../models/transfer");
const wallet_1 = require("../../models/wallet");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
const user_1 = require("../../models/user");
const pubsub_1 = require("../pubsub");
exports.transferResolvers = {
    Query: {
        getAllTransfers: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(transfer_1.Transfer.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const transfers = yield withAPIFeatures.query;
            return {
                results: transfers.length,
                transfers,
            };
        }),
        getTransfer: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const transfer = yield transfer_1.Transfer.findById(_id);
            return transfer;
        }),
        getTransferHistory: (_, { userId, queryString: { limit } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(transfer_1.Transfer.find({
                $or: [{ transferrer: userId }, { receiver: userId }],
            }), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const transfers = yield withAPIFeatures.query;
            return transfers;
        }),
    },
    Mutation: {
        createTransfer: (_, { transfer }) => __awaiter(void 0, void 0, void 0, function* () {
            const transferrerWallet = yield wallet_1.Wallet.findOne({
                owner: transfer.transferrer,
                kind: 'User',
            });
            if (transferrerWallet &&
                (transferrerWallet.balance || 0) >= transfer.amount) {
                transferrerWallet.balance -= transfer.amount;
            }
            else {
                return;
            }
            const receiver = yield user_1.User.findOne({
                $or: [
                    { email: transfer.receiver },
                    { contact: transfer.receiver },
                ],
            });
            if (!receiver) {
                throw 'There is no receiver with this email or phone number';
            }
            const receiverWallet = yield wallet_1.Wallet.findOne({
                kind: 'User',
                owner: receiver || null,
            });
            if (!receiverWallet) {
                const id = yield new AutoIncrement_1.default('wallet_id').incSequence();
                const newWallet = yield wallet_1.Wallet.create({
                    id,
                    owner: receiver,
                    kind: 'User',
                    balance: transfer.amount,
                });
                yield user_1.User.findByIdAndUpdate(receiver, {
                    $addToSet: { wallet: newWallet._id },
                });
            }
            else {
                receiverWallet.balance += transfer.amount;
                yield receiverWallet.save();
            }
            yield transferrerWallet.save();
            const id = yield new AutoIncrement_1.default('transfer_id').incSequence();
            const newTransfer = yield transfer_1.Transfer.create(Object.assign(Object.assign({ id }, transfer), { receiver }));
            const obj = {
                transferrer: transfer.transferrer,
                receiver: receiver._id,
                amount: transfer.amount,
            };
            pubsub_1.pubSub.publish('TRANSACTION_COMPLETED', {
                transactionCompleted: obj,
            });
            return newTransfer;
        }),
        updateTransfer: (_, { _id, transfer }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedTransfer = yield transfer_1.Transfer.findByIdAndUpdate(_id, transfer, {
                new: true,
                runValidators: true,
            });
            return updatedTransfer;
        }),
        deleteTransfer: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield transfer_1.Transfer.findByIdAndDelete(_id);
            return null;
        }),
    },
    Subscription: {
        transactionCompleted: {
            subscribe: () => pubsub_1.pubSub.asyncIterator(['TRANSACTION_COMPLETED']),
        },
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=transfer-rsv.js.map