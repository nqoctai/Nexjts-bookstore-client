import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
};

export const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
        wait_confirm: "Chờ xác nhận",
        processing: "Đang xử lý",
        shipping: "Đang giao hàng",
        payment_completed: "Đã thanh toán",
        canceled: "Đã hủy",
        returned: "Đã hoàn trả",
        completed: "Hoàn thành",
    };

    return map[status] || "Không xác định";
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case "canceled":
            return "border-red-300 text-red-600 bg-red-50";
        case "completed":
        case "payment_completed":
            return "border-green-300 text-green-600 bg-green-50";
        default:
            return "border-blue-300 text-blue-600 bg-blue-50";
    }
};

/**
 * Lấy trạng thái mới nhất từ orderShippingEvents (nếu có), fallback về order.status
 */
export const getLatestStatus = (order: {
    status: string;
    orderShippingEvents?: Array<{
        shippingStatus?: {
            status?: string;
        };
    }>;
}): string => {
    if (order.orderShippingEvents && order.orderShippingEvents.length > 0) {
        const lastEvent =
            order.orderShippingEvents[order.orderShippingEvents.length - 1];
        return lastEvent.shippingStatus?.status || order.status;
    }
    return order.status;
};