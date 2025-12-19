import { NextResponse } from "next/server";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = body.email;

        if (!email) {
            return NextResponse.json(
                { message: "Email là bắt buộc" },
                { status: 400 }
            );
        }

        const { status, payload } = await authApiRequest.sForgotPassword(email);
        return NextResponse.json(payload, { status });
    } catch (error: any) {
        console.error("Forgot password route error:", error);
        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }
        return NextResponse.json(
            { message: "Gửi yêu cầu thất bại. Vui lòng thử lại." },
            { status: 500 }
        );
    }
}

