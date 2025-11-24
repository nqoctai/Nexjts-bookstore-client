import { z } from "zod";

export const ProductLiteSchema = z.object({
    id: z.number(),
    name: z.string(),
    author: z.string(),
    price: z.number(),
});

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    products: z.array(ProductLiteSchema),
});

export const CategoryResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.array(CategorySchema),
    error: z.string().nullable().optional(),
});

export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
