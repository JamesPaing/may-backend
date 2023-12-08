import { gql } from 'graphql-tag';

export const transferTypeDefs = gql`
    scalar Date

    type User {
        _id: ID
        name: String
    }

    type TransactionCompleted {
        transferrer: ID
        receiver: ID
        amount: Int
    }

    type Transfer {
        id: Int
        _id: ID
        transferrer: User
        status: String
        receiver: User
        amount: Int
        createdAt: Date
        updatedAt: Date
    }

    type AllTransfersResponse {
        results: Int
        transfers: [Transfer]
    }

    input TransferInput {
        transferrer: ID
        status: String
        receiver: ID
        amount: Int
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllTransfers(queryString: QueryString): AllTransfersResponse
        getTransfer(_id: ID): Transfer
        getTransferHistory(userId: ID, queryString: QueryString): [Transfer]
    }

    type Mutation {
        createTransfer(transfer: TransferInput): Transfer
        updateTransfer(_id: ID, transfer: TransferInput): Transfer
        deleteTransfer(_id: ID): String
    }

    type Subscription {
        transactionCompleted: TransactionCompleted
    }
`;
