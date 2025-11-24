import http from "@/lib/http";
import { CartResponseType } from "@/schemaValidations/cart.schema";

export const cartApiRequests = {
    addToCart: (body: { email: string; productId: number; quantity: number }) =>
        http.post<CartResponseType>("/api/cart/add", body, {
            baseUrl: "",
        }),

    sAddToCart: (
        body: { email: string; productId: number; quantity: number },
        options?: any
    ) => http.post<CartResponseType>("/api/v1/cart/add", body, options),
    updateCart: (body: {
        cartId: number;
        cartItemId: number;
        quantity: number;
    }) =>
        http.put<CartResponseType>("/api/cart/update", body, {
            baseUrl: "",
        }),
    sUpdateCart: (
        body: { cartId: number; cartItemId: number; quantity: number },
        options?: any
    ) => http.put<CartResponseType>(`/api/v1/cart/update`, body, options),
    deleteCart: (cartItemId: number) =>
        http.delete<CartResponseType>(`/api/cart/delete/${cartItemId}`, {
            baseUrl: "",
        }),
    sDeleteCart: (cartItemId: number, options?: any) =>
        http.delete<CartResponseType>(
            `/api/v1/cart/delete/${cartItemId}`,
            options
        ),
};
