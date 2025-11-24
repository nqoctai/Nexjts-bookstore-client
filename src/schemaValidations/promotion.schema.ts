import { z } from "zod";

export const PromotionSchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    status: z.string(),
    promotionType: z.enum(["percent", "value", "freeship"]),
    promotionValue: z.number(),
    isMaxPromotionValue: z.boolean(),
    maxPromotionValue: z.number(),
    orderMinValue: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    qtyLimit: z.number(),
    isOncePerCustomer: z.boolean(),
    note: z.string().nullable().optional(),
});

export const PromotionMetaSchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    pages: z.number(),
    total: z.number(),
});

export const PromotionsResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        meta: PromotionMetaSchema,
        result: z.array(PromotionSchema),
    }),
    error: z.string().nullable().optional(),
});

export const PromotionDetailResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: PromotionSchema,
    error: z.string().nullable().optional(),
});

export type PromotionType = z.infer<typeof PromotionSchema>;
export type PromotionsResponseType = z.infer<typeof PromotionsResponseSchema>;
export type PromotionDetailResponseType = z.infer<
    typeof PromotionDetailResponseSchema
>;
