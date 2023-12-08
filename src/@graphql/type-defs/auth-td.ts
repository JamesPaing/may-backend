import { gql } from 'graphql-tag';

export const authTypeDefs = gql`
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

export default authTypeDefs;
