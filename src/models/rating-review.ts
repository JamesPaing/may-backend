import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const ratingReviewSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true,
    }
);

export const RatingReview = mongoose.model('RatingReview', ratingReviewSchema);
