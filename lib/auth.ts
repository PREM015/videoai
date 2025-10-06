import { NextAuthOptions } from "next-auth";
import User from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import { Connecttodatabase } from "./db";
import bcrypt from "bcryptjs";

export const authoptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || credentials?.password) {
                    throw new Error("missing email or password");
                }
                try {
                    await Connecttodatabase();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("no user find");
                    }
                    const isvaild = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isvaild) {
                        throw new Error("passowrd is inncorect");
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email

                    }

                } catch (error) {
                    console.error("auth error", error)
                    throw error
                }
            },
        }),

    ],

    callbacks: {
        // Called whenever a JWT token is created or updated
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        // Called whenever a session is checked or created
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60,
    },
    secret:process.env.NEXT_AUTH_SECRET

};
