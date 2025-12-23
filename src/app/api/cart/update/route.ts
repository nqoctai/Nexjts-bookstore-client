import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cartApiRequests } from "@/apiRequests/cart";
import { HttpError } from "@/lib/http";

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await cartApiRequests.sUpdateCart(body, {
            headers: {
                "Content-Type": "application/json",
                ...(accessToken
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {}),
            },
        });

        return NextResponse.json(payload, { status });
    } catch (error) {
        console.error(" [API /cart/update] Lỗi:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Lỗi server khi cập nhật giỏ hàng" },
            { status: 500 }
        );
    }
}
