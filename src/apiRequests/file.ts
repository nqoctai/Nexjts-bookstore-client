import http from "@/lib/http";
import { UploadAvatarResType } from "@/schemaValidations/file.schema";

export const fileApiRequests = {
    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "avatar");

        return http.post<UploadAvatarResType>("/api/files", formData, {
            baseUrl: "",
            headers: {},
        });
    },

    sUploadAvatar: (file: File, options?: any) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "avatar");

        return http.post<UploadAvatarResType>("api/v1/files", formData, {
            ...options,
            headers: {},
        });
    },
};
