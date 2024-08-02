import { MutationRegisterArgs, QueryHelloArgs, Resolvers } from "./types";

export const resolvers: Resolvers = {
    Query: {
        hello: (_, { name }: QueryHelloArgs) => `Tata ${name || "world"}`
    },
    Mutation: {
        register: async (_, { email, password }: MutationRegisterArgs): Promise<string> => {
            // Implement your registration logic here.
            // For now, let's return true as a placeholder.
            // Replace with actual registration logic and return appropriate boolean value.
            return email + password;
        }
    }
};
