import * as dotenv from 'dotenv';
import "reflect-metadata";
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) });

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { resolvers } from './resolvers';
import { AppDataSource } from './data-source'; // Import your DataSource

// Load all .graphql files from the schema directories
const typesArray = loadFilesSync(path.join(__dirname, './schema/**/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

export const startServer = async () => {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();
        console.log("Database connected successfully!");

        // Create an instance of ApolloServer
        const server = new ApolloServer({
            typeDefs,
            resolvers,
        });

        // Start the server
        const { url } = await startStandaloneServer(server, {
            listen: { port: PORT },
            // context: context, // Uncomment and modify if you have a context function
        });

        console.log(`🚀 Server ready at: ${url}`);
    } catch (error) {
        console.error("Error starting the server:", error);
    }
}

startServer()