// global.d.ts
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';
import { RedisClientType } from 'redis';

export interface AppContext {
    redis: RedisClientType;
    url: string;
}

declare global {
    var client: ApolloClient<NormalizedCacheObject>
    var redis: RedisClientType;
}

export { };
