import { NextResponse } from "next/server";
import authApiRequest from "@/apiRequests/auth";
import { RegisterBodyType } from "@/schemaValidations/auth.schema";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as RegisterBodyType;
        const { confirmPassword, ...payload } = body;
        const res = await authApiRequest.sRegister(payload);
        return NextResponse.json(res.payload, { status: res.status });
    } catch (error: any) {
        console.error("Register route error:", error);
        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }
        return NextResponse.json(
            { message: "Đăng ký thất bại. Vui lòng thử lại." },
            { status: 500 }
        );
    }
}
