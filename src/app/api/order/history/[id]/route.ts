import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { orderApiRequests } from "@/apiRequests/order";
import { HttpError } from "@/lib/http";

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await orderApiRequests.sGetOrderHistory(
            Number(id),
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
        console.error("🔥 [API /order/history/:id] Lỗi:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Lỗi server khi lấy lịch sử đơn hàng" },
            { status: 500 }
        );
    }
}
