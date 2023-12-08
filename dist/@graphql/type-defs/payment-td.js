"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.paymentTypeDefs = (0, graphql_tag_1.gql) `
    scalar Date

    type PaymentMethod {
        _id: ID
    }

    type Payment {
        id: Int
        _id: ID
        paymentMethod: PaymentMethod
        amount: Int
        createdAt: Date
        updatedAt: Date
    }

    type AllPaymentsResponse {
        results: Int
        payments: [Payment]
    }

    input PaymentInput {
        paymentMethod: ID
        amount: Int
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllPayments(queryString: QueryString): AllPaymentsResponse
        getPayment(_id: ID): Payment
    }

    type Mutation {
        createPayment(payment: PaymentInput): Payment
        updatePayment(_id: ID, payment: PaymentInput): Payment
        deletePayment(_id: ID): String
    }
`;
//# sourceMappingURL=payment-td.js.map