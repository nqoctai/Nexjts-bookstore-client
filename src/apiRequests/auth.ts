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
};

export default authApiRequest;
