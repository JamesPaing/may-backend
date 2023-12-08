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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSendToken = void 0;
const jwt = require('jsonwebtoken');
const signJWT = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
});
const createSendToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield signJWT(user._id);
    const expiresIn = 90 * 24 * 60 * 60 * 1000;
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + expiresIn),
    };
    process.env.NODE_ENV === 'production'
        ? (cookieOptions.httpOnly = false)
        : null;
    yield user.save({
        validateBeforeSave: false,
    });
    return {
        token,
        user,
        isAuth: true,
    };
});
exports.createSendToken = createSendToken;
//# sourceMappingURL=sendJWT.js.map