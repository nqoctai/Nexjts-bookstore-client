"use client";

import Image from "next/image";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import { useDeleteCart, useUpdateCart } from "@/queries/useCart";
import { useAccountQuery } from "@/queries/useAuth";
import { useState } from "react";
import CheckoutForm from "@/components/cart/CheckoutForm";

export default function OrderPage() {
    const { user } = useUserStore();
    const { refetch: refetchAccount } = useAccountQuery();
    const { mutate: updateCart, isPending } = useUpdateCart();
    const { mutate: deleteCart } = useDeleteCart();
    const [step, setStep] = useState(1);
    const [tempQuantities, setTempQuantities] = useState<
        Record<number, number>
    >({});

    if (!user) {
        toast.warning("Bạn cần đăng nhập để xem giỏ hàng");
        return null;
    }

    const cart = user?.customer?.cart;
    const cartItems = cart?.cartItems ?? [];

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price ?? 0),
        0
    );

    const handleQuantityChange = (
        value: number,
        itemId: number,
        stockQuantity: number,
        shouldUpdateAPI = false
    ) => {
        if (isNaN(value) || value < 1) {
            setTempQuantities((prev) => ({ ...prev, [itemId]: 1 }));
            toast.warning("Số lượng phải lớn hơn 0");
            return;
        }

        if (stockQuantity && value > stockQuantity) {
            toast.error(`Vượt quá số lượng tồn kho (${stockQuantity})`);
            setTempQuantities((prev) => ({ ...prev, [itemId]: 1 }));
            return;
        }

        setTempQuantities((prev) => ({ ...prev, [itemId]: value }));

        // Nếu shouldUpdateAPI = true (từ spinner arrows), gọi API ngay
        if (shouldUpdateAPI) {
            const cartId = cart?.id ?? 0;
            updateCart(
                { cartId, cartItemId: itemId, quantity: value },
                {
                    onSuccess: async () => {
                        await refetchAccount();
                        setTempQuantities((prev) => {
                            const newState = { ...prev };
                            delete newState[itemId];
                            return newState;
                        });
                    },
                }
            );
        }
    };

    const handleQuantityButton = (
        action: "plus" | "minus",
        itemId: number,
        currentQuantity: number,
        stockQuantity: number
    ) => {
        const newQuantity =
            action === "plus" ? currentQuantity + 1 : currentQuantity - 1;

        if (newQuantity < 1) {
            toast.warning("Số lượng tối thiểu là 1");
            return;
        }

        if (newQuantity > stockQuantity) {
            toast.error(`Vượt quá số lượng tồn kho (${stockQuantity})`);
            return;
        }

        const cartId = cart?.id ?? 0;
        updateCart(
            { cartId, cartItemId: itemId, quantity: newQuantity },
            {
                onSuccess: async () => {
                    await refetchAccount();
                    setTempQuantities((prev) => {
                        const newState = { ...prev };
                        delete newState[itemId];
                        return newState;
                    });
                },
            }
        );
    };

    const handleBlur = (
        itemId: number,
        value: number,
        stockQuantity: number
    ) => {
        if (isNaN(value) || value < 1) {
            setTempQuantities((prev) => ({ ...prev, [itemId]: 1 }));
            toast.warning("Số lượng phải lớn hơn 0");
            return;
        }

        if (stockQuantity && value > stockQuantity) {
            toast.error(`Vượt quá số lượng tồn kho (${stockQuantity})`);
            setTempQuantities((prev) => ({ ...prev, [itemId]: 1 }));
            return;
        }

        const cartId = cart?.id ?? 0;
        updateCart(
            { cartId, cartItemId: itemId, quantity: value },
            {
                onSuccess: async () => {
                    await refetchAccount();
                    setTempQuantities((prev) => {
                        const newState = { ...prev };
                        delete newState[itemId];
                        return newState;
                    });
                },
            }
        );
    };

    const handleDelete = (cartItemId: number) => {
        if (!cartItemId) return;
        deleteCart(cartItemId, {
            onSuccess: async () => await refetchAccount(),
        });
    };

    const validateCartBeforeCheckout = () => {
        for (const item of cartItems) {
            const currentQuantity = tempQuantities[item.id] ?? item.quantity;
            const stockQuantity = item.product?.quantity ?? 0;

            if (currentQuantity > stockQuantity) {
                toast.error(
                    `Sản phẩm "${item.product?.name}" vượt quá số lượng tồn kho (${stockQuantity})`
                );
                setTempQuantities((prev) => ({ ...prev, [item.id]: 1 }));
                return false;
            }
        }
        return true;
    };

    const handleProceedToCheckout = () => {
        if (validateCartBeforeCheckout()) {
            setStep(2);
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8">
                <div className="flex-1">
                    <div className="flex items-center mb-6">
                        {/* Bước 1 */}
                        <div
                            className={`flex items-center font-semibold text-lg ${
                                step >= 1 ? "text-blue-600" : "text-gray-400"
                            }`}
                        >
                            <span
                                className={`border-2 ${
                                    step >= 1
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                } w-6 h-6 flex items-center justify-center rounded-full mr-2`}
                            >
                                1
                            </span>
                            Đơn hàng
                        </div>

                        <div
                            className={`flex-1 mx-4 border-t ${
                                step >= 2
                                    ? "border-blue-500"
                                    : "border-gray-200"
                            }`}
                        ></div>

                        {/* Bước 2 */}
                        <div
                            className={`flex items-center font-semibold text-lg ${
                                step >= 2 ? "text-blue-600" : "text-gray-400"
                            }`}
                        >
                            <span
                                className={`border-2 ${
                                    step >= 2
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                } w-6 h-6 flex items-center justify-center rounded-full mr-2`}
                            >
                                2
                            </span>
                            Đặt hàng
                        </div>

                        <div
                            className={`flex-1 mx-4 border-t ${
                                step >= 3
                                    ? "border-blue-500"
                                    : "border-gray-200"
                            }`}
                        ></div>

                        {/* Bước 3 */}
                        <div
                            className={`flex items-center font-semibold text-lg ${
                                step >= 3 ? "text-blue-600" : "text-gray-400"
                            }`}
                        >
                            <span
                                className={`border-2 ${
                                    step >= 3
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                } w-6 h-6 flex items-center justify-center rounded-full mr-2`}
                            >
                                3
                            </span>
                            Thanh toán
                        </div>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 py-16">
                            Giỏ hàng trống ...
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border rounded-lg p-4 hover:shadow-sm transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-20">
                                            <Image
                                                src={
                                                    item.product?.thumbnail
                                                        ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/product/${item.product.thumbnail}`
                                                        : "/images/placeholder.jpg"
                                                }
                                                alt={item.product?.name || ""}
                                                fill
                                                className="object-cover rounded-md"
                                                unoptimized
                                            />
                                        </div>
                                        <div>
                                            <p className="text-gray-800 font-medium mb-1 max-w-[300px]">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                {item.product?.price?.toLocaleString(
                                                    "vi-VN"
                                                )}{" "}
                                                ₫
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border rounded-lg overflow-hidden h-10">
                                            <button
                                                onClick={() =>
                                                    handleQuantityButton(
                                                        "minus",
                                                        item.id,
                                                        tempQuantities[
                                                            item.id
                                                        ] ?? item.quantity,
                                                        item.product
                                                            ?.quantity ?? 0
                                                    )
                                                }
                                                disabled={isPending}
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <input
                                                type="number"
                                                min={1}
                                                max={
                                                    item.product?.quantity ||
                                                    999
                                                }
                                                disabled={isPending}
                                                value={
                                                    tempQuantities[item.id] ??
                                                    item.quantity
                                                }
                                                onChange={(e) => {
                                                    const value = Number(
                                                        e.target.value
                                                    );
                                                    handleQuantityChange(
                                                        value,
                                                        item.id,
                                                        item.product
                                                            ?.quantity ?? 0,
                                                        false
                                                    );
                                                }}
                                                onBlur={(e) =>
                                                    handleBlur(
                                                        item.id,
                                                        Number(e.target.value),
                                                        item.product
                                                            ?.quantity ?? 0
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    // Bắt sự kiện khi nhấn mũi tên lên/xuống
                                                    if (
                                                        e.key === "ArrowUp" ||
                                                        e.key === "ArrowDown"
                                                    ) {
                                                        e.preventDefault();
                                                        const currentValue =
                                                            tempQuantities[
                                                                item.id
                                                            ] ?? item.quantity;
                                                        const newValue =
                                                            e.key === "ArrowUp"
                                                                ? currentValue +
                                                                  1
                                                                : currentValue -
                                                                  1;

                                                        handleQuantityChange(
                                                            newValue,
                                                            item.id,
                                                            item.product
                                                                ?.quantity ?? 0,
                                                            true // Gọi API ngay
                                                        );
                                                    }
                                                }}
                                                className="w-12 text-center border-x outline-none text-gray-800 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleQuantityButton(
                                                        "plus",
                                                        item.id,
                                                        tempQuantities[
                                                            item.id
                                                        ] ?? item.quantity,
                                                        item.product
                                                            ?.quantity ?? 0
                                                    )
                                                }
                                                disabled={isPending}
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <p className="font-semibold text-gray-700 w-40 text-right mr-2">
                                            Tổng:{" "}
                                            <span className="text-gray-800">
                                                {(
                                                    (tempQuantities[item.id] ??
                                                        item.quantity) *
                                                    (item.product?.price ?? 0)
                                                ).toLocaleString("vi-VN")}{" "}
                                                ₫
                                            </span>
                                        </p>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="text-pink-500 hover:text-pink-600 transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-80 flex-shrink-0 lg:border-l border-t lg:border-t-0 border-gray-100 pt-6 lg:pt-0 lg:pl-6">
                    {step === 1 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 sticky top-10">
                            <div className="flex justify-between text-gray-700 mb-2">
                                <span>Tạm tính</span>
                                <span>
                                    {totalPrice.toLocaleString("vi-VN")} ₫
                                </span>
                            </div>
                            <div className="border-t border-gray-200 my-3"></div>
                            <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
                                <span>Tổng tiền</span>
                                <span className="text-red-600">
                                    {totalPrice.toLocaleString("vi-VN")} ₫
                                </span>
                            </div>
                            <Button
                                className="bg-red-500 hover:bg-red-600 w-full text-white text-base font-medium py-5"
                                onClick={handleProceedToCheckout}
                            >
                                Mua hàng ({cartItems.length})
                            </Button>
                        </div>
                    ) : step === 2 ? (
                        <CheckoutForm
                            totalPrice={totalPrice}
                            cartCount={cartItems.length}
                            onBack={() => setStep(1)}
                            onNext={() => setStep(3)}
                        />
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center sticky top-10">
                            <h3 className="text-xl font-semibold text-green-700 mb-2">
                                Thanh toán thành công!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ sớm
                                được xử lý.
                            </p>
                            <Button
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => setStep(1)}
                            >
                                Quay lại trang chủ
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
