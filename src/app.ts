import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';

const app = express();

// middlewares
app.use(express.static('public/'));
app.use(graphqlUploadExpress());

// mounted routes

export default app;
