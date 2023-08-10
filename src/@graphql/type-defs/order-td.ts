import { gql } from 'graphql-tag';

export const orderTypeDefs = gql`
    scalar Date
    scalar FileUpload

    type User {
        _id: String
        name: String
    }

    type OrderItem {
        _id: String
        quantity: Int
    }

    type Payment {
        _id: String
    }

    type Order {
        id: Int
        _id: ID
        ref: String
        user: User
        orderItems: [OrderItem]
        payments: [Payment]
        total: Int
        subTotoal: Int
        screenShot: String
        note: String
        status: String
        createdAt: Date
        updatedAt: Date
    }

    type AllOrdersResponse {
        results: Int
        orders: [Order]
    }

    input OrderInput {
        ref: String
        user: ID
        orderItems: [ID]
        payments: [ID]
        total: Int
        subTotoal: Int
        screenShot: FileUpload
        note: String
        status: String
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllOrders(queryString: QueryString): AllOrdersResponse
        getOrder(_id: ID): Order
    }

    type Mutation {
        createOrder(order: OrderInput): Order
        updateOrder(_id: ID, order: OrderInput): Order
        deleteOrder(_id: ID): String
    }
`;
