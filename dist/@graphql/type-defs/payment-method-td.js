"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentMethodTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.paymentMethodTypeDefs = (0, graphql_tag_1.gql) `
    scalar Date

    type PaymentMethod {
        id: Int
        _id: ID
        name: String
        type: String
        extra: String
        createdAt: Date
        updatedAt: Date
    }

    type AllPaymentMethodsResponse {
        results: Int
        paymentMethods: [PaymentMethod]
    }

    input PaymentMethodInput {
        name: String
        type: String
        extra: String
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllPaymentMethods(
            queryString: QueryString
        ): AllPaymentMethodsResponse
        getPaymentMethod(_id: ID): PaymentMethod
    }

    type Mutation {
        createPaymentMethod(paymentMethod: PaymentMethodInput): PaymentMethod
        updatePaymentMethod(
            _id: ID
            paymentMethod: PaymentMethodInput
        ): PaymentMethod
        deletePaymentMethod(_id: ID): String
    }
`;
//# sourceMappingURL=payment-method-td.js.map