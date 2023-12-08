"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentMethodSchema = new mongoose_1.default.Schema({
    id: Number,
    name: String,
    type: {
        type: String,
        enum: ['cod', 'bank', 'wallet', 'point'],
    },
    extra: String,
}, {
    timestamps: true,
});
exports.PaymentMethod = mongoose_1.default.model('PaymentMethod', paymentMethodSchema);
//# sourceMappingURL=payment-method.js.map