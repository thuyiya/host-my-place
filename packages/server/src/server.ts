import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'; 
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient, RedisClientType } from 'redis';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { AppDataSource } from './data-source'; // Import your DataSource
import { User } from './entity/User';
import { AppContext } from './global';

//** Schema Merging */
// Load all schema.graphql files from modules
const typeDefsArray = loadFilesSync(path.join(__dirname, './modules'), { extensions: ['graphql'] })
const typeDefs = mergeTypeDefs(typeDefsArray);

// Load all resolvers.ts files from modules
const resolversArray = loadFilesSync(path.join(path.join(__dirname, 'modules'), '**', 'resolvers.ts'), { extensions: ['ts'] });
const resolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({ typeDefs, resolvers });

/** Build Schema and arrange them with Schema Merging */
/** Can Use Stitching also if you plan to work with different schema set as sub schema, Federated Schema as multiple services */

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

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

        /**
         * REDIS CONNECTION
         */

        const client: RedisClientType = createClient();

        client.on('error', err => console.log('Redis Client Error', err));
        client.on('s', err => console.log('Redis Client Error', err));

        await client.connect();

        /**
        * REDIS CONNECTION END
        */

        app.use(
            cors(),
            bodyParser.json(),
            expressMiddleware(server, {
                context: async ({ }) => ({ redis: client }),
            }),
        );

        app.get('/confirm/:id', async (req, res) => {
            const { id } = req.params;
            const userId = await client.get(id)
            if (userId) {
                User.update(userId, { confirmed: true })
                res.status(200).json({ message: 'Verification Successful' })
            } else {
                res.status(401).json({ message: 'Token has been expired'})
            }
        })  

        return await new Promise<string>((resolve) => {
            httpServer.listen({ port: PORT }, () => resolve("http://localhost:" + PORT));
        });
    } catch (error) {
        throw error
    }
}

