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
exports.walletResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const wallet_1 = require("../../models/wallet");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
exports.walletResolvers = {
    Query: {
        getAllWallets: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(wallet_1.Wallet.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const wallets = yield withAPIFeatures.query;
            const formattedWallets = wallets.map((w) => ({
                id: w.id,
                _id: w._id,
                kind: w.kind,
                balance: w.balance,
                createdAt: w.createdAt,
                updatedAt: w.updatedAt,
                __v: w.__v,
                owner: {
                    _id: w.owner._id,
                    name: w.owner.name,
                    __typename: 'User',
                },
            }));
            return {
                results: formattedWallets.length,
                wallets: formattedWallets,
            };
        }),
        getWallet: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const wallet = yield wallet_1.Wallet.findById(_id);
            return wallet;
        }),
    },
    Mutation: {
        createWallet: (_, { wallet }) => __awaiter(void 0, void 0, void 0, function* () {
            const id = yield new AutoIncrement_1.default('wallet_id').incSequence();
            const newWallet = yield wallet_1.Wallet.create(Object.assign({ id }, wallet));
            return newWallet;
        }),
        updateWallet: (_, { _id, wallet }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedWallet = yield wallet_1.Wallet.findByIdAndUpdate(_id, wallet, {
                new: true,
                runValidators: true,
            });
            return updatedWallet;
        }),
        deleteWallet: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield wallet_1.Wallet.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=wallet-rsv.js.map