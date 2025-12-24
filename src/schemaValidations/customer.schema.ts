import { z } from "zod";

export const UpdateCustomerBody = z.object({
    id: z.number(),
    name: z
        .string()
        .min(1, "Họ và tên không được để trống")
        .max(100, "Họ và tên quá dài"),
    address: z
        .string()
        .min(1, "Địa chỉ không được để trống")
        .max(255, "Địa chỉ quá dài"),
    phone: z
        .string()
        .regex(/^\d*$/, "Số điện thoại chỉ được chứa chữ số")
        .max(15, "Số điện thoại không hợp lệ")
        .optional()
        .or(z.literal("")),
    email: z
        .string()
        .email("Email không hợp lệ")
        .min(1, "Email không được để trống"),
    birthday: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Ngày sinh không hợp lệ",
        })
        .optional(),
    gender: z
        .enum(["Nam", "Nữ", "Khác"])
        .optional()
        .refine((val) => !!val, { message: "Vui lòng chọn giới tính" }),
});

export const UpdateCustomerRes = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        id: z.number(),
        name: z.string(),
        address: z.string(),
        phone: z.string(),
        email: z.string(),
        birthday: z.string(),
        gender: z.string(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    }),
    error: z.string().optional(),
});

export type UpdateCustomerBodyType = z.infer<typeof UpdateCustomerBody>;
export type UpdateCustomerResType = z.infer<typeof UpdateCustomerRes>;
