import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { accountApiRequests } from "@/apiRequests/account";
import { HttpError } from "@/lib/http";
import { updateAccountBody } from "@/schemaValidations/account.schema";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const parsed = updateAccountBody.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "❌ Dữ liệu cập nhật không hợp lệ",
                    errors: parsed.error,
                },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await accountApiRequests.sUpdateAccount(
            parsed.data,
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
        console.error("🔥 [API /account] Lỗi cập nhật tài khoản:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "❌ Lỗi server khi cập nhật tài khoản" },
            { status: 500 }
        );
    }
}
