"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories } from "@/queries/useCategories";
import { useProductTypes } from "@/queries/useProductTypes";
import {
    Filter,
    DollarSign,
    Star,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Package,
} from "lucide-react";
import { FilterState } from "@/components/home/HomeClient";
import { toast } from "sonner";

interface ProductFilterProps {
    onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
}

export function ProductFilter({ onFilterChange }: ProductFilterProps) {
    const { data: productTypes, isLoading: isLoadingTypes } = useProductTypes();
    const { data: categories, isLoading: isLoadingCategories } =
        useCategories();

    const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
        []
    );
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [showBookGenres, setShowBookGenres] = useState(true);
    const [priceError, setPriceError] = useState<string>("");

    const productTypeList = productTypes?.payload?.data || [];
    const categoryList = categories?.payload?.data || [];

    // Kiểm tra xem có chọn "Sách" trong danh sách không
    const isBookSelected = selectedProductTypes.some(
        (type) => type.toLowerCase() === "sách" || type.toLowerCase() === "sach"
    );

    const handleProductTypeChange = (typeName: string) => {
        const updated = selectedProductTypes.includes(typeName)
            ? selectedProductTypes.filter((t) => t !== typeName)
            : [...selectedProductTypes, typeName];

        setSelectedProductTypes(updated);

        // Nếu bỏ chọn Sách, reset thể loại sách
        const hasBook = updated.some(
            (t) => t.toLowerCase() === "sách" || t.toLowerCase() === "sach"
        );
        if (!hasBook) {
            setSelectedCategories([]);
        }

        onFilterChange((prev) => ({
            ...prev,
            filter: {
                ...prev.filter,
                productTypes: updated.length > 0 ? updated : undefined,
                category: hasBook ? prev.filter.category : [],
            },
        }));
    };

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
        // Kiểm tra số âm trước khi áp dụng
        const minVal = minPrice ? Number(minPrice) : 0;
        const maxVal = maxPrice ? Number(maxPrice) : 0;

        if (minPrice && minVal < 0) {
            toast.error("Giá TỪ không được là số âm! Vui lòng nhập lại.");
            setMinPrice("");
            setPriceError("Giá không được là số âm");
            return;
        }

        if (maxPrice && maxVal < 0) {
            toast.error("Giá ĐẾN không được là số âm! Vui lòng nhập lại.");
            setMaxPrice("");
            setPriceError("Giá không được là số âm");
            return;
        }

        // Kiểm tra giá TỪ phải nhỏ hơn giá ĐẾN
        if (minPrice && maxPrice && minVal > maxVal) {
            toast.error("Giá TỪ phải nhỏ hơn hoặc bằng giá ĐẾN!");
            setPriceError("Giá TỪ phải nhỏ hơn giá ĐẾN");
            return;
        }

        setPriceError("");
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
        setSelectedProductTypes([]);
        setSelectedCategories([]);
        setMinPrice("");
        setMaxPrice("");

        onFilterChange({
            filter: {
                productTypes: [],
                category: [],
                price_min: undefined,
                price_max: undefined,
            },
        });
    };

    // Đếm số filter đang active
    const activeFilterCount =
        selectedProductTypes.length +
        selectedCategories.length +
        (minPrice || maxPrice ? 1 : 0);

    if (isLoadingTypes) return null;

    return (
        <aside className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-sm md:max-w-[300px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-white" />
                        <h2 className="text-base font-semibold text-white">
                            Bộ lọc tìm kiếm
                        </h2>
                        {activeFilterCount > 0 && (
                            <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={resetFilter}
                        title="Xóa tất cả bộ lọc"
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition"
                    >
                        <RotateCcw className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            <div className="p-5 space-y-6">
                {/* Danh mục sản phẩm - Luôn hiển thị */}
                <div>
                    <h3 className="flex items-center gap-2 font-medium text-gray-800 mb-4">
                        <Package className="w-4 h-4 text-blue-600" />
                        Danh mục sản phẩm
                        {selectedProductTypes.length > 0 && (
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                                {selectedProductTypes.length}
                            </span>
                        )}
                    </h3>
                    <div className="space-y-2">
                        {productTypeList.map((type) => (
                            <label
                                key={type.id}
                                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all ${
                                    selectedProductTypes.includes(type.name)
                                        ? "bg-blue-50 border border-blue-200"
                                        : "hover:bg-gray-50 border border-transparent"
                                }`}
                            >
                                <Checkbox
                                    checked={selectedProductTypes.includes(
                                        type.name
                                    )}
                                    onCheckedChange={() =>
                                        handleProductTypeChange(type.name)
                                    }
                                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                                <span
                                    className={`flex-1 text-sm ${
                                        selectedProductTypes.includes(type.name)
                                            ? "text-blue-700 font-medium"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {type.name}
                                </span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {type.products?.length || 0}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Thể loại sách - Chỉ hiển thị khi chọn "Sách" */}
                {isBookSelected && (
                    <div className="rounded-xl border border-green-200 overflow-hidden bg-green-50/50">
                        <button
                            onClick={() => setShowBookGenres(!showBookGenres)}
                            className="flex items-center justify-between w-full px-4 py-3 bg-green-50 hover:bg-green-100 transition"
                        >
                            <span className="flex items-center gap-2 font-medium text-gray-800">
                                <BookOpen className="w-4 h-4 text-green-600" />
                                Thể loại sách
                                {selectedCategories.length > 0 && (
                                    <span className="bg-green-200 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                        {selectedCategories.length}
                                    </span>
                                )}
                            </span>
                            {showBookGenres ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>

                        {showBookGenres && !isLoadingCategories && (
                            <div className="px-4 py-3 space-y-2">
                                {categoryList.map((category) => (
                                    <label
                                        key={category.id}
                                        className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all ${
                                            selectedCategories.includes(
                                                category.name
                                            )
                                                ? "bg-green-100 border border-green-300"
                                                : "hover:bg-white border border-transparent"
                                        }`}
                                    >
                                        <Checkbox
                                            checked={selectedCategories.includes(
                                                category.name
                                            )}
                                            onCheckedChange={() =>
                                                handleCategoryChange(
                                                    category.name
                                                )
                                            }
                                            className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                        />
                                        <span
                                            className={`text-sm ${
                                                selectedCategories.includes(
                                                    category.name
                                                )
                                                    ? "text-green-700 font-medium"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {category.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Khoảng giá - Luôn hiển thị */}
                <div>
                    <h3 className="flex items-center gap-2 font-medium text-gray-800 mb-4">
                        <DollarSign className="w-4 h-4 text-amber-500" />
                        Khoảng giá
                        {(minPrice || maxPrice) && (
                            <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full">
                                Đã đặt
                            </span>
                        )}
                    </h3>
                    <div className="flex gap-2 mb-3">
                        <div className="flex-1">
                            <input
                                type="number"
                                min="0"
                                placeholder="₫ TỪ"
                                value={minPrice}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Chỉ cho phép rỗng hoặc số dương
                                    if (value === "") {
                                        setMinPrice("");
                                        setPriceError("");
                                    } else if (
                                        !value.includes("-") &&
                                        Number(value) >= 0
                                    ) {
                                        setMinPrice(value);
                                        setPriceError("");
                                    } else {
                                        // Không cho phép nhập số âm
                                        toast.error("Giá không được là số âm!");
                                        setPriceError(
                                            "Giá không được là số âm"
                                        );
                                    }
                                }}
                                onBlur={(e) => {
                                    const value = e.target.value;
                                    if (value && Number(value) < 0) {
                                        toast.error(
                                            "Giá không được là số âm! Đã reset về 0"
                                        );
                                        setMinPrice("");
                                        setPriceError("");
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "-" ||
                                        e.key === "e" ||
                                        e.key === "E" ||
                                        e.key === "+"
                                    ) {
                                        e.preventDefault();
                                        toast.warning(
                                            "Vui lòng chỉ nhập số dương!"
                                        );
                                    }
                                }}
                                onPaste={(e) => {
                                    const pastedText =
                                        e.clipboardData.getData("text");
                                    if (
                                        Number(pastedText) < 0 ||
                                        isNaN(Number(pastedText))
                                    ) {
                                        e.preventDefault();
                                        toast.error(
                                            "Vui lòng chỉ paste số dương!"
                                        );
                                    }
                                }}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition ${
                                    priceError && minPrice
                                        ? "border-red-500"
                                        : "border-gray-200"
                                }`}
                            />
                        </div>
                        <div className="flex items-center text-gray-400">—</div>
                        <div className="flex-1">
                            <input
                                type="number"
                                min="0"
                                placeholder="₫ ĐẾN"
                                value={maxPrice}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Chỉ cho phép rỗng hoặc số dương
                                    if (value === "") {
                                        setMaxPrice("");
                                        setPriceError("");
                                    } else if (
                                        !value.includes("-") &&
                                        Number(value) >= 0
                                    ) {
                                        setMaxPrice(value);
                                        setPriceError("");
                                    } else {
                                        // Không cho phép nhập số âm
                                        toast.error("Giá không được là số âm!");
                                        setPriceError(
                                            "Giá không được là số âm"
                                        );
                                    }
                                }}
                                onBlur={(e) => {
                                    const value = e.target.value;
                                    if (value && Number(value) < 0) {
                                        toast.error(
                                            "Giá không được là số âm! Đã reset về 0"
                                        );
                                        setMaxPrice("");
                                        setPriceError("");
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "-" ||
                                        e.key === "e" ||
                                        e.key === "E" ||
                                        e.key === "+"
                                    ) {
                                        e.preventDefault();
                                        toast.warning(
                                            "Vui lòng chỉ nhập số dương!"
                                        );
                                    }
                                }}
                                onPaste={(e) => {
                                    const pastedText =
                                        e.clipboardData.getData("text");
                                    if (
                                        Number(pastedText) < 0 ||
                                        isNaN(Number(pastedText))
                                    ) {
                                        e.preventDefault();
                                        toast.error(
                                            "Vui lòng chỉ paste số dương!"
                                        );
                                    }
                                }}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition ${
                                    priceError && maxPrice
                                        ? "border-red-500"
                                        : "border-gray-200"
                                }`}
                            />
                        </div>
                    </div>
                    {priceError && (
                        <p className="text-red-500 text-xs mb-2">
                            {priceError}
                        </p>
                    )}
                    <button
                        onClick={applyPrice}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        Áp dụng
                    </button>
                </div>

                {/* Đánh giá */}
                <div>
                    <h3 className="flex items-center gap-2 font-medium text-gray-800 mb-4">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Đánh giá
                    </h3>
                    <div className="space-y-2">
                        {[5, 4, 3, 2].map((star) => (
                            <div
                                key={star}
                                className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-yellow-500 transition p-1 rounded-lg hover:bg-yellow-50"
                            >
                                {"⭐".repeat(star)}
                                <span className="ml-1 text-xs text-gray-500">
                                    trở lên
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
