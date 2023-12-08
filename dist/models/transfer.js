"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transferSchema = new mongoose_1.default.Schema({
    id: Number,
    transferrer: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
    amount: Number,
    status: {
        type: String,
        enum: ['completed'],
        default: 'completed',
    },
    receiver: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
transferSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'transferrer',
        select: '_id name',
    }).populate({
        path: 'receiver',
        select: '_id name',
    });
    next();
});
exports.Transfer = mongoose_1.default.model('Transfer', transferSchema);
//# sourceMappingURL=transfer.js.map