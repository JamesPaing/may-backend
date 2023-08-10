import { gql } from 'graphql-tag';

export const itemTypeDefs = gql`
    scalar Date
    scalar FileUpload

    type Vendor {
        _id: ID
        name: String
    }

    type Category {
        _id: ID
        name: String
    }

    type Item {
        id: Int
        _id: ID
        name: String
        price: Int
        mainImage: String
        images: [String]
        vendor: Vendor
        categories: [Category]
        isActive: Boolean
        createdAt: Date
        updatedAt: Date
    }

    type AllItemsResponse {
        results: Int
        items: [Item]
    }

    input ItemInput {
        name: String
        price: Int
        mainImage: String
        images: [String]
        vendor: ID
        categories: [ID]
        isActive: Boolean
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllItems(queryString: QueryString): AllItemsResponse
        getItem(_id: ID): Item
    }

    type Mutation {
        createItem(item: ItemInput): Item
        updateItem(_id: ID, item: ItemInput): Item
        deleteItem(_id: ID): String
    }
`;
