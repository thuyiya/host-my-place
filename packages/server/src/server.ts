import * as path from 'path';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'; 
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { resolvers } from './resolvers';
import { AppDataSource } from './data-source'; // Import your DataSource

// Load all .graphql files from the schema directories
const typesArray = loadFilesSync(path.join(__dirname, './schema/**/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
interface AppContext {
    token?: string;
}

export const startServer = async () => {
    try {

        const app: express.Express = express()
        const httpServer = http.createServer(app);

        // Initialize the database connection
        await AppDataSource.initialize();
        console.log("Database connected successfully!");

        // Set up Apollo Server
        const server = new ApolloServer<AppContext>({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });
        await server.start();

        app.use(
            cors(),
            bodyParser.json(),
            // expressMiddleware accepts the same arguments:
            // an Apollo Server instance and optional configuration options
            expressMiddleware(server, {
                context: async ({ req }) => ({ token: req.headers.token }),
            }),
        );

        return await new Promise<string>((resolve) => {
            httpServer.listen({ port: PORT }, () => resolve("http://localhost:" + PORT));
        });
    } catch (error) {
        throw error
    }
}

