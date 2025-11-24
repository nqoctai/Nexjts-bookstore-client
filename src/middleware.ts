import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/history", "/order", "/cart"];
const unAuthPaths = ["/login", "/register", "/contact"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value ?? "";

    let user: any = null;

    try {
        // Gửi cookie + Authorization header
        const res = await fetch(`${request.nextUrl.origin}/api/auth/account`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
                authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        });

        if (res.ok) {
            const data = await res.json();
            user = data?.data?.account || null;
        }
    } catch (error) {
        console.error("Middleware error:", error);
    }

    const isAuth = !!user;

    // Nếu CHƯA login mà vào trang private → bắt login
    if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Nếu đã login mà vào login/register/contact → đẩy về home
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
        "/contact",
    ],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const privatePaths = ["/history", "/order", "/cart"];
// const unAuthPaths = ["/login", "/register", "/contact"];

// export async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;
//     let user: any = null;

//     try {
//         const res = await fetch(`${request.nextUrl.origin}/api/auth/account`, {
//             headers: { cookie: request.headers.get("cookie") || "" },
//             credentials: "include",
//         });
//         // console.log("Cookies from FE ->", request.headers.get("cookie"));

//         if (res.ok) {
//             const data = await res.json();
//             user = data?.data?.account || null;
//             console.log("User from middleware:", user);
//         }
//     } catch (error) {
//         console.error("Middleware error:", error);
//     }

//     const isAuth = !!user;

//     if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
//         return NextResponse.redirect(new URL("/login", request.url));
//     }

//     if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
//         return NextResponse.redirect(new URL("/", request.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         "/history/:path*",
//         "/order/:path*",
//         "/cart/:path*",
//         "/login/:path*",
//         "/register/:path*",
//         "/contact/:path*",
//     ],
// };
