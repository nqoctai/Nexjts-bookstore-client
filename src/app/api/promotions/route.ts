import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promotionApiRequests } from "@/apiRequests/promotion";
import { HttpError } from "@/lib/http";

export async function GET(req: Request) {
    try {
        const { search } = new URL(req.url);

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const { status, payload } = await promotionApiRequests.sGetPromotions(
            search,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken
                        ? { Authorization: `Bearer ${accessToken}` }
                        : {}),
                },
            }
        );

        return NextResponse.json(payload, { status });
    } catch (error) {
        console.error(" [API /promotions] Lỗi:", error);

        // Xử lý lỗi từ HttpError (backend trả về)
        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status });
        }

        // Lỗi server bất ngờ
        return NextResponse.json(
            { message: "Lỗi server khi lấy danh sách khuyến mãi" },
            { status: 500 }
        );
    }
}
