import { gql } from 'graphql-tag';

export const depositTypeDefs = gql`
    scalar Date

    type User {
        _id: ID
        name: String
    }

    type Deposit {
        id: Int
        _id: ID
        user: User
        status: String
        bankAccount: String
        approvedBy: User
        amount: Int
        createdAt: Date
        updatedAt: Date
    }

    type AllDepositsResponse {
        results: Int
        deposits: [Deposit]
    }

    input DepositInput {
        user: ID
        status: String
        approvedBy: ID
        bankAccount: String
        amount: Int
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllDeposits(queryString: QueryString): AllDepositsResponse
        getDeposit(_id: ID): Deposit
    }

    type Mutation {
        createDeposit(deposit: DepositInput): Deposit
        updateDeposit(_id: ID, deposit: DepositInput): Deposit
        deleteDeposit(_id: ID): String
    }
`;
