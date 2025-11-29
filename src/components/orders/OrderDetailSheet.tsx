"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import Image from "next/image";
import { OrderHistoryItemType } from "@/schemaValidations/order.schema";
import { FileText, Package, Truck } from "lucide-react";
import { getStatusLabel } from "@/lib/utils";

type OrderDetailSheetProps = {
    open: boolean;
    onClose: () => void;
    order: OrderHistoryItemType | null;
};

export default function OrderDetailSheet({
    open,
    onClose,
    order,
}: OrderDetailSheetProps) {
    // Lấy màu cho từng trạng thái cụ thể
    const getStatusStyles = (status: string) => {
        switch (status) {
            case "wait_confirm":
                return {
                    bg: "bg-amber-500",
                    text: "text-amber-600",
                    border: "border-amber-300",
                };
            case "processing":
                return {
                    bg: "bg-blue-500",
                    text: "text-blue-600",
                    border: "border-blue-300",
                };
            case "shipping":
                return {
                    bg: "bg-purple-500",
                    text: "text-purple-600",
                    border: "border-purple-300",
                };
            case "payment_completed":
                return {
                    bg: "bg-teal-500",
                    text: "text-teal-600",
                    border: "border-teal-300",
                };
            case "completed":
                return {
                    bg: "bg-green-500",
                    text: "text-green-600",
                    border: "border-green-300",
                };
            case "canceled":
                return {
                    bg: "bg-red-500",
                    text: "text-red-600",
                    border: "border-red-300",
                };
            case "returned":
                return {
                    bg: "bg-orange-500",
                    text: "text-orange-600",
                    border: "border-orange-300",
                };
            default:
                return {
                    bg: "bg-gray-400",
                    text: "text-gray-600",
                    border: "border-gray-300",
                };
        }
    };

    const getStepColor = (
        status: string,
        currentIndex: number,
        index: number
    ) => {
        const styles = getStatusStyles(status);

        // Bước hiện tại - màu đậm theo trạng thái
        if (index === currentIndex) {
            return styles.bg;
        }

        // Các bước đã qua - màu nhạt hơn
        if (index < currentIndex) {
            return "bg-gray-400";
        }

        // Các bước chưa đến
        return "bg-gray-200";
    };

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent
                side="right"
                className="sm:max-w-3xl overflow-y-auto p-6 space-y-8"
            >
                <SheetHeader>
                    <SheetTitle className=" flex items-center text-xl font-semibold text-gray-800 gap-3">
                        <FileText size={20} className="text-blue-600" />
                        Chi tiết đơn hàng
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                        Thông tin chi tiết đơn hàng của bạn
                    </p>
                </SheetHeader>

                {!order ? (
                    <p className="text-gray-500 mt-6 text-center">
                        Không có dữ liệu đơn hàng.
                    </p>
                ) : (
                    <>
                        <div className="border rounded-xl bg-gray-50 shadow-sm">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 text-sm text-gray-700">
                                <p>
                                    <b>Họ và tên:</b> {order.receiverName}
                                </p>
                                <p>
                                    <b>Email:</b> {order.receiverEmail || "—"}
                                </p>
                                <p>
                                    <b>Số điện thoại:</b> {order.receiverPhone}
                                </p>
                                <p>
                                    <b>Địa chỉ:</b> {order.receiverAddress}
                                </p>
                                <p>
                                    <b>Ngày đặt:</b>{" "}
                                    {new Date(order.createdAt).toLocaleString(
                                        "vi-VN"
                                    )}
                                </p>
                                <p>
                                    <b>Tổng tiền:</b>{" "}
                                    <span className="text-green-600 font-semibold">
                                        {order.totalPrice.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        ₫
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center font-semibold mb-3 text-gray-800 text-lg gap-3">
                                <Package
                                    size={20}
                                    className="text-yellow-600"
                                />
                                Sản phẩm
                            </h3>

                            <div className="overflow-hidden border rounded-xl">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr className="text-left text-gray-700">
                                            <th className="p-3 font-medium">
                                                Hình ảnh
                                            </th>
                                            <th className="p-3 font-medium">
                                                Tên sản phẩm
                                            </th>
                                            <th className="p-3 font-medium">
                                                Số lượng
                                            </th>
                                            <th className="p-3 font-medium">
                                                Đơn giá
                                            </th>
                                            <th className="p-3 font-medium">
                                                Tổng giá
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-t hover:bg-gray-50 transition"
                                            >
                                                <td className="p-3">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/product/${item.product.thumbnail}`}
                                                        alt={item.product.name}
                                                        width={60}
                                                        height={60}
                                                        className="rounded-md object-cover border"
                                                        unoptimized
                                                    />
                                                </td>

                                                <td className="p-3 text-gray-800 font-medium">
                                                    {item.product.name}
                                                </td>

                                                <td className="p-3">
                                                    {item.quantity}
                                                </td>

                                                <td className="p-3">
                                                    {(
                                                        item.price /
                                                        item.quantity
                                                    ).toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    ₫
                                                </td>

                                                <td className="p-3 font-semibold text-gray-800">
                                                    {item.price.toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    ₫
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center font-semibold mb-3 text-gray-800 text-lg gap-3">
                                <Truck size={20} className="text-green-600" />
                                Trạng thái đơn hàng
                            </h3>

                            {order.orderShippingEvents.length > 0 ? (
                                <div className="relative ml-4 border-l-2 border-gray-200 pl-6 space-y-6">
                                    {order.orderShippingEvents.map(
                                        (event, i) => {
                                            const currentIndex =
                                                order.orderShippingEvents
                                                    .length - 1;

                                            const status =
                                                event.shippingStatus?.status ||
                                                "wait_confirm";
                                            const date = event.shippingStatus
                                                ?.createdAt
                                                ? new Date(
                                                      event.shippingStatus.createdAt
                                                  ).toLocaleString("vi-VN")
                                                : "—";

                                            return (
                                                <div
                                                    key={i}
                                                    className="relative flex items-start gap-3"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div
                                                            className={`flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold 
                                                            ${getStepColor(
                                                                status,
                                                                currentIndex,
                                                                i
                                                            )}`}
                                                        >
                                                            {i + 1}
                                                        </div>

                                                        {i !== currentIndex && (
                                                            <div className="w-[2px] h-8 bg-gray-200 mt-1"></div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p
                                                            className={`font-medium ${
                                                                i === currentIndex
                                                                    ? getStatusStyles(status).text
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {getStatusLabel(
                                                                status
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {date}
                                                        </p>

                                                        {event.shippingStatus
                                                            ?.note && (
                                                            <p className="text-xs text-gray-600 mt-1 italic">
                                                                Ghi chú:{" "}
                                                                {
                                                                    event
                                                                        .shippingStatus
                                                                        .note
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Chưa có dữ liệu trạng thái.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
