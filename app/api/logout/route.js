import { NextResponse } from "next/server";
import cookie from "cookie";

async function POST(req) {
    // Logout logic will go here
    const serialized = cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });
    return NextResponse.json({ message: "Logout successful" }, { headers: { "Set-Cookie": serialized } });
}

export { POST };