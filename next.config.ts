import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        qualities: [75, 100],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/storage/product/**",
            },
            {
                protocol: "http",
                hostname: "thebookheaven.io.vn",
                pathname: "/storage/product/**",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true, // Bỏ qua ESLint khi build
    },
};

export default nextConfig;
