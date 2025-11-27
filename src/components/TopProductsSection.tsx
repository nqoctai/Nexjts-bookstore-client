"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTop5ProductsSold, useAIRecommendation, useAIFeedback } from "@/queries/useDashboard";
import { useUserStore } from "@/stores/user-store";
import { useAIRecommendStore } from "@/stores/ai-recommend-store";
import { Flame, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Top5ProductItemType, AIRecommendProductType } from "@/schemaValidations/dashboard.schema";

interface TopProductsSectionProps {
    variant?: "horizontal" | "vertical" | "compact";
    title?: string;
    position?: "home" | "search" | "cart";
    maxDisplay?: number; 
}

// Unified product type để dùng chung
interface UnifiedProduct {
    id: number;
    name: string;
    thumbnail: string | null;
    price: number;
    sold: number;
    isFromAI?: boolean; // Đánh dấu sản phẩm từ AI recommend
}

// Convert Top5 product to unified format
function convertTop5Product(product: Top5ProductItemType): UnifiedProduct {
    return {
        id: product.productId,
        name: product.productName,
        thumbnail: product.thumbnail,
        price: product.totalPrice,
        sold: product.sold,
    };
}

// Convert AI recommend product to unified format
function convertAIProduct(product: AIRecommendProductType): UnifiedProduct {
    return {
        id: product.id,
        name: product.name,
        thumbnail: product.thumbnail,
        price: product.price,
        sold: product.sold,
        isFromAI: true, // Đánh dấu từ AI
    };
}


function ProductCardVertical({
    product,
    rank,
    onProductClick,
}: {
    product: UnifiedProduct;
    rank: number;
    onProductClick?: (productId: number) => void;
}) {
    const imageUrl = product.thumbnail
        ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/product/${product.thumbnail}`
        : "/images/placeholder.jpg";

    const soldPercent = Math.min((product.sold / 10) * 100, 100);

    const handleClick = () => {
        if (onProductClick && product.isFromAI) {
            onProductClick(product.id);
        }
    };

    return (
        <Link
            href={`/product/${product.id}?id=${product.id}`}
            onClick={handleClick}
            className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex-shrink-0"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                />
                <div className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center text-white font-bold text-sm ${
                    rank === 1 ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
                    rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                    rank === 3 ? "bg-gradient-to-br from-amber-600 to-amber-800" :
                    "bg-gradient-to-br from-blue-400 to-blue-600"
                }`}>
                    {rank}
                </div>
                {rank <= 3 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        <Flame size={10} /> HOT
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>
            <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-red-600 transition-colors">
                    {product.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-red-600 font-bold text-lg">
                        {product.price.toLocaleString("vi-VN")}₫
                    </span>
                </div>
                <div className="mt-3">
                    <div className="relative h-5 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${soldPercent}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] font-bold text-gray-800">
                                Đã bán {product.sold}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function ProductCardCompact({
    product,
    rank,
    onProductClick,
}: {
    product: UnifiedProduct;
    rank: number;
    onProductClick?: (productId: number) => void;
}) {
    const imageUrl = product.thumbnail
        ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/product/${product.thumbnail}`
        : "/images/placeholder.jpg";

    const handleClick = () => {
        if (onProductClick && product.isFromAI) {
            onProductClick(product.id);
        }
    };

    return (
        <Link
            href={`/product/${product.id}?id=${product.id}`}
            onClick={handleClick}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition group"
        >
            <span className={`w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full ${
                rank === 1 ? "bg-yellow-500" :
                rank === 2 ? "bg-gray-400" :
                rank === 3 ? "bg-amber-600" :
                "bg-blue-500"
            }`}>
                {rank}
            </span>
            <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate group-hover:text-blue-600 transition">
                    {product.name}
                </p>
                <p className="text-xs text-red-500 font-semibold">
                    {product.price.toLocaleString("vi-VN")}₫
                </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-500">
                <Flame size={12} />
                {product.sold}
            </div>
        </Link>
    );
}

export default function TopProductsSection({
    variant = "vertical",
    title = "Sản phẩm gợi ý",
    position = "home",
    maxDisplay = 5,
}: TopProductsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const user = useUserStore((state) => state.user);
    const addRecommendedProducts = useAIRecommendStore((state) => state.addRecommendedProducts);
    const feedbackMutation = useAIFeedback();

    
    const customerId = user?.customer?.id || 0;

 
    const { data: top5Data, isLoading: top5Loading } = useTop5ProductsSold();

  
    const { data: aiData, isLoading: aiLoading } = useAIRecommendation(
        {
            customerId: customerId,
            position: position,
            topK: 12,
        },
        !!user && !!customerId
    );

    const isLoading = user ? aiLoading : top5Loading;

    
    const products: UnifiedProduct[] = user
        ? (aiData?.payload?.data || []).map(convertAIProduct)
        : (top5Data?.payload?.data || []).map(convertTop5Product);

    // Lưu sản phẩm AI recommend vào store khi có data
    useEffect(() => {
        if (user && aiData?.payload?.data) {
            const productIds = aiData.payload.data.map((p) => p.id);
            addRecommendedProducts(productIds, position);
        }
    }, [user, aiData, position, addRecommendedProducts]);

  
    const handleProductClick = (productId: number) => {
        if (user && customerId) {
            feedbackMutation.mutate({
                customerId: customerId,
                action: productId,
                position: position,
                even_type: "view",
            });
        }
    };

    // Tính toán cho carousel
    const totalProducts = products.length;
    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex + maxDisplay < totalProducts;
    const displayProducts = products.slice(currentIndex, currentIndex + maxDisplay);

    const handlePrev = () => {
        if (canScrollLeft) {
            setCurrentIndex(Math.max(0, currentIndex - maxDisplay));
        }
    };

    const handleNext = () => {
        if (canScrollRight) {
            setCurrentIndex(Math.min(totalProducts - maxDisplay, currentIndex + maxDisplay));
        }
    };

    if (isLoading) {
        return (
            <div className="rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                    <div className="h-8 bg-white/20 rounded w-48 animate-pulse"></div>
                </div>
                <div className="bg-gradient-to-b from-blue-50 to-white p-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!products.length) return null;
    if (variant === "compact") {
        const compactProducts = products.slice(0, 5);
        return (
            <div className="space-y-1">
                {compactProducts.map((product, index) => (
                    <ProductCardCompact
                        key={product.id}
                        product={product}
                        rank={index + 1}
                        onProductClick={handleProductClick}
                    />
                ))}
            </div>
        );
    }

   
    return (
        <div className="rounded-2xl overflow-hidden shadow-lg">
        
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 px-4 md:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                            <span className="text-white font-bold text-lg uppercase tracking-wide">
                                {user ? title : "Sản phẩm bán chạy"}
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1">
                            {[...Array(3)].map((_, i) => (
                                <Flame
                                    key={i}
                                    className="w-5 h-5 text-yellow-400 animate-bounce"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </div>
                    </div>

                    {totalProducts > maxDisplay && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={!canScrollLeft}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                    canScrollLeft
                                        ? "bg-white/30 hover:bg-white/50 text-white"
                                        : "bg-white/10 text-white/40 cursor-not-allowed"
                                }`}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canScrollRight}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                    canScrollRight
                                        ? "bg-white/30 hover:bg-white/50 text-white"
                                        : "bg-white/10 text-white/40 cursor-not-allowed"
                                }`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gradient-to-b from-blue-50 via-cyan-50/30 to-white p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {displayProducts.map((product, index) => (
                        <ProductCardVertical
                            key={product.id}
                            product={product}
                            rank={currentIndex + index + 1}
                            onProductClick={handleProductClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}