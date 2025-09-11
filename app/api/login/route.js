import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

async function POST(req){
    const {email, password} = await req.json();

    if(!email || !password){
        return NextResponse.json({error: "Please fill all the fields"}, {status: 400});
    }

    try{
        await dbConnect();
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "Invalid email or password"}, {status: 401});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return NextResponse.json({error: "Invalid email or password"}, {status: 401});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        const serialized = cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400,
            path: "/"
        });
        return NextResponse.json({message: "Login successful"}, {status: 200, headers: {"Set-Cookie": serialized}});
    } catch (error) {
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}