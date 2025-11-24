"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApiRequests } from "@/apiRequests/order";
import {
    CreateOrderBodyType,
    GetOrderHistoryResType,
    UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: (body: CreateOrderBodyType) =>
            orderApiRequests.createOrder(body),
    });
};

export const useOrderHistory = (accountId: number) => {
    return useQuery<GetOrderHistoryResType>({
        queryKey: ["order-history", accountId],
        queryFn: async () => {
            const { payload } = await orderApiRequests.getOrderHistory(
                accountId
            );
            return payload;
        },
        enabled: !!accountId,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: UpdateOrderBodyType) =>
            orderApiRequests.updateOrderStatus(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["order-history"] });
        },
    });
};

export const useCancelOrder = () => {
    const updateMutation = useUpdateOrderStatus();

    const cancelOrder = (
        orderId: number,
        statusId: number,
        options?: { onSuccess?: () => void }
    ) => {
        updateMutation.mutate(
            { id: orderId, statusId },
            {
                onSuccess: () => {
                    updateMutation.reset();
                    options?.onSuccess?.();
                },
            }
        );
    };

    return { ...updateMutation, cancelOrder };
};
