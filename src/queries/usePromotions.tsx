"use client";

import { useQuery } from "@tanstack/react-query";
import { promotionApiRequests } from "@/apiRequests/promotion";
import { PromotionsResponseType } from "@/schemaValidations/promotion.schema";

export function usePromotionsQuery(queryParam?: string) {
    return useQuery<PromotionsResponseType>({
        queryKey: ["promotions", queryParam || ""],
        queryFn: async () => {
            const res = await promotionApiRequests.getPromotions(queryParam);
            return res.payload;
        },
    });
}
