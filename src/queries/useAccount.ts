"use client";

import { useMutation } from "@tanstack/react-query";
import { accountApiRequests } from "@/apiRequests/account";
import { UpdateAccountBodyType } from "@/schemaValidations/account.schema";
import { ChangePasswordBodyType } from "@/schemaValidations/changePassword.schema";

export const useUpdateAccount = () => {
    return useMutation({
        mutationFn: (body: UpdateAccountBodyType) =>
            accountApiRequests.updateAccount(body),
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (body: ChangePasswordBodyType) =>
            accountApiRequests.changePassword(body),
    });
};
