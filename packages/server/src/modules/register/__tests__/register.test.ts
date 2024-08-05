import { gql } from '@apollo/client/core';
import { User } from '../../../entity/User';
import { REGISTER_CONSTANT } from '../constant';

const email = "test3@test.com";
const password = "Test1234";

const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $password: String!) {
        register(email: $email, password: $password) {
            path
            message
        }
    }
`;

describe("Register User", () => {
    
    it("lets register new user", async () => {
        const { data } = await globalThis.client.mutate({
            mutation: REGISTER_MUTATION,
            variables: { email, password },
        });

        expect(data).toEqual({ register: null });

        const users = await User.find({ where: { email } });
        expect(users).toHaveLength(1);
        const user = users[0];
        expect(user.email).toEqual(email);
    })

    it("lets see for existing users", async () => {
        const { data: data2 } = await globalThis.client.mutate({
            mutation: REGISTER_MUTATION,
            variables: { email, password },
        });

        expect(data2.register).toHaveLength(1)
        expect(data2.register[0]).toMatchObject({
            path: 'email',
            message: REGISTER_CONSTANT.ALREADY_EXIST
        })
    })

    it("lets see is it bad email", async () => {
        const { data: data3 } = await globalThis.client.mutate({
            mutation: REGISTER_MUTATION,
            variables: { email: "wr", password },
        });
        expect(data3).toEqual({
            register: [
                {
                    "__typename": "Error",
                    path: 'email',
                    message: REGISTER_CONSTANT.EMAIL_NOT_LONG_ENOUGH
                },
                {
                    "__typename": "Error",
                    path: 'email',
                    message: REGISTER_CONSTANT.EMAIL_IS_INVALID
                }
            ]
        })
    })
    it("lets see is it bad password", async () => {
        const { data: data4 } = await globalThis.client.mutate({
            mutation: REGISTER_MUTATION,
            variables: { email: email, password: "12" },
        });
        expect(data4).toEqual({
            register: [
                {
                    "__typename": "Error",
                    path: 'password',
                    message: REGISTER_CONSTANT.PASSWORD_NOT_LONG_ENOUGH
                }
            ]
        })
    })

    it("lets see is it bad password and email both", async () => {
        const { data: data5 } = await globalThis.client.mutate({
            mutation: REGISTER_MUTATION,
            variables: { email: "as", password: "12" },
        });
        expect(data5).toEqual({
            register: [
                {
                    "__typename": "Error",
                    path: 'email',
                    message: REGISTER_CONSTANT.EMAIL_NOT_LONG_ENOUGH
                },
                {
                    "__typename": "Error",
                    path: 'email',
                    message: REGISTER_CONSTANT.EMAIL_IS_INVALID
                },
                {
                    "__typename": "Error",
                    path: 'password',
                    message: REGISTER_CONSTANT.PASSWORD_NOT_LONG_ENOUGH
                }
            ]
        })
    })
});
