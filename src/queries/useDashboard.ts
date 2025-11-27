import dashboardApiRequests from "@/apiRequests/dashboard";
import {
    AIRecommendRequestType,
    AIFeedbackRequestType,
} from "@/schemaValidations/dashboard.schema";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useTop5ProductsSold = () => {
    return useQuery({
        queryKey: ["top5-products-sold"],
        queryFn: () => dashboardApiRequests.getTop5ProductsSold(),
        staleTime: 1000 * 60 * 5, 
    });
};

export const useAIRecommendation = (
    params: AIRecommendRequestType,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: ["ai-recommendation", params.customerId, params.position],
        queryFn: () => dashboardApiRequests.getAIRecommendation(params),
        staleTime: 1000 * 60 * 5, 
        enabled: enabled && !!params.customerId,
    });
};


export const useAIFeedback = () => {
    return useMutation({
        mutationFn: (body: AIFeedbackRequestType) =>
            dashboardApiRequests.sendAIFeedback(body),
        onSuccess: (data) => {
            console.log("AI Feedback sent successfully:", data.payload);
        },
        onError: (error) => {
            console.error("AI Feedback error:", error);
        },
    });
};