"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.itemTypeDefs = (0, graphql_tag_1.gql) `
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
        quantity: Int
        description: String
        mainImage: String
        images: [String]
        favouritedBy: [ID]
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
        quantity: Int
        description: String
        mainImage: FileUpload
        images: [FileUpload]
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
        getItemByCategory(catId: ID, queryString: QueryString): AllItemsResponse
        getItemByVendor(
            vendorId: ID
            queryString: QueryString
        ): AllItemsResponse
    }

    type Mutation {
        createItem(item: ItemInput): Item
        updateItem(_id: ID, item: ItemInput): Item
        deleteItem(_id: ID): String
    }
`;
//# sourceMappingURL=item-td.js.map