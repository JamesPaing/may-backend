import { gql } from 'graphql-tag';

export const categoryTypeDefs = gql`
    scalar Date
    scalar FileUpload

    type Category {
        id: Int
        _id: ID
        name: String
        count: Int
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
