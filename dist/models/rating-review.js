"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingReview = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const ratingReviewSchema = new mongoose_1.default.Schema({
    id: Number,
    target: {
        type: ObjectId,
        refPath: 'kind',
    },
    kind: String,
    user: {
        type: ObjectId,
        ref: 'User',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    review: String,
}, {
    timestamps: true,
});
exports.RatingReview = mongoose_1.default.model('RatingReview', ratingReviewSchema);
//# sourceMappingURL=rating-review.js.map