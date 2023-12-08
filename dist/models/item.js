"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const itemSchema = new mongoose_1.default.Schema({
    id: Number,
    name: String,
    price: Number,
    mainImage: String,
    images: [String],
    favouritedBy: {
        type: [ObjectId],
        ref: 'User',
    },
    description: String,
    quantity: {
        type: Number,
        default: 5,
    },
    vendor: {
        type: ObjectId,
        ref: 'Vendor',
    },
    categories: {
        type: [ObjectId],
        ref: 'Category',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
itemSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'vendor',
        select: '_id name',
    }).populate({
        path: 'categories',
        select: '_id name',
    });
    next();
});
exports.Item = mongoose_1.default.model('Item', itemSchema);
//# sourceMappingURL=item.js.map