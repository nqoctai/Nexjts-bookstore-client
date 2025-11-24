import http from "@/lib/http";
import {
    UpdateAccountBodyType,
    UpdateAccountResType,
} from "@/schemaValidations/account.schema";
import {
    ChangePasswordBodyType,
    ChangePasswordResType,
} from "@/schemaValidations/changePassword.schema";

export const accountApiRequests = {
    updateAccount: (body: UpdateAccountBodyType) =>
        http.put<UpdateAccountResType>("/api/account", body, {
            baseUrl: "",
        }),
    sUpdateAccount: (body: UpdateAccountBodyType, options?: any) =>
        http.put<UpdateAccountResType>("/api/v1/account", body, options),
    changePassword: (body: ChangePasswordBodyType) =>
        http.post<ChangePasswordResType>("/api/account/change-password", body, {
            baseUrl: "",
        }),
    sChangePassword: (body: ChangePasswordBodyType, options?: any) =>
        http.post<ChangePasswordResType>(
            "/api/v1/account/change-password",
            body,
            options
        ),
};
