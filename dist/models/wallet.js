"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
    id: Number,
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        refPath: 'kind',
    },
    kind: {
        type: String,
        enum: ['User', 'Vendor'],
    },
    balance: Number,
}, {
    timestamps: true,
});
walletSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'owner',
        select: '_id name ',
    });
    next();
});
exports.Wallet = mongoose_1.default.model('Wallet', walletSchema);
//# sourceMappingURL=wallet.js.map