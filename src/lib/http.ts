import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import {
    LoginGoogleResType,
    LoginResType,
} from "@/schemaValidations/auth.schema";

type CustomOptions = Omit<RequestInit, "method"> & {
    baseUrl?: string;
};

export class HttpError extends Error {
    status: number;
    payload: any;

    constructor(status: number, payload: any, message?: string) {
        super(message || "HTTP Error");
        this.status = status;
        this.payload = payload;
    }
}

const isClient = typeof window !== "undefined";

const handleRefreshToken = async (): Promise<string | null> => {
    try {
        console.log("%cGọi API refresh token...", "color: orange;");
        const res = await fetch("/api/auth/refresh-token", {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            console.warn("Refresh token thất bại:", res.status);
            return null;
        }

        const data = await res.json();
        const newAccessToken = data?.data?.access_token;

        if (newAccessToken && isClient) {
            localStorage.setItem("access_token", newAccessToken);
            console.log("%cRefresh token thành công!", "color: green;");
            return newAccessToken;
        }

        return null;
    } catch (err) {
        console.error("Lỗi khi refresh token:", err);
        return null;
    }
};

const request = async <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    options?: CustomOptions,
    isRetry = false
): Promise<{ status: number; payload: T; headers: Headers }> => {
    let body: FormData | string | undefined;

    if (options?.body instanceof FormData) {
        body = options.body;
    } else if (options?.body) {
        body = JSON.stringify(options.body);
    }

    const baseHeaders: Record<string, string> =
        body instanceof FormData ? {} : { "Content-Type": "application/json" };

    if (isClient) {
        const token = localStorage.getItem("access_token");
        if (token) {
            baseHeaders.Authorization = `Bearer ${token}`;
        }
    }

    const baseUrl =
        options?.baseUrl === undefined
            ? envConfig.NEXT_PUBLIC_API_ENDPOINT
            : options.baseUrl;

    const fullUrl = `${baseUrl}/${normalizePath(url)}`;

    const res = await fetch(fullUrl, {
        ...options,
        method,
        credentials: "include",
        headers: {
            ...baseHeaders,
            ...options?.headers,
        } as HeadersInit,
        body,
    });

    let payload: any = {};
    try {
        payload = await res.json();
    } catch {
        // Không có JSON trong response (204, v.v.)
    }

    // Nếu BE trả 401 → refresh token và retry lại request

    if (
        res.status === 401 &&
        !normalizePath(url).includes("auth/refresh-token") &&
        !isRetry
    ) {
        console.warn(
            "%cToken hết hạn hoặc thiếu, đang gọi refresh...",
            "color: orange;"
        );
        const newToken = await handleRefreshToken();

        if (newToken) {
            console.log(
                "%cRefresh thành công, retry lại request với token mới...",
                "color: green;"
            );

            // Cập nhật lại header Authorization với token mới
            const newOptions = {
                ...options,
                headers: {
                    ...(options?.headers || {}),
                    Authorization: `Bearer ${newToken}`,
                },
            };

            // Retry lại request, set isRetry = true để tránh lặp vô hạn
            return request<T>(method, url, newOptions, true);
        } else {
            // console.log("%cRefresh thất bại, cần login lại!", "color: red;");
            if (isClient) localStorage.removeItem("access_token");
            throw new HttpError(401, payload, "Phiên đăng nhập đã hết hạn");
        }
    }

    // Nếu vẫn lỗi (không phải 401 hoặc đã retry rồi)
    if (!res.ok) {
        const message = (payload as any)?.message || "Yêu cầu thất bại";
        throw new HttpError(res.status, payload, message);
    }

    //Nếu là login → lưu access_token mới

    if (isClient) {
        const normalizedUrl = normalizePath(url);

        if (normalizedUrl === "api/auth/login") {
            const { access_token } = (payload as LoginResType).data;
            localStorage.setItem("access_token", access_token);
        }

        if (normalizedUrl === "api/auth/login-google") {
            const { access_token } = (payload as LoginGoogleResType).data;
            localStorage.setItem("access_token", access_token);
        }

        if (normalizedUrl === "api/auth/logout") {
            localStorage.removeItem("access_token");
        }
    }

    return {
        status: res.status,
        payload,
        headers: res.headers,
    };
};

const http = {
    get<T>(url: string, options?: Omit<CustomOptions, "body">) {
        return request<T>("GET", url, options);
    },
    post<T>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
        return request<T>("POST", url, { ...options, body });
    },
    put<T>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
        return request<T>("PUT", url, { ...options, body });
    },
    delete<T>(url: string, options?: Omit<CustomOptions, "body">) {
        return request<T>("DELETE", url, options);
    },
};

export default http;
