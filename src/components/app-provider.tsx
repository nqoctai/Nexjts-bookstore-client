"use client";

import { useAccountQuery } from "@/queries/useAuth";
import { useUserStore } from "@/stores/user-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // refetchOnMount: false,
        },
    },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AccountInitializer />

            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

function AccountInitializer() {
    const { data } = useAccountQuery();
    const setUser = useUserStore((state) => state.setUser);
    useEffect(() => {
        console.log("Account data from query:", data);

        const account = data?.payload?.data?.account;
        if (account) {
            setUser(account);
        }
    }, [data, setUser]);

    return null;
}
