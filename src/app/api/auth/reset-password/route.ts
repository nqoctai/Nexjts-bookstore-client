import { NextResponse } from "next/server";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { status, payload: responsePayload } =
            await authApiRequest.sResetPassword(body);
        return NextResponse.json(responsePayload, { status });
    } catch (error: any) {
        console.error("Reset password route error:", error);
        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }
        return NextResponse.json(
            { message: "Đổi mật khẩu thất bại. Vui lòng thử lại." },
            { status: 500 }
        );
    }
}
