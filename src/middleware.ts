import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/history", "/order", "/cart"];
const unAuthPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;

    let user: any = null;

    if (accessToken) {
        try {
            const res = await fetch(
                `${request.nextUrl.origin}/api/auth/account`,
                {
                    headers: {
                        cookie: request.headers.get("cookie") || "",
                    },
                    credentials: "include",
                }
            );

            if (res.ok) {
                const data = await res.json();
                user = data?.data?.account || null;
            }
        } catch (error) {
            console.error("Middleware error:", error);
        }
    }

    const isAuth = !!user;

    if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuth && unAuthPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/history/:path*",
        "/order/:path*",
        "/cart/:path*",
        "/login",
        "/register",
    ],
};
