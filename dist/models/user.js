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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    id: Number,
    name: String,
    contact: String,
    email: String,
    address: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'super_admin', 'vendor', 'biker'],
        default: 'user',
    },
    password: String,
    passwordConfirmation: String,
    passwordResetToken: String,
    passwordChangedAt: Date,
    wallet: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Wallet',
    },
    vendors: {
        type: [mongoose_1.Types.ObjectId],
        ref: 'Vendor',
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    currentCoordinate: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Coordinate',
    },
    coordinates: {
        type: [mongoose_1.Types.ObjectId],
        ref: 'Coordinate',
    },
    favourites: {
        type: [mongoose_1.Types.ObjectId],
        ref: 'Item',
    },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    autoIndex: true,
});
userSchema.index({ location: '2dsphere' });
userSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'favourites',
        select: '_id name mainImage price vendor',
    })
        .populate({
        path: 'vendors',
        select: '_id name -user',
    })
        .populate({
        path: 'wallet',
        select: '_id balance -owner',
    });
    next();
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.passwordConfirmation = undefined;
        next();
    });
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
};
userSchema.methods.verifyRole = function (user, role) {
    return user.role === role;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=user.js.map