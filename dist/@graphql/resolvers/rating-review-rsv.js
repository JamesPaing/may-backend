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
exports.ratingReviewResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const rating_review_1 = require("../../models/rating-review");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
exports.ratingReviewResolvers = {
    Query: {
        getAllRatingReviews: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(rating_review_1.RatingReview.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const ratingReviews = yield withAPIFeatures.query;
            return {
                results: ratingReviews.length,
                ratingReviews,
            };
        }),
        getRatingReview: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const ratingReviews = yield rating_review_1.RatingReview.findById(_id);
            return ratingReviews;
        }),
    },
    Mutation: {
        createRatingReview: (_, { ratingReview }) => __awaiter(void 0, void 0, void 0, function* () {
            const id = yield new AutoIncrement_1.default('ratingReview_id').incSequence();
            const newRatingReview = yield rating_review_1.RatingReview.create(Object.assign({ id }, ratingReview));
            return newRatingReview;
        }),
        updateRatingReview: (_, { _id, ratingReview }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedRatingReview = yield rating_review_1.RatingReview.findByIdAndUpdate(_id, ratingReview, {
                new: true,
                runValidators: true,
            });
            return updatedRatingReview;
        }),
        deleteRatingReview: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield rating_review_1.RatingReview.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=rating-review-rsv.js.map