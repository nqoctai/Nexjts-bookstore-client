import { NextResponse } from "next/server";
import dashboardApiRequests from "@/apiRequests/dashboard";

export async function GET() {
    try {
        const res = await dashboardApiRequests.sGetTop5ProductsSold();

        if (!res || !res.payload?.data) {
            return NextResponse.json(
                { message: "Không thể lấy dữ liệu top 5 sản phẩm" },
                { status: 400 }
            );
        }

        return NextResponse.json(res.payload);
    } catch (error: any) {
        console.error("❌ [API /api/dashboard/get-top5-products-sold] error:", error);
        return NextResponse.json(
            { message: error?.message || "Lỗi khi lấy top 5 sản phẩm bán chạy" },
            { status: error?.status || 500 }
        );
    }
}