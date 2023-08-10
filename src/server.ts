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

// type def files
import { userTypeDefs } from './@graphql/type-defs/user-td';

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
        typeDefs: [userTypeDefs],
        resolvers: [userResolvers],
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const startApolloServer = async () => {
        const server = new ApolloServer({
            schema,
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
