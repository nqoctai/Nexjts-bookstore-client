import http from "@/lib/http";
import { PromotionsResponseType } from "@/schemaValidations/promotion.schema";

export const promotionApiRequests = {
    getPromotions: (queryParam?: string) =>
        http.get<PromotionsResponseType>(
            queryParam ? `/api/promotions?${queryParam}` : `/api/promotions`,
            { baseUrl: "" }
        ),
    sGetPromotions: (queryParam?: string, options?: any) =>
        http.get<PromotionsResponseType>(
            queryParam
                ? `/api/v1/promotions?${queryParam}`
                : `/api/v1/promotions`,
            options
        ),
};
