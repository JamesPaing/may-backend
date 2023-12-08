"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const vendorSchema = new mongoose_1.default.Schema({
    id: Number,
    name: String,
    address: String,
    city: String,
    township: String,
    password: {
        type: String,
        min: 6,
    },
    passwordConfirmation: {
        type: String,
    },
    wallet: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Wallet',
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
    items: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'Item',
    },
    logo: String,
    images: [String],
    isActive: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        enum: ['shop', 'market'],
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [
            {
                type: Number,
                default: undefined,
            },
        ],
    },
    coordinate: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Coordinate',
    },
}, {
    timestamps: true,
    autoIndex: true,
});
vendorSchema.index({ location: '2dsphere' });
vendorSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name -vendors',
    });
    next();
});
exports.Vendor = mongoose_1.default.model('Vendor', vendorSchema);
//# sourceMappingURL=vendor.js.map