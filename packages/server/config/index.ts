import * as fs from 'fs'
import * as path from 'path'
// Define the types for the possible environment keys
type Environment = 'LOCAL' | 'PRODUCTION' | 'TEST';
type EnvironmentVariable = {
    APP_NAME: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    PORT: number;
    SERVER_URL: string;
}

const config: Record<Environment, EnvironmentVariable> = {
    LOCAL: {
        APP_NAME: 'abb',
        DB_HOST: "localhost",
        DB_PORT: 5434,
        DB_USERNAME: "user_thusitha",
        DB_PASSWORD: "password_thusitha",
        DB_NAME: "master-server-database",
        PORT: 4531,
        SERVER_URL: "http://localhost:4531"
    },
    PRODUCTION: {
        APP_NAME: 'abb',
        DB_HOST: "prod-db-host",
        DB_PORT: 5432,
        DB_USERNAME: "prod_user",
        DB_PASSWORD: "prod_password",
        DB_NAME: "prod_database",
        PORT: 80,
        SERVER_URL: "http://prod-server-url"
    },
    TEST: {
        APP_NAME: 'abb',
        DB_HOST: "test-db-host",
        DB_PORT: 5435,
        DB_USERNAME: "test_user",
        DB_PASSWORD: "test_password",
        DB_NAME: "test_database",
        PORT: 4532,
        SERVER_URL: "http://test-server-url"
    }
};

const env: Environment = (process.env.NODE_ENV as Environment) || 'LOCAL';
const currentConfig = config[env];

// Generate .env content
const envContent = `
APP_NAME=${currentConfig.APP_NAME}
DB_HOST=${currentConfig.DB_HOST}
DB_PORT=${currentConfig.DB_PORT}
DB_USERNAME=${currentConfig.DB_USERNAME}
DB_PASSWORD=${currentConfig.DB_PASSWORD}
DB_NAME=${currentConfig.DB_NAME}
PORT=${currentConfig.PORT}
SERVER_URL=${currentConfig.SERVER_URL}
`;

// Write .env file
fs.writeFileSync(path.join(__dirname, '../.env'), envContent.trim());
console.log('.env file has been generated');