import productApiRequests from "@/apiRequests/product";
import { ProductType } from "@/schemaValidations/product.schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useProducts = (query = "") => {
    return useQuery({
        queryKey: ["products", query],
        queryFn: () => productApiRequests.getProducts(query),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
    });
};

export const useProductDetail = (id?: number) => {
    return useQuery<ProductType>({
        queryKey: ["product-detail", id],
        queryFn: async () => {
            if (!id) throw new Error("Missing product ID");
            const res = await productApiRequests.getProductById(id);
            return res.payload.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60,
    });
};
