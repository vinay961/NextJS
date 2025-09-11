import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        
        if(!name || !email || !password){
            return NextResponse.json({error: "Please fill all the fields"}, {status: 400});
        }
        console.log(email, password);
        await dbConnect();
    
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }
    
        const hashedPassword = await bcrypt.hash(password, 12); // Here 12 is the salt rounds, which determines the complexity of the hashing. Higher values are more secure but take longer to compute.
        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();
    
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        // Now We are sending this token to client, using cookie.serialize, which takes three arguments, the name of the cookie, the value of the cookie and an options object.
        // The options object here is used to set various properties of the cookie, such as httpOnly, secure, sameSite, maxAge and path.
        // httpOnly: true means that the cookie cannot be accessed via JavaScript, which helps to prevent XSS attacks.
        // secure: process.env.NODE_ENV === "production" means that the cookie will only be sent over HTTPS in production environment.
        // sameSite: "strict" means that the cookie will only be sent in a first-party context, which helps to prevent CSRF attacks.
        // maxAge: 86400 means that the cookie will expire in 86400 seconds (1 day).
        // path: "/" means that the cookie will be sent for all paths in the domain.
        const serialized = cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400,
            path: "/"
        });
        return NextResponse.json({message: "User registered successfully"}, {status: 201, headers: {"Set-Cookie": serialized}});
    } catch (error) {
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

