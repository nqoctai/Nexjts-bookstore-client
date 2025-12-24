import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/history", "/order", "/cart"];
const unAuthPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;

    if (privatePaths.some((path) => pathname.startsWith(path))) {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const res = await fetch(
                `${request.nextUrl.origin}/api/auth/account`,
                {
                    headers: {
                        cookie: request.headers.get("cookie") || "",
                    },
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                return NextResponse.redirect(new URL("/login", request.url));
            }

            const data = await res.json();
            const user = data?.data?.account || null;

            if (!user) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        } catch (error) {
            console.error("Middleware error:", error);
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
        if (accessToken) {
            try {
                const res = await fetch(
                    `${request.nextUrl.origin}/api/auth/account`,
                    {
                        headers: {
                            cookie: request.headers.get("cookie") || "",
                        },
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    const user = data?.data?.account || null;

                    if (user) {
                        return NextResponse.redirect(new URL("/", request.url));
                    }
                }
            } catch (error) {
                console.error("Middleware error:", error);
            }
        }
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
