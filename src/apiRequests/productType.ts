import http from "@/lib/http";
import { ProductTypeResponse } from "@/schemaValidations/productType.schema";

const productTypeApiRequests = {
    getProductTypes: () =>
        http.get<ProductTypeResponse>("/api/product-types", {
            baseUrl: "",
        }),
    sGetProductTypes: () =>
        http.get<ProductTypeResponse>("/api/v1/product-types"),
};

export default productTypeApiRequests;