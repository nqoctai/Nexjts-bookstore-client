import http from "@/lib/http";
import {
    UpdateCustomerBodyType,
    UpdateCustomerResType,
} from "@/schemaValidations/customer.schema";

export const customerApiRequests = {
    updateCustomer: (body: UpdateCustomerBodyType) =>
        http.put<UpdateCustomerResType>("/api/customer", body, {
            baseUrl: "",
        }),

    sUpdateCustomer: (body: UpdateCustomerBodyType, options?: any) =>
        http.put<UpdateCustomerResType>("/api/v1/customer", body, options),
};
