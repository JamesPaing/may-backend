import { gql } from 'graphql-tag';

export const paymentMethodTypeDefs = gql`
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

    type AllPaymentMethods {
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
        getAllPaymentMethods(queryString: QueryString): AllPaymentMethodResponse
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
