import { NextRequest, NextResponse } from "next/server";
import { fileApiRequests } from "@/apiRequests/file";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { message: "Không tìm thấy file upload" },
                { status: 400 }
            );
        }

        const res = await fileApiRequests.sUploadAvatar(file);

        return NextResponse.json(res.payload, { status: res.status });
    } catch (error: any) {
        console.error("❌ Lỗi upload file:", error);

        return NextResponse.json(
            {
                message: error?.message || "Upload file thất bại",
                error: error?.payload || null,
            },
            { status: error?.status || 500 }
        );
    }
}
