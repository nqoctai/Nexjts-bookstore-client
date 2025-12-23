import { z } from "zod";

/* ======================
   CREATE ORDER
====================== */
export const CreateOrderBody = z.object({
    accountId: z.number().min(1, "Thiếu mã tài khoản"),
    name: z.string().min(1, "Tên người nhận không được để trống"),
    address: z.string().min(1, "Địa chỉ giao hàng không được để trống"),
    phone: z
        .string()
        .min(8, "Số điện thoại không hợp lệ")
        .max(15, "Số điện thoại không hợp lệ"),
    email: z.string().email("Email không hợp lệ"),
    totalPrice: z.number().min(0, "Tổng tiền không hợp lệ"),
    promotionId: z.number().optional(),
    paymentMethod: z.enum(["cod", "transfer"]).refine((val) => !!val, {
        message: "Vui lòng chọn phương thức thanh toán",
    }),
    vnp_txn_ref: z.string().optional(),
});

export const CreateOrderRes = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        id: z.number(),
        code: z.string(),
        totalPrice: z.number(),
        receiverName: z.string(),
        receiverAddress: z.string(),
        receiverPhone: z.string(),
        paymentMethod: z.string(),
        paymentStatus: z.string(),
        status: z.string(),
        vnpTxnRef: z.string().optional(),
        customer: z.object({
            id: z.number(),
            name: z.string(),
            phone: z.string(),
            email: z.string(),
        }),
        orderItems: z.array(
            z.object({
                id: z.number(),
                quantity: z.number(),
                price: z.number(),
                product: z.object({
                    id: z.number(),
                    name: z.string(),
                    author: z.string(),
                    price: z.number(),
                }),
            })
        ),
        checkoutUrl: z.string().optional(),
        qrCode: z.string().optional(),
    }),
    error: z.string().optional(),
});

export type CreateOrderBodyType = z.infer<typeof CreateOrderBody>;
export type CreateOrderResType = z.infer<typeof CreateOrderRes>;

/* ======================
   COMMON SCHEMAS
====================== */
export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    author: z.string().nullable().optional(),
    price: z.number(),
    thumbnail: z.string().nullable().optional(),
});

export const OrderItemSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    price: z.number(),
    totalPrice: z.number(),
    capitalPrice: z.number(),
    totalCapitalPrice: z.number(),
    returnQty: z.number().optional().default(0),
    product: ProductSchema,
});

export const ShippingStatusSchema = z.object({
    id: z.number(),
    status: z.string(),
    label: z.string(),
    note: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
});

export const OrderShippingEventSchema = z.object({
    id: z.number(),
    shippingStatus: ShippingStatusSchema,
});

export const PromotionSchema = z
    .object({
        id: z.number(),
        code: z.string(),
        name: z.string(),
        status: z.string(),
        promotionType: z.string(),
        promotionValue: z.number(),
        isMaxPromotionValue: z.boolean(),
        maxPromotionValue: z.number(),
        orderMinValue: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        qtyLimit: z.number(),
        isOncePerCustomer: z.boolean(),
        note: z.string().nullable().optional(),
        isDeleted: z.number(),
        deletedBy: z.string().nullable().optional(),
        deletedAt: z.string().nullable().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
        createdBy: z.string(),
        updatedBy: z.string(),
    })
    .nullable()
    .optional();

export const CustomerSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
});

/* ======================
   GET ORDER HISTORY
====================== */
export const OrderHistoryItemSchema = z.object({
    id: z.number(),
    code: z.string(),
    type: z.string(),
    totalPrice: z.number(),
    receiverEmail: z.string(),
    receiverName: z.string(),
    totalPromotionValue: z.number(),
    returnFee: z.number(),
    returnFeeType: z.string().nullable().optional(),
    totalRefundAmount: z.number(),
    receiverAddress: z.string(),
    receiverPhone: z.string(),
    paymentMethod: z.string(),
    paymentStatus: z.string().nullable().optional(),
    status: z.string(),
    vnpTxnRef: z.string().nullable().optional(),
    createdBy: z.string(),
    updatedBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    customer: CustomerSchema,
    orderItems: z.array(OrderItemSchema),
    orderShippingEvents: z.array(OrderShippingEventSchema),
    promotion: PromotionSchema,
    returnOrders: z.array(z.string()).optional(),
    parentOrderId: z.number().nullable().optional(),
});

export const GetOrderHistoryRes = z.object({
    status: z.number(),
    message: z.string(),
    data: z.array(OrderHistoryItemSchema),
    error: z.string().nullable().optional(),
});

export type OrderHistoryItemType = z.infer<typeof OrderHistoryItemSchema>;
export type GetOrderHistoryResType = z.infer<typeof GetOrderHistoryRes>;

export const UpdateOrderBody = z.object({
    id: z.number().min(1, "Thiếu mã đơn hàng"),
    statusShipping: z.string().optional(),
    statusId: z.number().optional(),
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
    note: z.string().optional(),
});

export const UpdateOrderRes = z.object({
    status: z.number(),
    message: z.string(),
    data: OrderHistoryItemSchema,
    error: z.string().optional(),
});

export type UpdateOrderBodyType = z.infer<typeof UpdateOrderBody>;
export type UpdateOrderResType = z.infer<typeof UpdateOrderRes>;
