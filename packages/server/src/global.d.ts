// global.d.ts
import { ApolloClient } from '@apollo/client/core';

declare global {
    var client: ApolloClient<any>;
}

export { };
