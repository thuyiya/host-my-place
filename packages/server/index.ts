import dotenv from 'dotenv';
import "reflect-metadata";

// Load environment variables from .env file
dotenv.config();

import { startServer } from "./src/server";

(async () => {
    try {
        console.log('\x1b[34m%s\x1b[0m', `Environment: ${process.env.NODE_ENV}`);
        const url = await startServer()
        console.log(`🚀 Server ready at: ${url}`);
    } catch (error) {
        console.error("Error starting the server:", error);
    }
})()