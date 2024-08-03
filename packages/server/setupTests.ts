import * as dotenv from 'dotenv';

dotenv.config();

import { QueryRunner } from 'typeorm';
import { AppDataSource } from './src/data-source';
import { startServer } from "./src/server";

beforeAll(async () => {
    const url = await startServer()
    console.log(`🚀 Server ready at: ${url}`);
});

afterAll(async () => {
    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Drop the schema before destroying the connection
    await queryRunner.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

    await queryRunner.release();

    // Now it's safe to destroy the connection
    await AppDataSource.destroy();
});