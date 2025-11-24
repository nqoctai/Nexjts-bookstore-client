import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/components/app-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "The Book Heaven - Quản lý nhà sách",
    description: "Ứng dụng quản lý nhà sách hiện đại và tiện lợi",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    geistSans.variable,
                    geistMono.variable,
                    "antialiased"
                )}
            >
                <AppProvider>
                    {children}
                    <Toaster
                        position="top-right"
                        richColors
                        expand
                        toastOptions={{
                            className: "font-semibold text-white shadow-lg",
                        }}
                    />
                </AppProvider>
            </body>
        </html>
    );
}
