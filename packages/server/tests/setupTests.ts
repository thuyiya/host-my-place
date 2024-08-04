import * as dotenv from 'dotenv';
import { AppDataSource } from '../src/data-source';
dotenv.config();

beforeAll(async () => {
    await AppDataSource.initialize();
})

afterAll(async () => {
    await AppDataSource.destroy(); 
});