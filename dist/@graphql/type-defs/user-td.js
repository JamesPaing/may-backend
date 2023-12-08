"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.userTypeDefs = (0, graphql_tag_1.gql) `
    scalar Date

    type Favourite {
        _id: ID
        name: String
    }

    type Vendor {
        _id: ID
        name: String
    }

    type Location {
        type: String
        coordinates: [Float]
    }

    type Wallet {
        _id: ID
        balance: Int
    }

    type Item {
        id: Int
        _id: ID
        name: String
        price: Int
        mainImage: String
        images: [String]
        favouritedBy: [ID]
        vendor: Vendor
        categories: [Category]
        isActive: Boolean
        createdAt: Date
        updatedAt: Date
    }

    type User {
        id: Int
        _id: ID
        name: String
        address: String
        contact: String
        favourites: [Favourite]
        vendors: [Vendor]
        location: Location
        wallet: Wallet
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

    input LocationInput {
        type: String
        coordinates: [Float]
    }

    input UserInput {
        name: String
        contact: String
        email: String
        address: String
        location: LocationInput
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

    type FavoruiteItemVendor {
        _id: ID
        name: String
    }

    type FormattedFavouriteItem {
        _id: ID
        name: String
        price: Int
        mainImage: String
        vendor: FavoruiteItemVendor
    }

    type Query {
        getAllUsers(queryString: QueryString): AllUsersResponse
        getUser(_id: ID): User
        getAllFavouriteItems(_id: ID): [FormattedFavouriteItem]
    }

    type Mutation {
        createUser(user: UserInput): User
        updateUser(_id: ID, user: UserInput): User
        deleteUser(_id: ID): String
        addFavouriteItem(_id: ID, itemId: ID): Item
        removeFavouriteItem(_id: ID, itemId: ID): Item
    }
`;
//# sourceMappingURL=user-td.js.map