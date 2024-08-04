import * as dotenv from 'dotenv';
dotenv.config();

import { ApolloClient, InMemoryCache, from } from '@apollo/client/core';
import { createHttpLink } from '@apollo/client/link/http';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { getServerInstance } from './serverInstance';
import { createClient, RedisClientType } from 'redis';

const removeTypenameLink = removeTypenameFromVariables();

const globalSetup = async () => {
    const url = await getServerInstance();

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

    /**
     * REDIS CONNECTION
     */

    const redisClient: RedisClientType = createClient();

    redisClient.on('error', err => console.log('Redis Client Error', err));

    await redisClient.connect();

    // Attach the redis client to the global object
    globalThis.redis = redisClient;

    /**
     * REDIS CONNECTION END
     */
};

export default globalSetup;
