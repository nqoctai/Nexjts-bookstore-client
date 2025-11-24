"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories } from "@/queries/useCategories";
import { Filter, DollarSign, Star, RotateCcw } from "lucide-react";

interface ProductFilterProps {
    onFilterChange: React.Dispatch<
        React.SetStateAction<{
            filter: {
                category?: string[];
                price_min?: number;
                price_max?: number;
            };
        }>
    >;
}

export function ProductFilter({ onFilterChange }: ProductFilterProps) {
    const { data: categories, isLoading, error } = useCategories();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    if (isLoading) return null;

    if (error)
        return (
            <aside className="bg-white p-4 text-center text-red-500 rounded-xl shadow-sm">
                Lỗi khi tải danh mục
            </aside>
        );

    const categoryList = categories?.payload?.data || [];

    const handleCategoryChange = (name: string) => {
        const updated = selectedCategories.includes(name)
            ? selectedCategories.filter((c) => c !== name)
            : [...selectedCategories, name];
        setSelectedCategories(updated);
        onFilterChange((prev) => ({
            ...prev,
            filter: { ...prev.filter, category: updated },
        }));
    };

    const applyPrice = () => {
        onFilterChange((prev) => ({
            ...prev,
            filter: {
                ...prev.filter,
                price_min: minPrice ? Number(minPrice) : undefined,
                price_max: maxPrice ? Number(maxPrice) : undefined,
            },
        }));
    };

    const resetFilter = () => {
        setSelectedCategories([]);
        setMinPrice("");
        setMaxPrice("");

        onFilterChange({
            filter: {
                category: [],
                price_min: undefined,
                price_max: undefined,
            },
        });
    };

    return (
        <aside className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 w-full max-w-sm  md:max-w-[290px]">
            <div className="flex items-center justify-between gap-2 mb-5 border-b border-gray-100 pb-3">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-semibold text-gray-800 mr-16">
                    Bộ lọc sản phẩm
                </h2>
                <button
                    onClick={resetFilter}
                    title="Xóa tất cả bộ lọc"
                    className="p-1 rounded-md hover:bg-gray-100 transition"
                >
                    <RotateCcw className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                </button>
            </div>

            <div className="space-y-6 text-sm">
                <div>
                    <h3 className="font-medium text-gray-700 mb-3">
                        🛒 Danh mục sản phẩm
                    </h3>
                    <div className="space-y-2">
                        {categoryList.map((category) => (
                            <label
                                key={category.id}
                                className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                            >
                                <Checkbox
                                    checked={selectedCategories.includes(
                                        category.name
                                    )}
                                    onCheckedChange={() =>
                                        handleCategoryChange(category.name)
                                    }
                                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                                {category.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-yellow-600" />{" "}
                        Khoảng giá
                    </h3>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="₫ TỪ"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-1/2 border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="₫ ĐẾN"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-1/2 border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={applyPrice}
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-sm font-medium"
                    >
                        Áp dụng
                    </button>
                </div>

                <div>
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" /> Đánh giá
                    </h3>
                    <div className="space-y-1.5">
                        {[5, 4, 3, 2].map((star) => (
                            <div
                                key={star}
                                className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-yellow-500 transition"
                            >
                                {"⭐".repeat(star)}{" "}
                                <span className="ml-1 text-xs">trở lên</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
