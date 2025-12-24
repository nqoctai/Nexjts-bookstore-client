import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { accountApiRequests } from "@/apiRequests/account";
import { HttpError } from "@/lib/http";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await accountApiRequests.sChangePassword(
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken
                        ? { Authorization: `Bearer ${accessToken}` }
                        : {}),
                },
            }
        );

        return NextResponse.json(payload, { status });
    } catch (error) {
        console.error("[API /account/change-password] Lỗi:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Lỗi server khi đổi mật khẩu" },
            { status: 500 }
        );
    }
}
