"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const withdrawalSchema = new mongoose_1.default.Schema({
    id: Number,
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
    amount: Number,
    bankAccount: String,
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending',
    },
    approvedBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
withdrawalSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name',
    });
    next();
});
exports.Withdrawal = mongoose_1.default.model('Withdrawal', withdrawalSchema);
//# sourceMappingURL=withdrawal.js.map