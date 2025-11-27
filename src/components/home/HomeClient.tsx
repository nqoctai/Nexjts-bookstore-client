"use client";

import { useEffect, useState } from "react";
import BannerSection from "@/components/BannerSection";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { useSearchStore } from "@/stores/search-store";
import useDebounce from "@/hooks/useDebounce";
import { ProductFilter } from "@/components/books";
import ProductList from "@/components/books/BookList";
import TopProductsSection from "@/components/TopProductsSection";

export interface FilterState {
    filter: {
        productTypes?: string[]; // Danh mục sản phẩm (Sách, Laptop, ...) - có thể chọn nhiều
        category?: string[]; // Thể loại sách (chỉ hiển thị khi chọn Sách)
        price_min?: number;
        price_max?: number;
        searchTerm?: string;
    };
}

export default function HomeClient() {
    const { searchValue } = useSearchStore();
    const debouncedSearch = useDebounce(searchValue, 400);

    const [filters, setFilters] = useState<FilterState>({
        filter: {
            productTypes: [],
            category: [],
            price_min: undefined,
            price_max: undefined,
        },
    });

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            filter: {
                ...prev.filter,
                searchTerm: debouncedSearch.trim(),
            },
        }));
    }, [debouncedSearch]);

    return (
        <>
            <BannerSection />

            {/* Mobile Filter */}
            <div className="container mx-auto px-4 py-4 block lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                            Bộ lọc sản phẩm
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        className="w-full sm:w-[420px] max-w-full overflow-y-auto"
                    >
                        <SheetHeader>
                            <SheetTitle>Lọc sản phẩm</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                            <ProductFilter onFilterChange={setFilters} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Layout */}
            <div className="max-w-screen-xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-12">
                <aside className="hidden lg:block lg:col-span-3">
                    <ProductFilter onFilterChange={setFilters} />
                </aside>

                <main className="lg:col-span-9">
                    <ProductList filters={filters} />
                </main>
            </div>

            {/* Top 5 / AI Recommendation */}
            <div className="max-w-screen-xl mx-auto px-4 pb-12">
                <TopProductsSection
                    variant="vertical"
                    title="Gợi ý cho bạn"
                    position="home"
                    maxDisplay={5}
                />
            </div>
        </>
    );
}
