import { z } from "zod";

export const ChangePasswordBody = z.object({
    email: z.string().email("Email không hợp lệ"),
    oldPassword: z
        .string()
        .min(6, "Mật khẩu cũ phải có ít nhất 6 ký tự")
        .max(50, "Mật khẩu cũ không được vượt quá 50 ký tự"),
    newPassword: z
        .string()
        .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
        .max(50, "Mật khẩu mới không được vượt quá 50 ký tự"),
});

export const ChangePasswordRes = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        id: z.number(),
        email: z.string().email(),
        username: z.string(),
        phone: z.string(),
        avatar: z.string().nullable(),
        updatedAt: z.string(),
        createdAt: z.string(),
        role: z.object({
            id: z.number(),
            name: z.string(),
        }),
        customer: z
            .object({
                id: z.number(),
                name: z.string().nullable(),
            })
            .nullable(),
        employee: z
            .object({
                id: z.number(),
                name: z.string().nullable(),
                fullName: z.string().nullable(),
            })
            .nullable(),
    }),
    error: z.string().nullable().optional(),
});

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBody>;
export type ChangePasswordResType = z.infer<typeof ChangePasswordRes>;
