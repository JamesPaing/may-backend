import { connect, set } from 'mongoose';
import { config } from 'dotenv';
import { createServer } from 'http';
import app from './app';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import { json } from 'body-parser';
import { initScheduledJobs } from './scheduled/scheduled-tasks';

// resolver files
import { userResolvers } from './@graphql/resolvers/user-rsv';
import { categoryResolvers } from './@graphql/resolvers/category-rsv';
import { coordinateResolvers } from './@graphql/resolvers/coordinate-rsv';
import { depositResolvers } from './@graphql/resolvers/deposit-rsv';
import { itemResolvers } from './@graphql/resolvers/item-rsv';
import { orderResolvers } from './@graphql/resolvers/order-rsv';
import { orderItemResolvers } from './@graphql/resolvers/order-item-rsv';
import { paymentMethodResolvers } from './@graphql/resolvers/payment-method-rsv';
import { paymentResolvers } from './@graphql/resolvers/payment-rsv';
import { ratingReviewResolvers } from './@graphql/resolvers/rating-review-rsv';
import { vendorResolvers } from './@graphql/resolvers/vendor-rsv';
import { walletResolvers } from './@graphql/resolvers/wallet-rsv';
import { withdrawalResolvers } from './@graphql/resolvers/withdrawal-rsv';
import { authResolvers } from './@graphql/resolvers/auth-rsv';
import { transferResolvers } from './@graphql/resolvers/transfer-rsv';

// type def files
import { categoryTypeDefs } from './@graphql/type-defs/category-td';
import { coordinateTypeDefs } from './@graphql/type-defs/coordinate-td';
import { depositTypeDefs } from './@graphql/type-defs/deposit-td';
import { itemTypeDefs } from './@graphql/type-defs/item-td';
import { orderItemTypeDefs } from './@graphql/type-defs/order-item-td';
import { orderTypeDefs } from './@graphql/type-defs/order-td';
import { paymentMethodTypeDefs } from './@graphql/type-defs/payment-method-td';
import { paymentTypeDefs } from './@graphql/type-defs/payment-td';
import { ratingReviewTypeDefs } from './@graphql/type-defs/rating-review-td';
import { userTypeDefs } from './@graphql/type-defs/user-td';
import { vendorTypeDefs } from './@graphql/type-defs/vendor-td';
import { walletTypeDefs } from './@graphql/type-defs/wallet-td';
import { withdrawalTypeDefs } from './@graphql/type-defs/withdrawal-td';
import { authTypeDefs } from './@graphql/type-defs/auth-td';
import { transferTypeDefs } from './@graphql/type-defs/transfer-td';

// load env variables
config({
    path: '.env',
});

const port = process.env.PORT!;
const dbString = process.env.DB_STRING!;

// db connection
set('strictQuery', true);

(async () => {
    try {
        const conn = await connect(dbString, {
            autoIndex: false, // Don't build indexes
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
        });

        if (conn) {
            console.log('Connected to database!');
        }
    } catch (error) {
        console.log(error);
    }

    // http server
    const httpServer = createServer(app);

    // web socket server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    // graphql schema
    const schema = makeExecutableSchema({
        typeDefs: [
            userTypeDefs,
            categoryTypeDefs,
            coordinateTypeDefs,
            depositTypeDefs,
            itemTypeDefs,
            orderItemTypeDefs,
            orderTypeDefs,
            paymentMethodTypeDefs,
            paymentTypeDefs,
            ratingReviewTypeDefs,
            vendorTypeDefs,
            walletTypeDefs,
            withdrawalTypeDefs,
            authTypeDefs,
            transferTypeDefs,
        ],
        resolvers: [
            userResolvers,
            categoryResolvers,
            coordinateResolvers,
            depositResolvers,
            itemResolvers,
            orderItemResolvers,
            orderResolvers,
            paymentMethodResolvers,
            paymentResolvers,
            ratingReviewResolvers,
            vendorResolvers,
            walletResolvers,
            withdrawalResolvers,
            authResolvers,
            transferResolvers,
        ],
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const startApolloServer = async () => {
        const server = new ApolloServer({
            schema,
            csrfPrevention: false,
            plugins: [
                ApolloServerPluginDrainHttpServer({ httpServer }),
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                await serverCleanup.dispose();
                            },
                        };
                    },
                },
            ],
        });

        await server.start();

        app.use(
            '/graphql',
            cors<cors.CorsRequest>({
                methods: ['GET', 'POST', 'OPTIONS'],
                credentials: true,
                maxAge: 600,
                origin: ['http://localhost:3000'],
            }),
            json(),
            expressMiddleware(server, {
                context: async ({ req, res }) => ({
                    // token: req.headers.token,
                    req,
                    res,
                }),
            })
        );

        // initialize scheduled jobs
        initScheduledJobs();

        // Start running the server
        httpServer.listen(port, () => {
            console.log(`Server is running at port ${port}...`);
        });
    };

    startApolloServer();
})();
