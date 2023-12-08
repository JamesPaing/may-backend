"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.categoryTypeDefs = (0, graphql_tag_1.gql) `
    scalar Date
    scalar FileUpload

    type Category {
        id: Int
        _id: ID
        name: String
        count: Int
        forMarket: Boolean
        image: String
        isActive: Boolean
        createdAt: Date
        updatedAt: Date
    }

    type AllCategoriesResponse {
        results: Int
        categories: [Category]
    }

    input CategoryInput {
        name: String
        count: Int
        image: FileUpload
        isActive: Boolean
    }

    input QueryString {
        limit: String
        search: String
        page: String
        forMarket: Boolean
    }

    type Query {
        getAllCategories(queryString: QueryString): AllCategoriesResponse
        getCategory(_id: ID): Category
    }

    type Mutation {
        createCategory(category: CategoryInput): Category
        updateCategory(_id: ID, category: CategoryInput): Category
        deleteCategory(_id: ID): String
    }
`;
//# sourceMappingURL=category-td.js.map