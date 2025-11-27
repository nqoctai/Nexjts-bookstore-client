import z from "zod";

export const Top5ProductItemSchema = z.object({
    productId: z.number(),
    productName: z.string(),
    totalQuantity: z.number(),
    totalPrice: z.number(),
    thumbnail: z.string().nullable(),
    sold: z.number(),
});

export type Top5ProductItemType = z.infer<typeof Top5ProductItemSchema>;

export const Top5ProductsSoldResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.array(Top5ProductItemSchema),
});

export type Top5ProductsSoldResponseType = z.infer<
    typeof Top5ProductsSoldResponseSchema
>;


export const AIRecommendRequestSchema = z.object({
    customerId: z.number(),
    position: z.enum(["cart", "home", "search"]),
    topK: z.number().default(12),
});

export type AIRecommendRequestType = z.infer<typeof AIRecommendRequestSchema>;


export const AIRecommendProductSchema = z.object({
    id: z.number(),
    thumbnail: z.string().nullable(),
    name: z.string(),
    author: z.string().nullable(),
    price: z.number(),
    capitalPrice: z.number().optional(),
    sold: z.number(),
    quantity: z.number().optional(),
    isDeleted: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
    category: z.object({
        id: z.number(),
        name: z.string(),
        products: z.array(z.any()).optional(),
    }).optional(),
    productType: z.object({
        id: z.number(),
        name: z.string(),
        products: z.array(z.any()).optional(),
    }).optional(),
    productImages: z.array(z.object({
        id: z.number(),
        url: z.string(),
    })).optional(),
});

export type AIRecommendProductType = z.infer<typeof AIRecommendProductSchema>;


export const AIRecommendResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.array(AIRecommendProductSchema),
});

export type AIRecommendResponseType = z.infer<typeof AIRecommendResponseSchema>;


export const AIFeedbackRequestSchema = z.object({
    customerId: z.number(),
    action: z.number(), // Product ID
    position: z.enum(["cart", "home", "search"]),
    even_type: z.enum(["view", "addtocart", "transaction"]),
});

export type AIFeedbackRequestType = z.infer<typeof AIFeedbackRequestSchema>;

export const AIFeedbackResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.string(),
});

export type AIFeedbackResponseType = z.infer<typeof AIFeedbackResponseSchema>;