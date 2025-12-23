import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: "Không tìm thấy access token" },
                { status: 401 }
            );
        }

        // Gọi BE để revoke token trong DB (refresh_token gửi kèm nhờ credentials: include)
        await authApiRequest.sLogout({
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Xóa cookie ở FE domain
        const response = NextResponse.json({ message: "Đăng xuất thành công" });

        response.cookies.set("access_token", "", {
            path: "/",
            maxAge: 0,
            sameSite: "lax",
            secure: true,
            httpOnly: true,
        });

        response.cookies.set("refresh_token", "", {
            path: "/",
            maxAge: 0,
            sameSite: "lax",
            secure: true,
            httpOnly: true,
        });

        return response;
    } catch (error) {
        console.error(" Logout route error:", error);
        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }
        return NextResponse.json(
            { message: "Đăng xuất thất bại. Vui lòng thử lại." },
            { status: 500 }
        );
    }
}
