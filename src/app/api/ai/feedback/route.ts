import dashboardApiRequests from "@/apiRequests/dashboard";
import { AIFeedbackRequestType } from "@/schemaValidations/dashboard.schema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return NextResponse.json(
            { message: "Unauthorized - No access_token cookie found" },
            { status: 401 }
        );
    }

    try {
        const body: AIFeedbackRequestType = await request.json();
        console.log("=== AI Feedback API ===");
        console.log("Request body:", body);

        const response = await dashboardApiRequests.sSendAIFeedback(body);
        console.log("Backend response:", response.payload);

        return NextResponse.json(response.payload, { status: 200 });
    } catch (error: unknown) {
        console.error("AI Feedback error:", error);

        if (error && typeof error === "object" && "payload" in error) {
            const err = error as { payload?: unknown; status?: number };
            return NextResponse.json(
                { message: "Backend Error", error: err.payload },
                { status: err.status || 500 }
            );
        }

        return NextResponse.json(
            { message: "Internal Server Error", error: String(error) },
            { status: 500 }
        );
    }
}