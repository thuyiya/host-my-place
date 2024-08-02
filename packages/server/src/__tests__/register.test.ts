import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

import { request } from 'graphql-request';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

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
    await AppDataSource.destroy(); // or AppDataSource.getConnection().close();
});

test("Register User", async () => {

    const response = await request(url, mutation);
    expect(response).toEqual({ register: true });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email)
    
});
