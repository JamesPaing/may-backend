import { gql } from 'graphql-tag';

export const withdrawalTypeDefs = gql`
    scalar Date

    type User {
        _id: ID
        name: String
    }

    type WithdrawalApprovedResponse {
        message: String
        withdrawal: ID
        user: ID
    }

    type Withdrawal {
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

    type AllWithdrawalsResponse {
        results: Int
        withdrawals: [Withdrawal]
    }

    input WithdrawalInput {
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
        getAllWithdrawals(queryString: QueryString): AllWithdrawalsResponse
        getWithdrawal(_id: ID): Withdrawal
        getWithdrawalHistory(userId: ID, queryString: QueryString): [Withdrawal]
    }

    type Mutation {
        createWithdrawal(withdrawal: WithdrawalInput): Withdrawal
        updateWithdrawal(_id: ID, withdrawal: WithdrawalInput): Withdrawal
        deleteWithdrawal(_id: ID): String
        approveWithdrawal(_id: ID): Withdrawal
    }

    type Subscription {
        withdrawalApproved: WithdrawalApprovedResponse
    }
`;
