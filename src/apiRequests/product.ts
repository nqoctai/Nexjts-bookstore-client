import http from "@/lib/http";
import {
    ProductDetailResponseType,
    ProductsResponseType,
} from "@/schemaValidations/product.schema";

const productApiRequests = {
    getProducts: (query = "") =>
        http.get<ProductsResponseType>(`/api/product?${query}`, {
            baseUrl: "",
        }),
    sGetProducts: (query = "") =>
        http.get<ProductsResponseType>(`/api/v1/products?${query}`),
    getProductById: (id: number) =>
        http.get<ProductDetailResponseType>(`/api/product/${id}`, {
            baseUrl: "",
        }),
    sGetProductById: (id: number) =>
        http.get<ProductDetailResponseType>(`/api/v1/products/${id}`),
};

export default productApiRequests;
