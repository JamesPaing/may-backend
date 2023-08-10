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
exports.userResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const user_1 = require("../../models/user");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
exports.userResolvers = {
    Query: {
        getAllUsers: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(user_1.User.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const users = yield withAPIFeatures.query;
            return {
                results: users.length,
                users,
            };
        }),
        getUser: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.User.findById(_id);
            return user;
        }),
    },
    Mutation: {
        createUser: (_, { user }) => __awaiter(void 0, void 0, void 0, function* () {
            const id = yield new AutoIncrement_1.default('user_id').incSequence();
            const newUser = yield user_1.User.create(Object.assign({ id }, user));
            return newUser;
        }),
        updateUser: (_, { _id, user }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedUser = yield user_1.User.findByIdAndUpdate(_id, user, {
                new: true,
                runValidators: true,
            });
            return updatedUser;
        }),
        deleteUser: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_1.User.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=user-rsv.js.map