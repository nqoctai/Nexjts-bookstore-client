import { cartApiRequests } from "@/apiRequests/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApiRequests.addToCart,
        onSuccess: async (res) => {
            toast.success(
                res.payload.message || "✅ Thêm vào giỏ hàng thành công!"
            );
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            if (error?.status === 401) {
                toast.error("🔐 Vui lòng đăng nhập để thêm vào giỏ hàng");
            } else {
                toast.error(
                    error?.message || "❌ Không thể thêm sản phẩm vào giỏ hàng"
                );
            }
        },
    });
};

export const useUpdateCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApiRequests.updateCart,
        onSuccess: async (res) => {
            toast.success(
                res.payload?.message || "✅ Cập nhật giỏ hàng thành công!",
                { duration: 1000 }
            );
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.message ||
                    "❌ Không thể cập nhật giỏ hàng, vui lòng thử lại!"
            );
        },
    });
};
export const useDeleteCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApiRequests.deleteCart,
        onSuccess: async (res) => {
            toast.success(
                res?.payload?.message ||
                    "✅ Xóa sản phẩm khỏi giỏ hàng thành công!",
                { duration: 1000 }
            );
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            toast.error(
                error?.message ||
                    "❌ Không thể xóa sản phẩm khỏi giỏ hàng, vui lòng thử lại!"
            );
        },
    });
};
