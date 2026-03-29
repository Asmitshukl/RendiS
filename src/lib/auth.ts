import {betterAuth} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {checkout , polar , portal } from "@polar-sh/better-auth"
import prisma from "./db";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database : prismaAdapter(prisma,{
        provider:"postgresql",
    }),
    emailAndPassword:{
        enabled:true,
        autoSignIn:true
    },
    plugins: [
        polar({
            client : polarClient,
            createCustomerOnSignUp :true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "5db4024a-a142-42f0-a110-24515dbb7f55",
                            slug: "RendiS-Pro" 
                        }
                    ],
                    successUrl:process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly:true
                }),
                portal(),
            ],
        })
    ]
});