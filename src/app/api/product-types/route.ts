import { NextResponse } from "next/server";
import productTypeApiRequests from "@/apiRequests/productType";

export async function GET() {
    try {
        const res = await productTypeApiRequests.sGetProductTypes();

        if (!res || !res.payload || !res.payload.data) {
            return NextResponse.json(
                { message: "Không lấy được danh sách danh mục sản phẩm" },
                { status: res?.status || 500 }
            );
        }

        return NextResponse.json(res.payload);
    } catch (error: any) {
        console.error("❌ Lỗi khi lấy danh mục sản phẩm:", error);

        return NextResponse.json(
            {
                message: "Lỗi server khi gọi API product-types",
                error: error.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}
