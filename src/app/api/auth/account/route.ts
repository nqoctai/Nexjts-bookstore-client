import { NextResponse } from "next/server";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("access_token")?.value;
    const authHeader = request.headers.get("authorization");
    const headerToken = authHeader?.replace("Bearer ", "");

    // Nếu không có cả hai → chưa login
    if (!cookieToken && !headerToken) {
        return NextResponse.json(
            { data: { account: null }, message: "Chưa đăng nhập" },
            { status: 401 }
        );
    }

    // Nếu một trong hai token bị mất → trả 401 để FE refresh
    if (!cookieToken || !headerToken) {
        console.warn(
            "Token mất đồng bộ (cookie/local) → trả 401 để FE refresh"
        );
        return NextResponse.json(
            { data: { account: null }, message: "Token mất đồng bộ" },
            { status: 401 }
        );
    }

    //Ưu tiên header token
    const accessToken = headerToken || cookieToken;

    try {
        const { status, payload } = await authApiRequest.sAccount({
            headers: { Authorization: `Bearer ${accessToken}` },
            credentials: "include",
        });

        return NextResponse.json(payload, { status });
    } catch (error) {
        console.error("Account route error:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Lấy thông tin tài khoản thất bại" },
            { status: 500 }
        );
    }
}

// import { NextResponse } from "next/server";
// import authApiRequest from "@/apiRequests/auth";
// import { HttpError } from "@/lib/http";
// import { cookies } from "next/headers";

// export async function GET() {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("access_token")?.value;

//     if (!accessToken) {
//         return NextResponse.json(
//             { data: { account: null }, message: "Chưa đăng nhập" },
//             { status: 401 }
//         );
//     }

//     try {
//         const { status, payload } = await authApiRequest.sAccount({
//             headers: { Authorization: `Bearer ${accessToken}` },
//             credentials: "include",
//         });

//         return NextResponse.json(payload, { status });
//     } catch (error) {
//         console.error("Account route error:", error);

//         if (error instanceof HttpError) {
//             return NextResponse.json(error.payload, { status: error.status });
//         }

//         return NextResponse.json(
//             { message: "Lấy thông tin tài khoản thất bại" },
//             { status: 500 }
//         );
//     }
// }
