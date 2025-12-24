import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import jwt from "jsonwebtoken";
import { LoginGoogleBodyType } from "@/schemaValidations/auth.schema";

export async function POST(request: Request) {
    const cookieStore = await cookies();

    try {
        const { idToken }: LoginGoogleBodyType = await request.json();

        if (!idToken) {
            return NextResponse.json(
                { message: "Thiếu idToken từ Firebase" },
                { status: 400 }
            );
        }

        const { status, payload, headers } = await authApiRequest.sLoginGoogle({
            idToken,
        });

        if (payload?.data?.account?.role === "ADMIN") {
            return NextResponse.json(
                {
                    message:
                        "Tài khoản ADMIN không được phép đăng nhập vào hệ thống này.",
                },
                { status: 403 }
            );
        }
        const accessToken = payload?.data?.access_token;
        const decode = jwt.decode(accessToken) as { exp: number };

        const setCookieHeader = headers.get("set-cookie");

        cookieStore.set("access_token", accessToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            expires: new Date(decode.exp * 1000),
        });

        const response = NextResponse.json(payload, { status });

        if (setCookieHeader) {
            response.headers.set("set-cookie", setCookieHeader);
        }

        return response;
    } catch (error) {
        console.error(" Login Google Error:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Login Google thất bại." },
            { status: 500 }
        );
    }
}
