import http from "@/lib/http";
import { CategoryResponse } from "@/schemaValidations/category.schema";

const categoryApiRequests = {
    getCategories: () =>
        http.get<CategoryResponse>("/api/category", {
            baseUrl: "",
        }),
    sGetCategories: () => http.get<CategoryResponse>("/api/v1/categories"),
};

export default categoryApiRequests;
