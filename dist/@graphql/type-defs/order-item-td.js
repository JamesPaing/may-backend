"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.orderItemTypeDefs = (0, graphql_tag_1.gql) `
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
//# sourceMappingURL=order-item-td.js.map