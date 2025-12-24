import { NextResponse } from "next/server";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    try {
        const { status, payload, headers } = await authApiRequest.sRefresh({
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
            credentials: "include",
        });

        const accessToken = payload?.data?.access_token;
        const decodeAccessToken = jwt.decode(accessToken) as { exp: number };

        const setCookieHeader = headers.get("set-cookie");

        if (accessToken) {
            cookieStore.set("access_token", accessToken, {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: true,
                expires: new Date(decodeAccessToken.exp * 1000),
            });
        }

        const response = NextResponse.json(payload, { status });

        if (setCookieHeader) {
            response.headers.set("set-cookie", setCookieHeader);
        }

        return response;
    } catch (error) {
        console.error(" Refresh token route error:", error);
        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }
        return NextResponse.json(
            { message: "Làm mới token thất bại" },
            { status: 500 }
        );
    }
}
