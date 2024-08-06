import { startServer } from "../src/server";

let serverInstance: string | null = null;

export const getServerInstance = async (): Promise<string> => {
    if (!serverInstance) {
        serverInstance = await startServer();
        console.log(`🚀 Server ready at: ${serverInstance}`);
    }
    return serverInstance;
};
