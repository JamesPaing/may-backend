import { gql } from 'graphql-tag';

export const coordinateTypeDefs = gql`
    scalar Date

    type Coordinate {
        id: Int
        _id: ID
        point: String
        type: String
        createdAt: Date
        updatedAt: Date
    }

    type AllCoordinateResponses {
        results: Int
        coordinates: [Coordinate]
    }

    input CoordinateInput {
        point: String
        type: String
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllCoordinates(queryString: QueryString): AllCoordinateResponses
        getCoordinate(_id: ID): Coordinate
    }

    type Mutation {
        createCoordinate(coordinate: CoordinateInput): Coordinate
        updateCoordinate(_id: ID, coordinate: CoordinateInput): Coordinate
        deleteCoordinate(_id: ID): String
    }
`;
