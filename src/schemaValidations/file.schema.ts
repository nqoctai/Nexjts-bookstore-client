import { z } from "zod";

export const uploadAvatarResSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        fileName: z.string(),
        uploadedAt: z.string().optional(),
    }),
    error: z.string().optional(),
});

export type UploadAvatarResType = z.infer<typeof uploadAvatarResSchema>;
