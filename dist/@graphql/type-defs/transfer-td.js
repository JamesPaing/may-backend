"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.transferTypeDefs = (0, graphql_tag_1.gql) `
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
//# sourceMappingURL=transfer-td.js.map