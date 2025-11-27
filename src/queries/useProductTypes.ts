"use client";

import productTypeApiRequests from "@/apiRequests/productType";
import { useQuery } from "@tanstack/react-query";

export const useProductTypes = () => {
    return useQuery({
        queryKey: ["product-types"],
        queryFn: () => productTypeApiRequests.getProductTypes(),
        staleTime: 1000 * 60 * 5, 
    });
};