import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
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

    type AllUsersResponse {
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
        getAllUsers(queryString: QueryString): AllUsersResponse
        getUser(_id: ID): User
    }

    type Mutation {
        createUser(user: UserInput): User
        updateUser(_id: ID, user: UserInput): User
        deleteUser(_id: ID): String
    }
`;
