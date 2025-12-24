"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, User, Search, TrendingUp, Flame } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Banner from "../../public/images/Banner.webp";
import Logo_Book from "../../public/images/logo_book.jpg";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/queries/useAuth";
import { useSearchStore } from "@/stores/search-store";
import {
    useTop5ProductsSold,
    useAIRecommendation,
    useAIFeedback,
} from "@/queries/useDashboard";
import CartPopover from "./CartPopover";
import ManageAccountModal from "./profile/ManageAccountModal";

export default function HeaderCustomer() {
    const [searchValue, setSearchValue] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const logoutMutation = useLogoutMutation();
    const user = useUserStore((state) => state.user);
    const feedbackMutation = useAIFeedback();

    // Lấy customer ID từ user.customer.id (không phải user.id)
    const customerId = user?.customer?.id || 0;

    // Top 5 khi chưa đăng nhập
    const { data: top5Data } = useTop5ProductsSold();

    // AI Recommendation khi đã đăng nhập
    const { data: aiData } = useAIRecommendation(
        { customerId: customerId, position: "search", topK: 12 },
        !!user && !!customerId
    );

    const { setSearchValue: setGlobalSearch } = useSearchStore();
    const router = useRouter();

    // Lấy sản phẩm phù hợp (AI khi login, Top5 khi chưa login) - giới hạn 5
    const searchProducts = user
        ? (aiData?.payload?.data || []).slice(0, 5).map((p) => ({
              id: p.id,
              name: p.name,
              thumbnail: p.thumbnail,
              price: p.price,
              sold: p.sold,
              isFromAI: true,
          }))
        : (top5Data?.payload?.data || []).slice(0, 5).map((p) => ({
              id: p.productId,
              name: p.productName,
              thumbnail: p.thumbnail,
              price: p.totalPrice,
              sold: p.sold,
              isFromAI: false,
          }));

    // Handler gọi feedback khi click sản phẩm AI recommend
    const handleSearchProductClick = (productId: number, isFromAI: boolean) => {
        if (user && customerId && isFromAI) {
            feedbackMutation.mutate({
                customerId: customerId,
                action: productId,
                position: "search",
                even_type: "view",
            });
        }
        setShowSearchDropdown(false);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) return null;

    const handleLogout = async () => {
        if (logoutMutation.isPending) return;

        try {
            await logoutMutation.mutateAsync();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalSearch(e.target.value);
        setSearchValue(e.target.value);
    };
    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="w-full bg-blue-600 flex justify-center">
                <Image
                    src={Banner}
                    alt="Khuyến mãi lớn"
                    height={80}
                    priority
                    className="object-contain w-full max-h-full md:max-h-15"
                    quality={100}
                />
            </div>

            <div className="max-w-screen-xl mx-auto py-2 flex items-center justify-between gap-5">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src={Logo_Book}
                        alt="Logo BookStore"
                        priority
                        className="object-contain w-14 h-14 sm:w-22 sm:h-22 rounded-md"
                        quality={100}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
                        <span className="text-xl sm:text-3xl font-bold text-blue-600">
                            The Book
                        </span>
                        <span className="text-xl sm:text-3xl font-bold text-gray-800">
                            Heaven
                        </span>
                    </div>
                </Link>

                <div
                    className="hidden md:flex flex-1 md:max-w-xl lg:max-w-lg relative"
                    ref={searchRef}
                >
                    <div className="flex w-full items-center rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all border border-gray-300">
                        <Input
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={() => setShowSearchDropdown(true)}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-5 h-10 lg:h-[52px] text-gray-700 placeholder:text-gray-400"
                        />
                        <Button
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 h-12 lg:h-[52px] w-14 lg:w-16 flex items-center justify-center rounded-none border-none"
                        >
                            <Search size={22} className="text-white" />
                        </Button>
                    </div>

                    {/* Search Dropdown */}
                    {showSearchDropdown && searchProducts.length > 0 && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[450px]">
                            {/* Header gradient xanh */}
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
                                <h3 className="flex items-center gap-2 text-white font-semibold">
                                    <TrendingUp className="w-4 h-4" />
                                    {user
                                        ? "Gợi ý cho bạn"
                                        : "Sản phẩm bán chạy"}
                                </h3>
                            </div>

                            {/* Product list */}
                            <div className="p-3 space-y-1">
                                {searchProducts.map((product, index) => {
                                    const imageUrl = product.thumbnail
                                        ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/product/${product.thumbnail}`
                                        : "/images/placeholder.jpg";
                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}?id=${product.id}`}
                                            onClick={() =>
                                                handleSearchProductClick(
                                                    product.id,
                                                    product.isFromAI
                                                )
                                            }
                                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50 transition group"
                                        >
                                            <span
                                                className={`w-6 h-6 flex items-center justify-center text-xs font-bold text-white rounded-full ${
                                                    index === 0
                                                        ? "bg-yellow-500"
                                                        : index === 1
                                                        ? "bg-gray-400"
                                                        : index === 2
                                                        ? "bg-amber-600"
                                                        : "bg-blue-500"
                                                }`}
                                            >
                                                {index + 1}
                                            </span>
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-red-500 font-bold">
                                                    {product.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                                                <Flame size={12} />
                                                <span className="font-medium">
                                                    {product.sold}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-5 sm:gap-8 text-gray-700">
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        <Search size={22} className="text-gray-700" />
                    </button>

                    <Link
                        href="/order"
                        className="relative flex flex-col items-center group transition-colors duration-200"
                    >
                        <CartPopover />
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {user ? (
                                <button className="flex items-center gap-2 group focus:outline-none focus-visible:outline-none focus:ring-0">
                                    <Avatar className="w-9 h-9 md:h-15 md:w-15 border shadow-sm hover:scale-105 transition-transform">
                                        <AvatarImage
                                            src={
                                                user.avatar
                                                    ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/avatar/${user.avatar}`
                                                    : ""
                                            }
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                                            {user.name?.[0]?.toUpperCase() ||
                                                "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:block text-sm md:text-lg font-medium group-hover:text-blue-600 transition-colors">
                                        {user.name}
                                    </span>
                                </button>
                            ) : (
                                <button className="flex flex-col items-center group">
                                    <User
                                        size={26}
                                        className="group-hover:text-blue-600 transition-colors"
                                    />
                                    <span className="hidden sm:block text-sm font-medium mt-1 group-hover:text-blue-600 transition-colors">
                                        Tài khoản
                                    </span>
                                </button>
                            )}
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-56 p-2 bg-white rounded-xl shadow-lg border border-gray-200"
                        >
                            {!user ? (
                                <>
                                    <Link
                                        href="/login"
                                        className="block w-full"
                                    >
                                        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block w-full mt-2"
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                        >
                                            Đăng ký
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="flex flex-col text-sm text-gray-700">
                                    <button
                                        onClick={() =>
                                            setOpenProfileModal(true)
                                        }
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <User className="w-4 h-4 text-blue-600" />
                                        <span className="font-semibold">
                                            Thông tin cá nhân
                                        </span>
                                    </button>

                                    <Link
                                        href="/order"
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                                        <span className="font-semibold">
                                            Giỏ hàng
                                        </span>
                                    </Link>

                                    <Link
                                        href="/history"
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.6}
                                            stroke="currentColor"
                                            className="w-4 h-4 text-blue-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 3h18l-2 13H5L3 3zm2 16h14a2 2 0 002-2H3a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="font-semibold">
                                            Lịch sử giao hàng
                                        </span>
                                    </Link>

                                    <hr className="my-2 border-gray-200" />

                                    <button
                                        className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        onClick={handleLogout}
                                        disabled={logoutMutation.isPending}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.6}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M9.75 9l3 3-3 3m6-3H9.75"
                                            />
                                        </svg>
                                        <span className="font-semibold">
                                            Đăng xuất
                                        </span>
                                    </button>
                                </div>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {showSearch && (
                <div className="md:hidden px-4 pb-3">
                    <div className="flex items-center rounded-xl overflow-hidden bg-white shadow-sm border border-gray-300">
                        <Input
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-11 text-gray-700 placeholder:text-gray-400"
                        />
                        <Button
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 h-11 w-14 flex items-center justify-center rounded-none border-none"
                        >
                            <Search size={20} className="text-white" />
                        </Button>
                    </div>
                </div>
            )}

            <ManageAccountModal
                open={openProfileModal}
                onOpenChange={setOpenProfileModal}
            />
        </header>
    );
}
