// global.d.ts
import { ApolloClient } from '@apollo/client/core';
import { RedisClientType } from 'redis';

export interface AppContext {
    redis: RedisClientType;
}

declare global {
    var client: ApolloClient<AppContext>;
}

export { };
