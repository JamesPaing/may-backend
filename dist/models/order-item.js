"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    id: Number,
    item: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Item',
    },
    quantity: Number,
}, {
    timestamps: true,
});
orderItemSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'item',
        select: '_id name vendor',
    });
    next();
});
exports.OrderItem = mongoose_1.default.model('OrderItem', orderItemSchema);
//# sourceMappingURL=order-item.js.map