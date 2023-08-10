interface TMain {
    target: {
        _id: string;
        ref: string;
    };
    kind: string;
    user: {
        _id: string;
        name: string;
    };
    rating: number;
    review: string;
}

export interface TRatingReview extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TRatingReviewInput extends Omit<TMain, 'target' | 'user'> {
    target: string;
    user: string;
}

export interface TRatingReviewArgs {
    _id: string;
    ratingReview: TRatingReviewInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
