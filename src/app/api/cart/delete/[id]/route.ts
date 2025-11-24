import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cartApiRequests } from "@/apiRequests/cart";
import { HttpError } from "@/lib/http";

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const cartItemId = Number(id);

        if (!cartItemId) {
            return NextResponse.json(
                { message: "❌ ID không hợp lệ" },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await cartApiRequests.sDeleteCart(
            cartItemId,
            {
                headers: {
                    ...(accessToken
                        ? { Authorization: `Bearer ${accessToken}` }
                        : {}),
                },
            }
        );

        return NextResponse.json(payload, { status });
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        return NextResponse.json(
            { message: "Lỗi server khi xóa sản phẩm khỏi giỏ hàng" },
            { status: 500 }
        );
    }
}
