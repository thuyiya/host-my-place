import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../src/data-source';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

const clearClientStore = (client: ApolloClient<NormalizedCacheObject>) => {
    client.clearStore().then(() => {
        client.resetStore();
        console.log('User logged out and Apollo Client cache has been reset.');
    }).catch(error => {
        console.error('Error resetting Apollo Client cache during logout:', error);
    });
};

const globalTeardown = async () => {
    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Drop the schema before destroying the connection
    await queryRunner.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

    await queryRunner.release();

    // Now it's safe to destroy the connection
    await AppDataSource.destroy();

    // Clear and reset client store
    clearClientStore(globalThis.client);
};

export default globalTeardown;
