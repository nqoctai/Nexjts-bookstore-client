import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cartApiRequests } from "@/apiRequests/cart";
import { HttpError } from "@/lib/http";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await cartApiRequests.sAddToCart(body, {
            headers: {
                "Content-Type": "application/json",
                ...(accessToken
                    ? { Authorization: `Bearer ${accessToken}` }
                    : {}),
            },
        });

        return NextResponse.json(payload, { status });
    } catch (error) {
        console.error("🔥 [API /cart/add] Lỗi:", error);

        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Lỗi server khi thêm sản phẩm vào giỏ hàng" },
            { status: 500 }
        );
    }
}
