import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, `../../.env`) });

import { request } from 'graphql-request';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { QueryRunner } from 'typeorm';

const email = "test3@test.com";
const password = "Test1234";

const mutation = `
    mutation {
        register(email: "${email}", password: "${password}")
    }
`;
const url = "http://localhost:4531";

beforeAll(async () => {
    // Initialize the database connection before making the request
    await AppDataSource.initialize();
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

test("Register User", async () => {
    const response = await request(url, mutation);
    expect(response).toEqual({ register: true });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
});
