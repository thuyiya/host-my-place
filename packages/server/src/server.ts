import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'; 
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { AppDataSource } from './data-source'; // Import your DataSource

//** Schema Merging */
// Load all schema.graphql files from modules
const typeDefsArray = loadFilesSync(path.join(__dirname, './modules'), { extensions: ['graphql'] })
const typeDefs = mergeTypeDefs(typeDefsArray);

// Load all resolvers.ts files from modules
const resolversArray = loadFilesSync(path.join(__dirname, './modules'), { extensions: ['ts'] })
const resolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({ typeDefs, resolvers });

/** Build Schema and arrange them with Schema Merging */
/** Can Use Stitching also if you plan to work with different schema set as sub schema, Federated Schema as multiple services */

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
            schema,
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

