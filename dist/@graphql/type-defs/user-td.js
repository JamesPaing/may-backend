"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.userTypeDefs = (0, graphql_tag_1.gql) `
    scalar Date

    type User {
        id: Int
        _id: ID
        name: String
        contact: String
        email: String
        role: String
        isActive: Boolean
        createdAt: Date
        updatedAt: Date
    }

    type AllUserResponse {
        results: Int
        users: [User]
    }

    input UserInput {
        name: String
        contact: String
        email: String
        role: String
        password: String
        passwordConfirmation: String
        isActive: Boolean
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllUsers(queryString: QueryString): AllUserResponse
        getUser(_id: ID): User
    }

    type Mutation {
        createUser(user: UserInput): User
        updateUser(_id: ID, user: UserInput): User
        deleteUser(_id: ID): String
    }
`;
//# sourceMappingURL=user-td.js.map