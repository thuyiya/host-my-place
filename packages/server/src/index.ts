import * as dotenv from 'dotenv';
import "reflect-metadata";
import * as path from 'path';
// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) });

import 'graphql-import-node'; //to import with .graphql formatted file
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;


const typeDefs = `
    type Query {
        hello(name: String): String!
    }
`

const resolvers = {
    Query: {
        hello: (_: any, { name }: any) => `Bye ${name || "world"}`
    }
}

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
})()