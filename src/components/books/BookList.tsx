"use client";

import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowDownUp, TrendingUp, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useProducts } from "@/queries/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductType } from "@/schemaValidations/product.schema";

interface ProductListProps {
    filters: {
        filter: {
            productTypes?: string[];
            category?: string[];
            price_min?: number;
            price_max?: number;
            searchTerm?: string;
        };
    };
}

export default function ProductList({ filters }: ProductListProps) {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sortQuery, setSortQuery] = useState("sold,desc");

    let query = `page=${page}&size=${pageSize}`;
    const { productTypes, category, price_min, price_max, searchTerm } =
        filters.filter;
    const filterParts: string[] = [];

    if (price_min && price_max) {
        filterParts.push(`price>:${price_min} and price<:${price_max}`);
    } else if (price_min) {
        filterParts.push(`price>:${price_min}`);
    } else if (price_max) {
        filterParts.push(`price<:${price_max}`);
    }

    // Lọc theo danh mục sản phẩm (product types) - có thể chọn nhiều
    if (productTypes?.length) {
        const types = productTypes
            .map((t) => `productType.name~'${t}'`)
            .join(" or ");
        filterParts.push(`(${types})`);
    }

    // Lọc theo thể loại sách (category/genre) - chỉ áp dụng khi chọn Sách
    if (category?.length) {
        const cats = category.map((c) => `category.name~'${c}'`).join(" or ");
        filterParts.push(`(${cats})`);
    }

    if (searchTerm && searchTerm.trim() !== "") {
        filterParts.push(`name~'${searchTerm.trim()}'`);
    }

    if (filterParts.length > 0) {
        query += `&filter=${encodeURIComponent(filterParts.join(" and "))}`;
    }

    query += `&sort=${sortQuery}`;

    const { data, isLoading, isError, refetch } = useProducts(query);
    const products = data?.payload.data.result || [];
    const meta = data?.payload?.data?.meta;

    useEffect(() => {
        refetch();
    }, [query, refetch]);

    const createSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD") // bỏ dấu tiếng Việt
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    };

    if (isLoading)
        return (
            <div className="p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-60 rounded-xl" />
                ))}
            </div>
        );

    if (isError)
        return (
            <div className="text-center text-red-500 p-10">
                Lỗi khi tải dữ liệu...
            </div>
        );

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    🛒 Tất cả sản phẩm{" "}
                    <span className="text-gray-500 text-sm">
                        ({meta?.total || 0} sản phẩm)
                    </span>
                </h2>

                <Tabs
                    value={sortQuery}
                    onValueChange={(value) => {
                        setSortQuery(value);
                        setPage(1);
                    }}
                    className="w-full sm:w-auto"
                >
                    <TabsList className="bg-gray-50 border border-gray-200 rounded-lg flex gap-1 shadow-sm">
                        <TabsTrigger
                            value="sold,desc"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-1.5 rounded-md text-sm"
                        >
                            <TrendingUp className="w-4 h-4 mr-1" /> Phổ biến
                        </TabsTrigger>
                        <TabsTrigger
                            value="updatedAt,desc"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-1.5 rounded-md text-sm"
                        >
                            <Clock className="w-4 h-4 mr-1" /> Hàng mới
                        </TabsTrigger>
                        <TabsTrigger
                            value="price,asc"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-1.5 rounded-md text-sm"
                        >
                            <ArrowDownUp className="w-4 h-4 mr-1" /> Giá ↑
                        </TabsTrigger>
                        <TabsTrigger
                            value="price,desc"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-1.5 rounded-md text-sm"
                        >
                            <ArrowDownUp className="w-4 h-4 mr-1 rotate-180" />{" "}
                            Giá ↓
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {products.map((product: ProductType) => {
                    const slug = createSlug(product.name);
                    const productUrl = `/product/${slug}?id=${product.id}`;

                    return (
                        <Link
                            href={productUrl}
                            key={product.id}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                        >
                            <div className="relative w-full h-56 sm:h-60">
                                <Image
                                    src={
                                        product?.thumbnail
                                            ? `${
                                                  process.env
                                                      .NEXT_PUBLIC_API_ENDPOINT
                                              }/storage/product/${product.thumbnail.replace(
                                                  /^\/+/,
                                                  ""
                                              )}`
                                            : "/images/placeholder.jpg"
                                    }
                                    alt={product.name || "Product image"}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    unoptimized
                                />
                            </div>
                            <div className="p-3 sm:p-4">
                                <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm sm:text-base group-hover:text-blue-600 transition">
                                    {product.name}
                                </h3>
                                <p className="text-red-600 font-bold mt-2 text-sm sm:text-base">
                                    {product.price?.toLocaleString()} ₫
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Đã bán {product.sold || 0}
                                </p>
                            </div>
                        </Link>
                    );
                })}

                {products.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        Không có sản phẩm nào để hiển thị
                    </div>
                )}
            </div>

            <div className="mt-10 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() =>
                                    setPage((p) => Math.max(p - 1, 1))
                                }
                                className={
                                    page === 1
                                        ? "opacity-50 pointer-events-none"
                                        : ""
                                }
                            />
                        </PaginationItem>

                        {Array.from(
                            { length: meta?.pages || 1 },
                            (_, i) => i + 1
                        ).map((num) => (
                            <PaginationItem key={num}>
                                <button
                                    onClick={() => setPage(num)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                                        num === page
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 hover:bg-blue-100 text-gray-700"
                                    }`}
                                >
                                    {num}
                                </button>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() =>
                                    setPage((p) =>
                                        meta && p < meta.pages ? p + 1 : p
                                    )
                                }
                                className={
                                    page === meta?.pages
                                        ? "opacity-50 pointer-events-none"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
