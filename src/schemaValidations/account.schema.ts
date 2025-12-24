import { z } from "zod";

export const updateAccountBody = z.object({
    id: z.number().optional(),
    email: z.string().email("Email không hợp lệ").optional(),
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    phone: z
        .string()
        .regex(/^\d*$/, "Số điện thoại chỉ được chứa chữ số")
        .min(0)
        .max(15, "Số điện thoại quá dài")
        .optional()
        .or(z.literal("")),
    avatar: z.string().nullable().optional(),
});

export const updateAccountRes = z.object({
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
        role: z
            .object({
                id: z.number(),
                name: z.string(),
            })
            .nullable(),
        customer: z
            .object({
                id: z.number(),
                name: z.string(),
            })
            .nullable(),
        employee: z
            .object({
                id: z.number(),
                name: z.string(),
                fullName: z.string(),
            })
            .nullable(),
    }),
    error: z.string().nullable().optional(),
});

export type UpdateAccountBodyType = z.infer<typeof updateAccountBody>;
export type UpdateAccountResType = z.infer<typeof updateAccountRes>;
