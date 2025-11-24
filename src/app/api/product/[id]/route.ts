import { NextResponse } from "next/server";
import productApiRequests from "@/apiRequests/product";

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const res = await productApiRequests.sGetProductById(Number(id));

        if (!res || !res.payload?.data) {
            return NextResponse.json(
                { message: "Không tìm thấy sản phẩm" },
                { status: 400 }
            );
        }

        return NextResponse.json(res.payload);
    } catch (error: any) {
        console.error("❌ [API /api/product/:id] error:", error);
        return NextResponse.json(
            { message: error?.message || "Lỗi khi lấy chi tiết sản phẩm" },
            { status: error?.status || 500 }
        );
    }
}
