import { z } from "zod";


export const ProductInTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
    author: z.string(),
    price: z.number(),
    thumbnail: z.string().nullable().optional(),
});


export const ProductTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
    products: z.array(ProductInTypeSchema),
});


export const ProductTypeResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.array(ProductTypeSchema),
    error: z.string().nullable().optional(),
});

export type ProductInType = z.infer<typeof ProductInTypeSchema>;
export type ProductTypeType = z.infer<typeof ProductTypeSchema>;
export type ProductTypeResponse = z.infer<typeof ProductTypeResponseSchema>;