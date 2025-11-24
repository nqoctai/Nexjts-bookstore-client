import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerApiRequests } from "@/apiRequests/customer";
import { HttpError } from "@/lib/http";

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await customerApiRequests.sUpdateCustomer(
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken
                        ? { Authorization: `Bearer ${accessToken}` }
                        : {}),
                },
                credentials: "include",
            }
        );

        return NextResponse.json(payload, { status });
    } catch (error) {
        console.error("🔥 [API /customer] Lỗi:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Lỗi server khi cập nhật thông tin khách hàng" },
            { status: 500 }
        );
    }
}
