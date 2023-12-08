import { gql } from 'graphql-tag';

export const ratingReviewTypeDefs = gql`
    scalar Date

    type Order {
        _id: ID
    }

    type Vendor {
        _id: ID
    }

    type Item {
        _id: ID
    }

    type User {
        _id: ID
        name: String
    }

    union Target = Order | Vendor | Item

    type RatingReview {
        id: Int
        _id: ID
        target: Target
        kind: String
        user: User
        rating: Float
        review: String
        createdAt: Date
        updatedAt: Date
    }

    type AllRatingReviewsResponse {
        results: Int
        ratingReviews: [RatingReview]
    }

    input RatingReviewInput {
        target: ID
        kind: String
        user: ID
        rating: Float
        review: String
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllRatingReviews(queryString: QueryString): AllRatingReviewsResponse
        getRatingReview(_id: ID): RatingReview
    }

    type Mutation {
        createRatingReview(ratingReview: RatingReviewInput): RatingReview
        updateRatingReview(
            _id: ID
            ratingReview: RatingReviewInput
        ): RatingReview
        deleteRatingReview(_id: ID): String
    }
`;
