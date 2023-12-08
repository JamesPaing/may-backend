"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const nanoid_1 = require("nanoid");
const orderSchema = new mongoose_1.default.Schema({
    id: Number,
    ref: {
        type: String,
        unique: true,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
    orderItems: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'OrderItem',
    },
    payments: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'Payment',
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        },
    },
    address: String,
    total: Number,
    subTotal: Number,
    screenShot: String,
    note: String,
    status: {
        type: String,
        enum: [
            'reviewing',
            'processing',
            'delivering',
            'completed',
            'cancelled',
        ],
        default: 'reviewing',
    },
}, {
    timestamps: true,
});
orderSchema.index({ location: '2dsphere' });
orderSchema.pre('save', function (next) {
    const nanoid = (0, nanoid_1.customAlphabet)('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
    this.ref = `MAY-${nanoid()}`;
    next();
});
orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'payments',
        select: '_id amount',
    }).populate({
        path: 'orderItems',
        select: '_id quantity item',
    });
    next();
});
exports.Order = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=order.js.map