"use client";

import { useEffect, useState } from "react";
import { useOrderHistory, useCancelOrder } from "@/queries/useOrder";
import { useUserStore } from "@/stores/user-store";
import { EyeIcon, TrashIcon } from "lucide-react";
import OrderDetailSheet from "@/components/orders/OrderDetailSheet";
import { OrderHistoryItemType } from "@/schemaValidations/order.schema";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getStatusColor, getStatusLabel, getLatestStatus } from "@/lib/utils";

export default function OrderHistoryPage() {
    const { user } = useUserStore();
    const accountId = user?.id;
    const { data, isLoading, isError, refetch } = useOrderHistory(
        accountId || 0
    );

    const [orders, setOrders] = useState<OrderHistoryItemType[]>([]);
    const [selectedOrder, setSelectedOrder] =
        useState<OrderHistoryItemType | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const cancelOrderMutation = useCancelOrder();

    useEffect(() => {
        if (data?.data && Array.isArray(data.data)) {
            setOrders(data.data);
        }
    }, [data]);

    const handleCancelConfirm = (id: number) => {
        cancelOrderMutation.cancelOrder(id, 5);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Đang tải...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-red-500">Lỗi khi tải dữ liệu.</p>
            </div>
        );
    }

    return (
        <section className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-xl font-semibold mb-4 text-gray-800">
                Lịch sử đặt hàng
            </h1>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center">
                    Bạn chưa có đơn hàng nào.
                </p>
            ) : (
                <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="min-w-full text-sm border-collapse">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-left font-semibold text-gray-700 w-[60px]">
                                    STT
                                </th>
                                <th className="p-3 text-left font-semibold text-gray-700">
                                    Thời gian
                                </th>
                                <th className="p-3 text-left font-semibold text-gray-700">
                                    Tổng số tiền
                                </th>
                                <th className="p-3 text-left font-semibold text-gray-700">
                                    Trạng thái
                                </th>
                                <th className="p-3 text-left font-semibold text-gray-700">
                                    Địa chỉ nhận hàng
                                </th>
                                <th className="p-3 text-left font-semibold text-gray-700">
                                    Số điện thoại
                                </th>
                                <th className="p-3 text-center font-semibold text-gray-700">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, idx) => (
                                <tr
                                    key={order.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-3">{idx + 1}</td>
                                    <td className="p-3">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="p-3 text-gray-800">
                                        {order.totalPrice.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        ₫
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(
                                                getLatestStatus(order)
                                            )}`}
                                        >
                                            {getStatusLabel(getLatestStatus(order))}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {order.receiverAddress}
                                    </td>
                                    <td className="p-3">
                                        {order.receiverPhone}
                                    </td>
                                    <td className="p-3 text-center flex justify-center gap-4">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsDrawerOpen(true);
                                            }}
                                            title="Xem chi tiết"
                                        >
                                            <EyeIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                                        </button>

                                        {getLatestStatus(order) === "wait_confirm" && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        title="Hủy đơn hàng"
                                                        disabled={
                                                            cancelOrderMutation.isPending
                                                        }
                                                    >
                                                        <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Xác nhận hủy đơn
                                                            hàng
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn
                                                            muốn hủy đơn hàng
                                                            này không?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Hủy
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleCancelConfirm(
                                                                    order.id
                                                                )
                                                            }
                                                        >
                                                            Xác nhận
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <OrderDetailSheet
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                order={selectedOrder}
            />
        </section>
    );
}
