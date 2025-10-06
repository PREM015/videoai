
import { NextRequest, NextResponse } from "next/server";
import { Connecttodatabase } from "../../../../../lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                {
                    error: "email and password are required",
                },
                {
                    status: 400,
                }
            );
        }
        await Connecttodatabase();

        const existUser = await User.findOne(email);
        if (existUser) {
            return NextResponse.json(
                {
                    error: "user alredy existed",
                },
                {
                    status: 400,
                }
            );
        }
        const createdUser = await User.create({
            email,
            password,
        });
        return NextResponse.json({
            message: "User created",
            user: createdUser,
        });
    } catch (error) {
        console.error("registration error", error)
        return NextResponse.json(
            {
                error: "failed to register",
            },
            {
                status: 400,
            }
        );
    }
}
