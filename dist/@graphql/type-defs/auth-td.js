"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.authTypeDefs = (0, graphql_tag_1.gql) `
    scalar Date

    type Vendor {
        _id: ID
        name: String
    }

    type Location {
        type: String
        coordinates: [Float]
    }

    type User {
        id: Int
        _id: ID
        name: String
        contact: String
        email: String
        vendors: [Vendor]
        location: Location
        role: String
        isActive: Boolean
        createdAt: Date
        updatedAt: Date
    }

    type AuthResponse {
        token: String
        user: User
        isAuth: Boolean
    }

    input LoginCredentials {
        contact: String
        password: String
    }

    input RegisterCredentials {
        name: String
        contact: String
        password: String
        passwordConfirmation: String
    }

    type Mutation {
        login(credentials: LoginCredentials): AuthResponse
        vendorLogin(credentials: LoginCredentials): AuthResponse
        bikerLogin(credentials: LoginCredentials): AuthResponse
        register(credentials: RegisterCredentials): AuthResponse
    }
`;
exports.default = exports.authTypeDefs;
//# sourceMappingURL=auth-td.js.map