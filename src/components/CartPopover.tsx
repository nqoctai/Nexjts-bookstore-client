"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/stores/user-store";
import { useState, useRef } from "react";

export default function CartPopover() {
    const { user } = useUserStore();
    const [open, setOpen] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const cartItems = user?.customer?.cart?.cartItems ?? [];

    const handleMouseEnter = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(true), 200);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(false), 250);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative"
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="flex flex-col items-center cursor-pointer group mb-3.5">
                        <div className="relative p-2 rounded-lg hover:bg-gray-100 transition">
                            <ShoppingCart
                                size={25}
                                className="text-gray-700 group-hover:text-blue-600 transition-colors"
                            />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full py-0.5">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:block text-sm font-medium  mr-1 group-hover:text-blue-600 transition-colors">
                            Giỏ hàng
                        </span>
                    </div>
                </PopoverTrigger>

                <PopoverContent
                    align="center"
                    sideOffset={8}
                    className="w-[380px] p-0 bg-white rounded-xl shadow-lg border border-gray-200
                        data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2
                        data-[state=closed]:animate-out data-[state=closed]:fade-out"
                >
                    <div className="p-3 border-b">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Sản phẩm mới thêm
                        </h3>
                    </div>

                    <div className="max-h-[380px] flex flex-col">
                        <ScrollArea className="flex-1 max-h-[280px] overflow-y-auto">
                            {cartItems.length === 0 ? (
                                <div className="p-6 text-sm text-gray-500 text-center">
                                    Không có sản phẩm trong giỏ hàng
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {cartItems.slice(0, 10).map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                                        >
                                            <div className="relative w-12 h-16 flex-shrink-0">
                                                <Image
                                                    src={
                                                        item.product?.thumbnail
                                                            ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/product/${item.product.thumbnail}`
                                                            : "/images/placeholder.jpg"
                                                    }
                                                    alt={
                                                        item.product?.name ||
                                                        "product"
                                                    }
                                                    fill
                                                    className="object-cover rounded-md"
                                                    unoptimized
                                                />
                                            </div>

                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-medium text-gray-800 line-clamp-2">
                                                    {item.product?.name}
                                                </span>
                                                <span className="text-sm text-red-500 font-semibold mt-1">
                                                    {item.product?.price
                                                        ? `${item.product.price.toLocaleString(
                                                              "vi-VN"
                                                          )}₫`
                                                        : "Liên hệ"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        {cartItems.length > 0 && (
                            <div className="p-3 border-t flex justify-end bg-white flex-shrink-0">
                                <Link href="/order">
                                    <Button
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-600 text-white p-5"
                                    >
                                        Xem giỏ hàng
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
