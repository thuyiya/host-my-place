import * as bcrypt from 'bcryptjs';
import { Resolvers } from "../../types";
import { User } from '../../entity/User';

export const resolvers: Resolvers = {
    Mutation: {
        register: async (_, { email, password }: { email: string; password: string }) => {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = User.create({
                email,
                password: hashedPassword
            });

            await user.save();

            return true;
        }
    }
};
