import z from "zod";
import { ProductSchema } from "./product.schema";

export const CartItemSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    price: z.number(),
    product: ProductSchema,
});

export const CartResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        id: z.number(),
        count: z.number(),
        sumPrice: z.number(),
        cartItems: z.array(CartItemSchema),
    }),
    error: z.string().nullable().optional(),
});

export type CartItemType = z.infer<typeof CartItemSchema>;
export type CartResponseType = z.infer<typeof CartResponseSchema>;
