"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const schema_1 = require("@graphql-tools/schema");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const scheduled_tasks_1 = require("./scheduled/scheduled-tasks");
const user_rsv_1 = require("./@graphql/resolvers/user-rsv");
const category_rsv_1 = require("./@graphql/resolvers/category-rsv");
const coordinate_rsv_1 = require("./@graphql/resolvers/coordinate-rsv");
const deposit_rsv_1 = require("./@graphql/resolvers/deposit-rsv");
const item_rsv_1 = require("./@graphql/resolvers/item-rsv");
const order_rsv_1 = require("./@graphql/resolvers/order-rsv");
const order_item_rsv_1 = require("./@graphql/resolvers/order-item-rsv");
const payment_method_rsv_1 = require("./@graphql/resolvers/payment-method-rsv");
const payment_rsv_1 = require("./@graphql/resolvers/payment-rsv");
const rating_review_rsv_1 = require("./@graphql/resolvers/rating-review-rsv");
const vendor_rsv_1 = require("./@graphql/resolvers/vendor-rsv");
const wallet_rsv_1 = require("./@graphql/resolvers/wallet-rsv");
const withdrawal_rsv_1 = require("./@graphql/resolvers/withdrawal-rsv");
const auth_rsv_1 = require("./@graphql/resolvers/auth-rsv");
const transfer_rsv_1 = require("./@graphql/resolvers/transfer-rsv");
const category_td_1 = require("./@graphql/type-defs/category-td");
const coordinate_td_1 = require("./@graphql/type-defs/coordinate-td");
const deposit_td_1 = require("./@graphql/type-defs/deposit-td");
const item_td_1 = require("./@graphql/type-defs/item-td");
const order_item_td_1 = require("./@graphql/type-defs/order-item-td");
const order_td_1 = require("./@graphql/type-defs/order-td");
const payment_method_td_1 = require("./@graphql/type-defs/payment-method-td");
const payment_td_1 = require("./@graphql/type-defs/payment-td");
const rating_review_td_1 = require("./@graphql/type-defs/rating-review-td");
const user_td_1 = require("./@graphql/type-defs/user-td");
const vendor_td_1 = require("./@graphql/type-defs/vendor-td");
const wallet_td_1 = require("./@graphql/type-defs/wallet-td");
const withdrawal_td_1 = require("./@graphql/type-defs/withdrawal-td");
const auth_td_1 = require("./@graphql/type-defs/auth-td");
const transfer_td_1 = require("./@graphql/type-defs/transfer-td");
(0, dotenv_1.config)({
    path: '.env',
});
const port = process.env.PORT;
const dbString = process.env.DB_STRING;
(0, mongoose_1.set)('strictQuery', true);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, mongoose_1.connect)(dbString, {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        });
        if (conn) {
            console.log('Connected to database!');
        }
    }
    catch (error) {
        console.log(error);
    }
    const httpServer = (0, http_1.createServer)(app_1.default);
    const wsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });
    const schema = (0, schema_1.makeExecutableSchema)({
        typeDefs: [
            user_td_1.userTypeDefs,
            category_td_1.categoryTypeDefs,
            coordinate_td_1.coordinateTypeDefs,
            deposit_td_1.depositTypeDefs,
            item_td_1.itemTypeDefs,
            order_item_td_1.orderItemTypeDefs,
            order_td_1.orderTypeDefs,
            payment_method_td_1.paymentMethodTypeDefs,
            payment_td_1.paymentTypeDefs,
            rating_review_td_1.ratingReviewTypeDefs,
            vendor_td_1.vendorTypeDefs,
            wallet_td_1.walletTypeDefs,
            withdrawal_td_1.withdrawalTypeDefs,
            auth_td_1.authTypeDefs,
            transfer_td_1.transferTypeDefs,
        ],
        resolvers: [
            user_rsv_1.userResolvers,
            category_rsv_1.categoryResolvers,
            coordinate_rsv_1.coordinateResolvers,
            deposit_rsv_1.depositResolvers,
            item_rsv_1.itemResolvers,
            order_item_rsv_1.orderItemResolvers,
            order_rsv_1.orderResolvers,
            payment_method_rsv_1.paymentMethodResolvers,
            payment_rsv_1.paymentResolvers,
            rating_review_rsv_1.ratingReviewResolvers,
            vendor_rsv_1.vendorResolvers,
            wallet_rsv_1.walletResolvers,
            withdrawal_rsv_1.withdrawalResolvers,
            auth_rsv_1.authResolvers,
            transfer_rsv_1.transferResolvers,
        ],
    });
    const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
    const startApolloServer = () => __awaiter(void 0, void 0, void 0, function* () {
        const server = new server_1.ApolloServer({
            schema,
            csrfPrevention: false,
            plugins: [
                (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                {
                    serverWillStart() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return {
                                drainServer() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        yield serverCleanup.dispose();
                                    });
                                },
                            };
                        });
                    },
                },
            ],
        });
        yield server.start();
        app_1.default.use('/graphql', (0, cors_1.default)({
            methods: ['GET', 'POST', 'OPTIONS'],
            credentials: true,
            maxAge: 600,
            origin: ['http://localhost:3000'],
        }), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
            context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    req,
                    res,
                });
            }),
        }));
        (0, scheduled_tasks_1.initScheduledJobs)();
        httpServer.listen(port, () => {
            console.log(`Server is running at port ${port}...`);
        });
    });
    startApolloServer();
}))();
//# sourceMappingURL=server.js.map