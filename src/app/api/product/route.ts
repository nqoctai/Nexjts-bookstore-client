import productApiRequests from "@/apiRequests/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { search } = new URL(req.url);
    try {
        const res = await productApiRequests.sGetProducts(search.slice(1)); // bỏ dấu '?'

        return NextResponse.json(res.payload);
    } catch (error: any) {
        console.error(" [API /api/product] error:", error);
        return NextResponse.json(
            { message: error?.message || "Lỗi khi lấy danh sách sản phẩm" },
            { status: error?.status || 500 }
        );
    }
}
