import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { MutationRegisterArgs, Resolvers } from "../../types";
import { User } from '../../entity/User';
import { formatYupErrors } from '../../utils/formatYupErrors';
import { REGISTER_CONSTANT } from './constant';
import { createConfirmedEmailLink } from '../../utils/createConfirmedEmailLink';

const schema = yup.object().shape({
    email: yup.string().min(3, REGISTER_CONSTANT.EMAIL_NOT_LONG_ENOUGH).max(255).email(REGISTER_CONSTANT.EMAIL_IS_INVALID),
    password: yup.string().min(3, REGISTER_CONSTANT.PASSWORD_NOT_LONG_ENOUGH).max(255)
});

export const resolvers: Resolvers = {
    Mutation: {
        register: async (_, args: MutationRegisterArgs, { redis }) => {
            try {
                await schema.validate(args, { abortEarly: false })
            } catch (error) {
                return formatYupErrors(error)
            }

            const { email, password } = args;

            const userAlreadyExist = await User.findOne({
                where: {
                    email
                },
                select: ["id"]
            })

            if (userAlreadyExist) {
                return [
                    {
                        path: "email",
                        message: REGISTER_CONSTANT.ALREADY_EXIST
                    }
                ]
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({
                email,
                password: hashedPassword
            });

            await user.save();

            await createConfirmedEmailLink("", user.id, redis)

            return null;
        }
    }
};
