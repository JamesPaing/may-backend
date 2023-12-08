"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.walletTypeDefs = (0, graphql_tag_1.gql) `
    scalar Date

    type User {
        _id: ID
        name: String
    }

    type Vendor {
        _id: ID
        name: String
    }

    union Owner = User | Vendor

    type Wallet {
        id: Int
        _id: ID
        owner: Owner
        kind: String
        balance: Int
        createdAt: Date
        updatedAt: Date
    }

    type AllWalletsResponse {
        results: Int
        wallets: [Wallet]
    }

    input WalletInput {
        owner: ID
        kind: String
        balance: Int
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllWallets(queryString: QueryString): AllWalletsResponse
        getWallet(_id: ID): Wallet
    }

    type Mutation {
        createWallet(wallet: WalletInput): Wallet
        updateWallet(_id: ID, wallet: WalletInput): Wallet
        deleteWallet(_id: ID): String
    }
`;
//# sourceMappingURL=wallet-td.js.map