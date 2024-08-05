import * as dotenv from 'dotenv';

dotenv.config();

import { ApolloClient, InMemoryCache, NormalizedCacheObject, from } from '@apollo/client/core';
import { createHttpLink } from '@apollo/client/link/http';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { QueryRunner } from 'typeorm';
import { AppDataSource } from './src/data-source';
import { startServer } from "./src/server";

const removeTypenameLink = removeTypenameFromVariables();

const clearClientStore = (client: ApolloClient<NormalizedCacheObject>) => {
    client.clearStore().then(() => {
        client.resetStore();
        console.log('User logged out and Apollo Client cache has been reset.');
    }).catch(error => {
        console.error('Error resetting Apollo Client cache during logout:', error);
    });
}

beforeAll(async () => {
    const url = await startServer()
    console.log(`🚀 Server ready at: ${url}`);

    const httpLink = createHttpLink({
        uri: url
    });

    const link = from([removeTypenameLink, httpLink]);

    const client = new ApolloClient({
        link,
        cache: new InMemoryCache(),
    });
    // Attach the client to the global object
    globalThis.client = client;
});

afterAll(async () => {
    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Drop the schema before destroying the connection
    await queryRunner.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

    await queryRunner.release();

    // Now it's safe to destroy the connection
    await AppDataSource.destroy();
    
    
    //clear and rest client store
    clearClientStore(globalThis.client)
});