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
exports.authResolvers = void 0;
const sendJWT_1 = require("../../utils/sendJWT");
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const user_1 = require("../../models/user");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
exports.authResolvers = {
    Mutation: {
        login: (_, { credentials, }) => __awaiter(void 0, void 0, void 0, function* () {
            const { contact, password } = credentials;
            const user = yield user_1.User.findOne({
                contact,
            }).select('+password');
            if (!user ||
                !(yield user.correctPassword(password, user.password))) {
                throw 'Incorrect contact or password.';
            }
            if (!user.verifyRole(user, 'user')) {
                throw 'You are not authorized for this app.';
            }
            return yield (0, sendJWT_1.createSendToken)(user);
        }),
        vendorLogin: (_, { credentials, }) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = credentials;
            const user = yield user_1.User.findOne({
                email,
            }).select('+password -vendors');
            if (!user ||
                !(yield user.correctPassword(password, user.password))) {
                throw 'Incorrect email or password.';
            }
            if (!user.verifyRole(user, 'vendor')) {
                throw 'You are not authorized for this app.';
            }
            return yield (0, sendJWT_1.createSendToken)(user);
        }),
        bikerLogin: (_, { credentials, }) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = credentials;
            const user = yield user_1.User.findOne({
                email,
            }).select('+password');
            if (!user ||
                !(yield user.correctPassword(password, user.password))) {
                throw 'Incorrect email or password.';
            }
            if (!user.verifyRole(user, 'biker')) {
                throw 'You are not authorized for this app.';
            }
            return yield (0, sendJWT_1.createSendToken)(user);
        }),
        register: (_, { credentials, }) => __awaiter(void 0, void 0, void 0, function* () {
            const { email } = credentials;
            const existedUser = yield user_1.User.findOne({
                email,
            });
            if (existedUser)
                throw new Error('There is already a user with contact number you provided, please use other number');
            const id = yield new AutoIncrement_1.default('user_id').incSequence();
            const newUser = yield user_1.User.create(Object.assign({ id }, credentials));
            return yield (0, sendJWT_1.createSendToken)(newUser);
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
//# sourceMappingURL=auth-rsv.js.map