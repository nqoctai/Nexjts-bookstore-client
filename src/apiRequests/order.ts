import http from "@/lib/http";
import {
    CreateOrderBodyType,
    CreateOrderResType,
    GetOrderHistoryResType,
    UpdateOrderBodyType,
    UpdateOrderResType,
} from "@/schemaValidations/order.schema";

export const orderApiRequests = {
    createOrder: (body: CreateOrderBodyType) =>
        http.post<CreateOrderResType>("/api/order", body, {
            baseUrl: "",
        }),
    sCreateOrder: (body: CreateOrderBodyType, options?: any) =>
        http.post<CreateOrderResType>("/api/v1/order", body, options),
    getOrderHistory: (accountId: number) =>
        http.get<GetOrderHistoryResType>(`/api/order/history/${accountId}`, {
            baseUrl: "",
        }),
    sGetOrderHistory: (accountId: number, options?: any) =>
        http.get<GetOrderHistoryResType>(
            `/api/v1/order/history/${accountId}`,
            options
        ),
    updateOrderStatus: (body: UpdateOrderBodyType) =>
        http.put<UpdateOrderResType>("/api/order/update", body, {
            baseUrl: "",
        }),
    sUpdateOrderStatus: (body: UpdateOrderBodyType, options?: any) =>
        http.put<UpdateOrderResType>("/api/v1/order", body, options),
};
