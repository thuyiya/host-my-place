import * as bcrypt from 'bcryptjs';
import { MutationRegisterArgs, QueryHelloArgs, Resolvers } from "./types";
import { User } from './entity/User';

export const resolvers: Resolvers = {
    Query: {
        hello: (_, { name }: QueryHelloArgs) => `Tata ${name || "world"}`
    },
    Mutation: {
        register: async (_, { email, password }: MutationRegisterArgs): Promise<boolean> => {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = User.create({
                email,
                password: hashedPassword
            })

            await user.save();

            return true;
        }
    }
};
