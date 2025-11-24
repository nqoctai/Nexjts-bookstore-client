"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductDetail } from "@/queries/useProducts";
import { toast } from "sonner";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import { useUserStore } from "@/stores/user-store";
import { useAddToCart } from "@/queries/useCart";
import { useAccountQuery } from "@/queries/useAuth";

export default function ProductDetailClient({ id }: { id: number }) {
    const router = useRouter();

    const {
        data: product,
        isPending,
        isError,
    } = useProductDetail(isNaN(id) ? undefined : id);

    const { user } = useUserStore();
    const { refetch: refetchAccount } = useAccountQuery();
    const { mutate: addToCart, isPending: isAdding } = useAddToCart();

    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    const handleQuantity = (type: "minus" | "plus") => {
        setQuantity((prev) => {
            if (type === "minus" && prev > 1) return prev - 1;
            if (type === "plus") return prev + 1;
            return prev;
        });
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
            router.push("/login");
            return;
        }

        if (!product?.id) {
            toast.error("❌ Không tìm thấy sản phẩm");
            return;
        }

        addToCart(
            {
                email: user.email,
                productId: product.id,
                quantity,
            },
            {
                onSuccess: async () => {
                    await refetchAccount();
                },
            }
        );
    };

    const handleBuyNow = () => {
        if (!user) {
            toast.warning("🪪 Vui lòng đăng nhập để mua hàng");
            router.push("/login");
            return;
        }

        if (!product?.id) {
            toast.error("❌ Không tìm thấy sản phẩm");
            return;
        }

        addToCart(
            {
                email: user.email,
                productId: product.id,
                quantity,
            },
            {
                onSuccess: async () => {
                    await refetchAccount();
                    router.push("/order");
                },
            }
        );
    };

    if (isPending) return <ProductDetailSkeleton />;

    if (isError || !product)
        return (
            <div className="text-center p-20 text-red-500">
                Không thể tải thông tin sản phẩm
            </div>
        );

    const mainImage =
        activeImage ||
        (product.thumbnail
            ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/product/${product.thumbnail}`
            : "/images/placeholder.jpg");

    const handleQuantityChange = (value: number) => {
        if (isNaN(value) || value < 1) {
            setQuantity(1);
            toast.warning("⚠️ Số lượng phải lớn hơn 0");
            return;
        }

        if (product?.quantity && value > product.quantity) {
            toast.error(`❌ Vượt quá số lượng tồn kho (${product.quantity})`);
            setQuantity(1);
            return;
        }

        setQuantity(value);
    };

    return (
        <section className="bg-gray-50 py-8 px-4">
            <div className="max-w-screen-xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                    {/* LEFT IMAGE */}
                    <div>
                        <div className="relative w-full h-[460px] border rounded-lg overflow-hidden">
                            <Image
                                src={mainImage}
                                alt={product?.name || "product"}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>

                        {product?.productImages?.length ? (
                            <div className="flex justify-center flex-wrap gap-3 mt-4">
                                {product.productImages.map((img) => {
                                    const imgUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/product/${img.url}`;
                                    const isActive = activeImage === imgUrl;

                                    return (
                                        <div
                                            key={img.id}
                                            onMouseEnter={() =>
                                                setActiveImage(imgUrl)
                                            }
                                            onClick={() =>
                                                setActiveImage(imgUrl)
                                            }
                                            className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                                isActive
                                                    ? "border-blue-500 scale-105"
                                                    : "border-gray-200 hover:border-blue-300"
                                            }`}
                                        >
                                            <Image
                                                src={imgUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    {/* RIGHT CONTENT */}
                    <div>
                        <p className="text-gray-500 mb-4 text-xl">
                            Tác giả:{" "}
                            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                                {product?.author}
                            </span>
                        </p>

                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                            {product?.name}
                        </h1>

                        <div className="flex items-center text-sm text-gray-600 mb-4">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className="fill-yellow-400"
                                    />
                                ))}
                            </div>
                            <span className="mx-3">|</span>
                            <span className="text-base">
                                Đã bán {product.sold ?? 0}
                            </span>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg py-4 px-6 mb-5">
                            <span className="text-red-600 text-3xl font-bold">
                                {product?.price?.toLocaleString("vi-VN")}₫
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <Truck className="text-green-600" size={20} />
                            <span className="text-gray-700 text-base">
                                Vận chuyển:{" "}
                                <span className="font-medium text-green-600">
                                    Miễn phí vận chuyển
                                </span>
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-6 text-base">
                            <span className="text-gray-700 font-medium">
                                Số lượng:
                            </span>
                            <div className="flex items-center border rounded-lg overflow-hidden h-10">
                                <button
                                    onClick={() => handleQuantity("minus")}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.max(1, Number(e.target.value))
                                        )
                                    }
                                    className="w-12 text-center border-x outline-none text-gray-800 text-sm"
                                    onBlur={() =>
                                        handleQuantityChange(quantity)
                                    }
                                />
                                <button
                                    onClick={() => handleQuantity("plus")}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-50 font-medium py-3 px-6 rounded-md transition"
                            >
                                <ShoppingCart size={20} /> Thêm vào giỏ hàng
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={isAdding}
                                className="bg-red-500 text-white font-medium py-3 px-6 rounded-md hover:bg-red-600 transition"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
