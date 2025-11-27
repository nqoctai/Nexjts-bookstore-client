import http from "@/lib/http";
import {
    Top5ProductsSoldResponseType,
    AIRecommendRequestType,
    AIRecommendResponseType,
    AIFeedbackRequestType,
    AIFeedbackResponseType,
} from "@/schemaValidations/dashboard.schema";

const dashboardApiRequests = {
    getTop5ProductsSold: () =>
        http.get<Top5ProductsSoldResponseType>(
            "/api/dashboard/get-top5-products-sold",
            { baseUrl: "" }
        ),
    sGetTop5ProductsSold: () =>
        http.get<Top5ProductsSoldResponseType>(
            "/api/v1/dashboard/get-top5-products-sold"
        ),

    getAIRecommendation: (body: AIRecommendRequestType) =>
        http.post<AIRecommendResponseType>("/api/ai/recommend", body, {
            baseUrl: "",
        }),
    sGetAIRecommendation: (body: AIRecommendRequestType) =>
        http.post<AIRecommendResponseType>("/api/v1/AI/recommend", body),
    sendAIFeedback: (body: AIFeedbackRequestType) =>
        http.post<AIFeedbackResponseType>("/api/ai/feedback", body, {
            baseUrl: "",
        }),
    sSendAIFeedback: (body: AIFeedbackRequestType) =>
        http.post<AIFeedbackResponseType>("/api/v1/AI/feedback", body),
};

export default dashboardApiRequests;