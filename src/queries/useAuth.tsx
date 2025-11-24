import authApiRequest from "@/apiRequests/auth";
import {
    LoginBodyType,
    LoginGoogleBodyType,
    RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import { useUserStore } from "@/stores/user-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: (body: Omit<RegisterBodyType, "confirmPassword">) =>
            authApiRequest.register(body),
    });
};

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: (body: LoginBodyType) => authApiRequest.login(body),
        onSuccess: async () => {
            // await queryClient.invalidateQueries({ queryKey: ["account"] });
            await queryClient.refetchQueries({
                queryKey: ["account"],
            });
            router.push("/");
        },
    });
};

export const useAccountQuery = () => {
    return useQuery({
        queryKey: ["account"],
        queryFn: () => authApiRequest.account(),
        retry: false,
        refetchOnMount: true,
    });
};

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { clearUser } = useUserStore();

    return useMutation({
        mutationFn: async () => await authApiRequest.logout(),
        onSuccess: async () => {
            localStorage.removeItem("access_token");
            document.cookie =
                "access_token=; Path=/; Max-Age=0; SameSite=Lax; Secure";

            clearUser();
            // await queryClient.removeQueries({ queryKey: ["account"] });
            await queryClient.invalidateQueries({ queryKey: ["account"] });
            router.push("/login");
        },
        onError: (error) => console.error("Logout failed:", error),
    });
};

export const useLoginGoogleMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (body: LoginGoogleBodyType) =>
            authApiRequest.loginGoogle(body),

        onSuccess: async () => {
            // await queryClient.invalidateQueries({ queryKey: ["account"] });
            await queryClient.refetchQueries({
                queryKey: ["account"],
            });
            router.push("/");
        },
    });
};
