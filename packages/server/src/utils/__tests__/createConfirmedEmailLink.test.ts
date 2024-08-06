import fetch from 'node-fetch';
import { User } from "../../entity/User";
import { createConfirmedEmailLink } from "../createConfirmedEmailLink";
import { REGISTER_CONSTANT } from '../../modules/register/constant';

let userId: string = "";

beforeAll(async () => {
    const user = await User.create({
        email: "don@don.com",
        password: "Test@123"
    }).save();

    userId = user.id;
});

describe("Make sure createConfirmedEmailLink.ts link works", () => {
    it("Is Email verification success", async () => {

        const url = await createConfirmedEmailLink(`http://${process.env.HOST}:${process.env.PORT}`, userId, globalThis.redis);

        const response = await fetch(url, {
            method: 'GET', // Change this to 'POST' if the URL is intended to trigger a GraphQL operation
            headers: {
                'Content-Type': 'application/json',
                'x-apollo-operation-name': 'TestOperation' // Optional: Adjust according to your server's requirements
            }
        });

        const json = await response.json();

        expect(json).toEqual({ message: REGISTER_CONSTANT.EMAIL_VERIFICATION_SUCCESSFUL })

        const user = await User.findOne({ 
            where: {
                id: userId
            }
        })
        
        expect((user as User).confirmed).toBeTruthy()

        const value = await globalThis.redis.get((user as User).id)
        expect(value).toBeNull()
    })

    it("Is Email verification failed", async () => {
        const url = await createConfirmedEmailLink(`http://${process.env.HOST}:${process.env.PORT}`, "userId", globalThis.redis);

        const response = await fetch(url, {
            method: 'GET', // Change this to 'POST' if the URL is intended to trigger a GraphQL operation
            headers: {
                'Content-Type': 'application/json',
                'x-apollo-operation-name': 'TestOperation' // Optional: Adjust according to your server's requirements
            }
        });

        const json = await response.json();
        expect(json).toEqual({ message: REGISTER_CONSTANT.EMAIL_VERIFICATION_FAILED })
    })
});
