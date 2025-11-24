"use client";

import { useMutation } from "@tanstack/react-query";
import { customerApiRequests } from "@/apiRequests/customer";
import { UpdateCustomerBodyType } from "@/schemaValidations/customer.schema";

export const useUpdateCustomer = () => {
    return useMutation({
        mutationFn: (body: UpdateCustomerBodyType) =>
            customerApiRequests.updateCustomer(body),
    });
};
