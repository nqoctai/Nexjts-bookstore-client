"use client";

import { fileApiRequests } from "@/apiRequests/file";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadAvatar = () => {
    return useMutation({
        mutationFn: fileApiRequests.uploadAvatar,
        onSuccess: (res) => {
            const fileName = res.payload?.data?.fileName;
        },
        onError: (error: any) => {
            if (error?.status === 401) {
                toast.error(
                    "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
                );
            } else {
                toast.error(
                    error?.message ||
                        "Upload avatar thất bại, vui lòng thử lại!"
                );
            }
        },
    });
};
