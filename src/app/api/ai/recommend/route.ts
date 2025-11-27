import dashboardApiRequests from "@/apiRequests/dashboard";
import { AIRecommendRequestType } from "@/schemaValidations/dashboard.schema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    console.log("=== AI Recommend API Debug ===");
    console.log("access_token exists:", !!accessToken);

    if (!accessToken) {
        // Log all cookies để debug
        const allCookies = cookieStore.getAll();
        console.log("All cookies:", allCookies.map(c => c.name));
        return NextResponse.json(
            { message: "Unauthorized - No access_token cookie found" },
            { status: 401 }
        );
    }

    try {
        const body: AIRecommendRequestType = await request.json();
        console.log("Request body:", body);

        const response = await dashboardApiRequests.sGetAIRecommendation(body);
        console.log("Backend response status:", response.status);

        return NextResponse.json(response.payload, { status: 200 });
    } catch (error: unknown) {
        console.error("AI Recommendation error:", error);
        if (error && typeof error === "object" && "payload" in error) {
            const err = error as { payload?: unknown; status?: number };
            console.error("Backend error payload:", err.payload);
            console.error("Backend error status:", err.status);
            return NextResponse.json(
                {
                    message: "Backend Error",
                    error: err.payload,
                    data: [],
                },
                { status: err.status || 500 }
            );
        }

        return NextResponse.json(
            { message: "Internal Server Error", error: String(error), data: [] },
            { status: 500 }
        );
    }
}