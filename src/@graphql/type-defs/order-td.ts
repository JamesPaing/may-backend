import { gql } from 'graphql-tag';

export const orderTypeDefs = gql`
    scalar Date
    scalar FileUpload

    type User {
        _id: ID
        name: String
    }

    type OrderItem {
        _id: ID
        quantity: Int
    }

    type Payment {
        _id: ID
        amount: Int
    }

    type Location {
        type: String
        coordinates: [Float]
    }

    type NewOrderApproveResponse {
        order: Order
        bikers: [ID]
    }

    type OrderHistory {
        ref: String
        _id: ID
        itemCount: Int
        grandTotal: Int
        status: String
        date: Date
    }

    type Order {
        id: Int
        _id: ID
        ref: String
        user: User
        orderItems: [OrderItem]
        address: String
        location: Location
        payments: [Payment]
        total: Int
        subTotal: Int
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

    input OrderItemInput {
        item: ID
        quantity: Int
    }

    input PaymentInput {
        paymentMethod: ID
        amount: Int
    }

    input LocationInput {
        type: String
        coordinates: [Float]
    }

    input OrderInput {
        user: ID
        orderItems: [OrderItemInput]
        payments: [PaymentInput]
        location: LocationInput
        address: String
        total: Int
        subTotal: Int
        screenShot: FileUpload
        note: String
    }

    input QueryString {
        limit: String
        search: String
        searchField: String
        page: String
    }

    type Query {
        getAllOrders(queryString: QueryString): AllOrdersResponse
        getOrder(_id: ID): Order
        getOrderHistory(userId: ID, queryString: QueryString): [OrderHistory]
        getVendorOrderHistory(
            vendorId: ID
            queryString: QueryString
        ): [OrderHistory]
    }

    type Mutation {
        createOrder(order: OrderInput): Order
        updateOrder(_id: ID, order: OrderInput): Order
        deleteOrder(_id: ID): String
        approveOrder(_id: ID): Order
        getApprovedOrder(vendorId: ID): Order
    }

    type Subscription {
        newOrderApproved: NewOrderApproveResponse
    }
`;
