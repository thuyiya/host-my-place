import { ApolloClient, gql } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { User } from '../../../entity/User';

const email = "test3@test.com";
const password = "Test1234";

const url = "http://localhost:4531";

const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $password: String!) {
        register(email: $email, password: $password) {
            path
            message
        }
    }
`;

test("Register User", async () => {
    const client = new ApolloClient({
        uri: url,
        cache: new InMemoryCache(),
    });

    const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { email, password },
    });

    expect(data).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);

    //lets see for existing users
    const { data: data2 } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { email, password },
    });

    expect(data2.register).toHaveLength(1)
    expect(data2.register[0].path).toEqual('email')
});
