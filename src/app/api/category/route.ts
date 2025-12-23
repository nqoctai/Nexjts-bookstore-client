import { NextResponse } from "next/server";
import categoryApiRequests from "@/apiRequests/category";

export async function GET() {
    try {
        const res = await categoryApiRequests.sGetCategories();

        if (!res || !res.payload || !res.payload.data) {
            return NextResponse.json(
                { message: "Không lấy được danh sách thể loại" },
                { status: res?.status || 500 }
            );
        }

        return NextResponse.json(res.payload);
    } catch (error: any) {
        console.error(" Lỗi khi lấy thể loại:", error);

        return NextResponse.json(
            {
                message: "Lỗi server khi gọi API category",
                error: error.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}
