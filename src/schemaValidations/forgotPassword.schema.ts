import { z } from "zod";

export const ForgotPasswordEmailBody = z.object({
    email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
        message: "Email không hợp lệ",
    }),
});

export type ForgotPasswordEmailBodyType = z.TypeOf<
    typeof ForgotPasswordEmailBody
>;

export const ForgotPasswordEmailRes = z.object({
    status: z.number(),
    message: z.string(),
    error: z.string().optional().nullable(),
});

export type ForgotPasswordEmailResType = z.TypeOf<
    typeof ForgotPasswordEmailRes
>;

export const ResendCodeBody = z.object({
    email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
        message: "Email không hợp lệ",
    }),
});

export type ResendCodeBodyType = z.TypeOf<typeof ResendCodeBody>;

export const ResendCodeRes = z.object({
    status: z.number(),
    message: z.string(),
    error: z.string().optional().nullable(),
});

export type ResendCodeResType = z.TypeOf<typeof ResendCodeRes>;

export const ResetPasswordBody = z.object({
    email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
        message: "Email không hợp lệ",
    }),
    code: z.string().min(6, "Mã xác nhận phải có 6 ký tự"),
    password: z
        .string()
        .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
        .max(50, "Mật khẩu mới không được vượt quá 50 ký tự"),
});

export type ResetPasswordBodyType = z.TypeOf<typeof ResetPasswordBody>;

export const ResetPasswordRes = z.object({
    status: z.number(),
    message: z.string(),
    error: z.string().optional().nullable(),
});

export type ResetPasswordResType = z.TypeOf<typeof ResetPasswordRes>;
