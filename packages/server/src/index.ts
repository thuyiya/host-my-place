import * as dotenv from 'dotenv';
import "reflect-metadata";
import * as path from 'path';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { resolvers } from './resolvers';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) });

// Load all .graphql files from the schema directories
const typesArray = loadFilesSync(path.join(__dirname, './schema/**/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const server = new ApolloServer({
    typeDefs,
    resolvers
});

(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT },
        // context: context,
    });

    console.log(`🚀  Server ready at: ${url}`);
})();
