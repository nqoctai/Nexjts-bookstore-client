import http from "@/lib/http";
import {
    AccountResType,
    LoginBodyType,
    LoginGoogleBodyType,
    LoginGoogleResType,
    LoginResType,
    RefreshResType,
    RegisterBodyType,
    RegisterResType,
} from "@/schemaValidations/auth.schema";
import {
    ForgotPasswordEmailBodyType,
    ForgotPasswordEmailResType,
    ResendCodeBodyType,
    ResendCodeResType,
    ResetPasswordBodyType,
    ResetPasswordResType,
} from "@/schemaValidations/forgotPassword.schema";

const authApiRequest = {
    register: (body: Omit<RegisterBodyType, "confirmPassword">) =>
        http.post<RegisterResType>("/api/auth/register", body, {
            baseUrl: "",
        }),
    sRegister: (body: Omit<RegisterBodyType, "confirmPassword">) =>
        http.post<RegisterResType>("/api/v1/auth/register", body),
    login: (body: LoginBodyType) =>
        http.post<LoginResType>("/api/auth/login", body, {
            baseUrl: "",
        }),
    sLogin: (body: LoginBodyType) =>
        http.post<LoginResType>("/api/v1/auth/login", body),
    account: () =>
        http.get<AccountResType>("/api/auth/account", {
            baseUrl: "",
            // headers: {
            //     Authorization: `Bearer ${
            //         localStorage.getItem("access_token") || ""
            //     }`,
            // },
        }),
    sAccount: (options?: any) =>
        http.get<AccountResType>("/api/v1/auth/account", options),
    logout: () =>
        http.post(
            "/api/auth/logout",
            {},
            {
                baseUrl: "",
            }
        ),
    sLogout: (options?: any) => http.post("/api/v1/auth/logout", {}, options),
    sRefresh: (options?: any) =>
        http.get<RefreshResType>("/api/v1/auth/refresh", options),

    loginGoogle: (body: LoginGoogleBodyType) =>
        http.post<LoginGoogleResType>("/api/auth/login-google", body, {
            baseUrl: "",
        }),

    sLoginGoogle: (body: LoginGoogleBodyType, options?: any) =>
        http.post<LoginGoogleResType>(
            "/api/v1/auth/loginWithGoogle",
            body,
            options
        ),

    forgotPassword: (body: ForgotPasswordEmailBodyType) =>
        http.post<ForgotPasswordEmailResType>(
            "/api/auth/forgot-password",
            body,
            {
                baseUrl: "",
            }
        ),

    sForgotPassword: (email: string) =>
        http.post<ForgotPasswordEmailResType>(
            `/api/v1/auth/retry-password?email=${encodeURIComponent(email)}`,
            {}
        ),

    resendCode: (body: ResendCodeBodyType) =>
        http.post<ResendCodeResType>("/api/auth/resend-code", body, {
            baseUrl: "",
        }),

    sResendCode: (email: string) =>
        http.post<ResendCodeResType>(
            `/api/v1/auth/resend-code?email=${encodeURIComponent(email)}`,
            {}
        ),

    resetPassword: (body: ResetPasswordBodyType) =>
        http.post<ResetPasswordResType>("/api/auth/reset-password", body, {
            baseUrl: "",
        }),

    sResetPassword: (body: ResetPasswordBodyType) =>
        http.post<ResetPasswordResType>(
            "/api/v1/auth/change-password-retry",
            body
        ),
};

export default authApiRequest;
