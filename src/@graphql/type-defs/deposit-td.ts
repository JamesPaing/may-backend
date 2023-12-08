import { gql } from 'graphql-tag';

export const depositTypeDefs = gql`
    scalar Date
    scalar FileUpload

    type User {
        _id: ID
        name: String
    }

    type DepositApprovedResponse {
        message: String
        deposit: ID
        user: ID
    }

    type Deposit {
        id: Int
        _id: ID
        user: User
        status: String
        screenShot: String
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
        screenShot: FileUpload
        approvedBy: ID
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
        getDepositHistory(userId: ID, queryString: QueryString): [Deposit]
    }

    type Mutation {
        createDeposit(deposit: DepositInput): Deposit
        updateDeposit(_id: ID, deposit: DepositInput): Deposit
        deleteDeposit(_id: ID): String
        approveDeposit(_id: ID): Deposit
    }

    type Subscription {
        depositApproved: DepositApprovedResponse
    }
`;
