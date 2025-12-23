import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { orderApiRequests } from "@/apiRequests/order";
import { HttpError } from "@/lib/http";

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await orderApiRequests.sUpdateOrderStatus(
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
        console.error(" [API /order/update] Lỗi:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Lỗi server khi cập nhật trạng thái đơn hàng" },
            { status: 500 }
        );
    }
}
