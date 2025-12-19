import authApiRequest from "@/apiRequests/auth";
import {
    ForgotPasswordEmailBodyType,
    ResendCodeBodyType,
    ResetPasswordBodyType,
} from "@/schemaValidations/forgotPassword.schema";
import { useMutation } from "@tanstack/react-query";

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (body: ForgotPasswordEmailBodyType) =>
            authApiRequest.forgotPassword(body),
    });
};

export const useResendCodeMutation = () => {
    return useMutation({
        mutationFn: (body: ResendCodeBodyType) =>
            authApiRequest.resendCode(body),
    });
};

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (body: ResetPasswordBodyType) =>
            authApiRequest.resetPassword(body),
    });
};
