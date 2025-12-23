import z from "zod";

export const ProductSchema = z.object({
    id: z.number(),
    barcode: z.string(),
    capitalPrice: z.number(),
    thumbnail: z.string(),
    name: z.string(),
    author: z.string(),
    price: z.number(),
    sold: z.number(),
    quantity: z.number(),
    isDeleted: z.number(),
    deletedBy: z.string(),
    deletedAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
    category: z.object({
        id: z.number(),
        name: z.string(),
        products: z.array(z.string()),
    }),
    genre: z.object({
        id: z.number(),
        name: z.string(),
        products: z.array(z.string()),
    }),
    productImages: z.array(
        z.object({
            id: z.number(),
            url: z.string(),
        })
    ),
});

// ĐỔI: book → product
const CartItemSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    price: z.number(),
    product: ProductSchema,
});

const CartSchema = z.object({
    id: z.number(),
    count: z.number(),
    sumPrice: z.number(),
    cartItems: z.array(CartItemSchema),
});

const ShippingStatusSchema = z.object({
    id: z.number(),
    label: z.string(),
    status: z.string(),
});

const OrderShippingEventSchema = z.object({
    id: z.number(),
    createdBy: z.string(),
    createdAt: z.string(),
    note: z.string(),
    shippingStatus: ShippingStatusSchema,
});

const PromotionSchema = z.object({
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
    note: z.string(),
    isDeleted: z.number(),
    deletedBy: z.string(),
    deletedAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
});

const OrderItemSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    price: z.number(),
    capitalPrice: z.number(),
    totalPrice: z.number(),
    totalCapitalPrice: z.number(),
    returnQty: z.number(),
    product: ProductSchema,
});

const OrderSchema = z.object({
    id: z.number(),
    code: z.string(),
    type: z.string(),
    totalPrice: z.number(),
    receiverEmail: z.string(),
    receiverName: z.string(),
    receiverAddress: z.string(),
    receiverPhone: z.string(),
    paymentMethod: z.string(),
    totalPromotionValue: z.number(),
    returnFee: z.number(),
    returnFeeType: z.string(),
    totalRefundAmount: z.number(),
    vnpTxnRef: z.string(),
    paymentStatus: z.string(),
    status: z.string(),
    isDeleted: z.number(),
    deletedBy: z.string(),
    deletedAt: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    orderItems: z.array(OrderItemSchema),
    orderShippingEvents: z.array(OrderShippingEventSchema),
    promotion: PromotionSchema,
    note: z.string(),
});

const CustomerSchema = z.object({
    id: z.number(),
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    birthday: z.string(),
    gender: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
    isOauthUser: z.boolean(),
    cart: CartSchema,
    orders: z.array(OrderSchema),
});

const AccountSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    avatar: z.string(),
    phone: z.string(),
    role: z.string(),
    customer: CustomerSchema,
});

//account

export const AccountRes = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        account: AccountSchema,
    }),
    error: z.string().optional().nullable(),
});

export type AccountResType = z.TypeOf<typeof AccountRes>;

// Login

export const LoginBody = z
    .object({
        username: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
            message: "Email không hợp lệ",
        }),
        password: z
            .string()
            .min(6, "Mật khẩu ít nhất là 6 kí tự")
            .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
    })
    .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        account: AccountSchema,
        access_token: z.string(),
    }),
    error: z.string().optional().nullable(),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

//Register

export const RegisterBody = z
    .object({
        username: z.string().trim().nonempty("Tên người dùng là bắt buộc"),
        password: z
            .string()
            .min(6, "Mật khẩu ít nhất là 6 kí tự")
            .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
        email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
            message: "Email không hợp lệ",
        }),
        phone: z
            .string()
            .trim()
            .refine((val) => /^\+?\d{9,15}$/.test(val), {
                message: "Số điện thoại không hợp lệ",
            }),
        confirmPassword: z.string().min(6, "Vui lòng xác nhận mật khẩu"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
            message: "Email không hợp lệ",
        }),
        username: z.string(),
        createdAt: z.string(),
    }),
    error: z.string().optional().nullable(),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const RefreshResSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        account: AccountSchema,
        access_token: z.string(),
    }),
    error: z.string().nullable().optional(),
});

export type RefreshResType = z.infer<typeof RefreshResSchema>;

export const LoginGoogleBody = z.object({
    idToken: z.string().nonempty("idToken là bắt buộc"),
});
export type LoginGoogleBodyType = z.TypeOf<typeof LoginGoogleBody>;

export const LoginGoogleRes = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        account: AccountSchema,
        access_token: z.string(),
    }),
    error: z.string().optional().nullable(),
});

export type LoginGoogleResType = z.TypeOf<typeof LoginGoogleRes>;
