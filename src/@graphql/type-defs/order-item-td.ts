import { gql } from 'graphql-tag';

export const orderItemTypeDefs = gql`
    scalar Date

    type Item {
        _id: ID
    }

    type OrderItem {
        id: Int
        _id: ID
        item: Item
        quantity: Int
        createdAt: Date
        updatedAt: Date
    }

    type AllOrderItemsResponse {
        results: Int
        orderItems: [OrderItem]
    }

    input OrderItemInput {
        item: ID
        quantity: Int
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllOrderItems(queryString: QueryString): AllOrderItemsResponse
        getOrderItem(_id: ID): OrderItem
    }

    type Mutation {
        createOrderItem(orderItem: OrderItemInput): OrderItem
        updateOrderItem(_id: ID, orderItem: OrderItemInput): OrderItem
        deleteOrderItem(_id: ID): String
    }
`;
