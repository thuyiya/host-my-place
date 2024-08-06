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
import { REGISTER_CONSTANT } from './modules/register/constant';

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

        /**
         * REDIS CONNECTION
         */

        const redisClient: RedisClientType = createClient();

        redisClient.on('error', err => console.log('Redis Client Error', err));

        await redisClient.connect();

        /**
        * REDIS CONNECTION END
        */

        app.get('/confirm/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const userId = await redisClient.get(id)
                if (userId) {
                    await User.update(userId, { confirmed: true })
                    await redisClient.del(userId)
                    res.status(200).json({ message: REGISTER_CONSTANT.EMAIL_VERIFICATION_SUCCESSFUL })
                } else {
                    throw new Error("User id not found")
                }
            } catch (error) {
                res.status(401).json({ message: REGISTER_CONSTANT.EMAIL_VERIFICATION_FAILED })
            }
        })  

        // Set up Apollo Server
        const server = new ApolloServer<AppContext>({
            schema,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });
        await server.start();

        app.use(
            cors(),
            bodyParser.json(),
            expressMiddleware(server, {
                context: async ({ req }) => ({ 
                    redis: redisClient, 
                    url: req.protocol + "://" + req.get("host")
                }),
            }),
        );

        return await new Promise<string>((resolve) => {
            httpServer.listen({ port: PORT }, () => resolve("http://" + process.env.HOST + ":" + PORT));
        });
    } catch (error) {
        throw error
    }
}

