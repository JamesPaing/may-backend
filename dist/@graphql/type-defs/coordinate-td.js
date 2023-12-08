"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coordinateTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.coordinateTypeDefs = (0, graphql_tag_1.gql) `
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
//# sourceMappingURL=coordinate-td.js.map