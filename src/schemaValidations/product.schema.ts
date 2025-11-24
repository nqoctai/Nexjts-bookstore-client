import z from "zod";

export const ProductImageSchema = z.object({
    id: z.number(),
    url: z.string(),
});

export const CategoryProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    products: z
        .array(
            z.object({
                id: z.number(),
                name: z.string(),
                author: z.string(),
                price: z.number(),
            })
        )
        .optional(),
});

export const ProductSchema = z.object({
    id: z.number(),
    thumbnail: z.string().nullable().optional(),
    name: z.string(),
    author: z.string(),
    price: z.number(),
    sold: z.number(),
    quantity: z.number(),
    isDeleted: z.number().optional(),
    createdAt: z.string(),
    updatedAt: z.string().nullable().optional(),
    createdBy: z.string(),
    updatedBy: z.string().nullable().optional(),
    category: CategoryProductSchema,
    productImages: z.array(ProductImageSchema),
});

export const ProductsResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        meta: z.object({
            page: z.number(),
            pageSize: z.number(),
            pages: z.number(),
            total: z.number(),
        }),
        result: z.array(ProductSchema),
    }),
    error: z.string().nullable().optional(),
});

export const ProductDetailResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: ProductSchema,
    error: z.string().nullable().optional(),
});

export type ProductType = z.infer<typeof ProductSchema>;
export type ProductsResponseType = z.infer<typeof ProductsResponseSchema>;
export type ProductDetailResponseType = z.infer<
    typeof ProductDetailResponseSchema
>;
