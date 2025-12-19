"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
    CreditCard,
    Truck,
    ArrowLeft,
    Gift,
    ShoppingCart,
    Loader2,
} from "lucide-react";
import { usePromotionsQuery } from "@/queries/usePromotions";
import { useRouter } from "next/navigation";

import { useAccountQuery } from "@/queries/useAuth";
import { useUserStore } from "@/stores/user-store";
import { useCreateOrder } from "@/queries/useOrder";
import { useAIRecommendStore } from "@/stores/ai-recommend-store";
import { useAIFeedback } from "@/queries/useDashboard";

interface CheckoutFormProps {
    totalPrice: number;
    cartCount: number;
    onBack?: () => void;
    onNext?: () => void;
}

export default function CheckoutForm({
    totalPrice,
    cartCount,
    onBack,
    onNext,
}: CheckoutFormProps) {
    const router = useRouter();
    const { user } = useUserStore();

    const { refetch: refetchAccount } = useAccountQuery();
    const { data, isLoading } = usePromotionsQuery();
    const { mutate: createOrder, isPending } = useCreateOrder();

    // AI Feedback
    const isRecommended = useAIRecommendStore((state) => state.isRecommended);
    const getProductPosition = useAIRecommendStore(
        (state) => state.getProductPosition
    );
    const clearRecommendedProducts = useAIRecommendStore(
        (state) => state.clearRecommendedProducts
    );
    const feedbackMutation = useAIFeedback();

    const promotions = data?.data?.result || [];

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        payment: "cod" as "cod" | "transfer",
        promotionId: "",
    });

    const selectedPromo = promotions.find(
        (promo) => promo.id === Number(formData.promotionId)
    );

    let discountedPrice = totalPrice;
    let discountAmount = 0;
    if (selectedPromo) {
        if (selectedPromo.promotionType === "percent") {
            discountAmount = totalPrice * (selectedPromo.promotionValue / 100);
            discountedPrice = totalPrice - discountAmount;
        } else if (selectedPromo.promotionType === "value") {
            discountAmount = selectedPromo.promotionValue;
            discountedPrice = Math.max(totalPrice - discountAmount, 0);
        }
    }

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Gọi feedback transaction cho các sản phẩm được recommend từ AI
    const sendTransactionFeedback = () => {
        const customerId = user?.customer?.id;
        const cartItems = user?.customer?.cart?.cartItems || [];

        if (customerId && cartItems.length > 0) {
            cartItems.forEach((item) => {
                const productId = item.product?.id;
                if (productId && isRecommended(productId)) {
                    const position = getProductPosition(productId);
                    if (position) {
                        feedbackMutation.mutate({
                            customerId: customerId,
                            action: productId,
                            position: position,
                            even_type: "transaction",
                        });
                    }
                }
            });
            // Clear recommended products sau khi đã gửi feedback
            clearRecommendedProducts();
        }
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.phone || !formData.address) {
            toast.warning("Vui lòng nhập đầy đủ thông tin trước khi đặt hàng.");
            return;
        }

        if (!user?.id || !user?.email) {
            toast.error(
                "Không thể xác định thông tin tài khoản. Hãy đăng nhập lại!"
            );
            return;
        }

        const payload = {
            accountId: user.id,
            name: formData.name,
            phone: formData.phone,
            email: user.email,
            address: formData.address,
            totalPrice: discountedPrice,
            paymentMethod: formData.payment,
            promotionId: formData.promotionId
                ? Number(formData.promotionId)
                : undefined,
        };

        createOrder(payload, {
            onSuccess: async (res) => {
                toast.success("Đặt hàng thành công!");
                sendTransactionFeedback();
                await refetchAccount();
                if (res?.payload?.data?.checkoutUrl) {
                    window.location.href = res.payload.data.checkoutUrl;
                } else {
                    router.push("/history");
                }
                onNext?.();
            },
            onError: (error: any) => {
                toast.error(
                    error.message || "Không thể đặt hàng. Vui lòng thử lại!"
                );
            },
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sticky top-10 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b border-gray-100 pb-3">
                Thông tin thanh toán
            </h2>

            <div className="flex flex-col gap-4">
                <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                        Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập họ tên người nhận"
                        className="focus-visible:ring-2 focus-visible:ring-blue-500"
                    />

                    <Label className="text-sm font-medium text-gray-700">
                        Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        className="focus-visible:ring-2 focus-visible:ring-blue-500"
                    />

                    <Label className="text-sm font-medium text-gray-700">
                        Địa chỉ giao hàng{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Nhập địa chỉ nhận hàng chi tiết"
                        className="resize-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Gift size={16} className="text-pink-500" /> Chọn khuyến
                        mãi
                    </Label>

                    <select
                        id="promotionId"
                        value={formData.promotionId}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-pink-400 focus:outline-none bg-white"
                    >
                        <option value="">-- Không áp dụng khuyến mãi --</option>
                        {promotions.map((promo) => (
                            <option key={promo.id} value={promo.id}>
                                {promo.name}{" "}
                                {promo.promotionType === "percent"
                                    ? `(-${promo.promotionValue}%)`
                                    : promo.promotionType === "value"
                                    ? `(-${promo.promotionValue.toLocaleString(
                                          "vi-VN"
                                      )}₫)`
                                    : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <Label className="text-sm font-medium text-gray-700">
                        Phương thức thanh toán
                    </Label>
                    <RadioGroup
                        defaultValue="cod"
                        value={formData.payment}
                        onValueChange={(val) =>
                            setFormData((prev) => ({
                                ...prev,
                                payment: val as "cod" | "transfer",
                            }))
                        }
                        className="mt-3 space-y-3"
                    >
                        <div className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cod" id="cod" />
                                <Label htmlFor="cod" className="cursor-pointer">
                                    Thanh toán khi nhận hàng (COD)
                                </Label>
                            </div>
                            <Truck className="text-gray-500" size={18} />
                        </div>

                        <div className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="transfer"
                                    id="transfer"
                                />
                                <Label
                                    htmlFor="transfer"
                                    className="cursor-pointer"
                                >
                                    Thanh toán qua ngân hàng (Chuyển khoản)
                                </Label>
                            </div>
                            <CreditCard className="text-gray-500" size={18} />
                        </div>
                    </RadioGroup>
                </div>

                <div className="border-t border-gray-100 my-2"></div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">
                            Tổng tiền hàng:
                        </span>
                        <span className="text-red-600 font-semibold">
                            {totalPrice.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>

                    {selectedPromo && (
                        <div className="flex justify-between items-center text-base">
                            <span className="text-green-600 font-medium">
                                Giảm khuyến mãi:
                            </span>
                            <span className="text-green-600 font-semibold">
                                - {discountAmount.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    )}

                    <div className="border-t border-gray-200 my-3"></div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-semibold text-base">
                            Tổng thanh toán:
                        </span>
                        <span className="text-red-600 text-base font-bold">
                            {discountedPrice.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <Button
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 w-full text-white text-base font-medium py-5 shadow-md hover:shadow-lg transition-all"
                        onClick={handleSubmit}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Đặt hàng ngay ({cartCount})
                            </>
                        )}
                    </Button>

                    {onBack && (
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={onBack}
                        >
                            <ArrowLeft size={18} />
                            Quay lại giỏ hàng
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
