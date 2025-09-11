// Here User is authenticated using the token stored in the cookie.
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
    const { cookies } = req;
    const token = cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await dbConnect();
        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}