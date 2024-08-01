import { QueryHelloArgs } from "./types";

export const resolvers = {
    Query: {
        hello: (_: any, { name }: QueryHelloArgs) => `Tata ${name || "world"}`
    }
}