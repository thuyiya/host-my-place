import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10), // Default port if not provided
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : "", // Ensure password is a string
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
