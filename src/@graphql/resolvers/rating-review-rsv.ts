import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { RatingReview } from '../../models/rating-review';
import { TRatingReviewArgs } from '../../@types/rating-review-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';

export const ratingReviewResolvers = {
    Query: {
        getAllRatingReviews: async (
            _: undefined,
            { queryString: { limit, search, page } }: TRatingReviewArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(
                RatingReview.find(),
                req.query
            )
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const ratingReviews = await withAPIFeatures.query;

            return {
                results: ratingReviews.length,
                ratingReviews,
            };
        },
        getRatingReviews: async (_: undefined, { _id }: TRatingReviewArgs) => {
            const ratingReviews = await RatingReview.findById(_id);

            return ratingReviews;
        },
    },
    Mutation: {
        createRatingReview: async (
            _: undefined,
            { ratingReview }: TRatingReviewArgs
        ) => {
            //@ts-ignore
            const id = await new AutoIncrement('ratingReview_id').incSequence();

            const newRatingReview = await RatingReview.create({
                id,
                ...ratingReview,
            });

            return newRatingReview;
        },
        updateRatingReview: async (
            _: undefined,
            { _id, ratingReview }: TRatingReviewArgs
        ) => {
            const updatedRatingReview = await RatingReview.findByIdAndUpdate(
                _id,
                ratingReview,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedRatingReview;
        },
        deleteRatingReview: async (
            _: undefined,
            { _id }: TRatingReviewArgs
        ) => {
            await RatingReview.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
