"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/user-store";
import { useUpdateCustomer } from "@/queries/useCustomer";
import { toast } from "sonner";

export default function CustomerInfoForm() {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const [gender, setGender] = useState<"Nam" | "Nữ" | "Khác">(
        (user?.customer?.gender as "Nam" | "Nữ" | "Khác") || "Khác"
    );

    const updateCustomerMutation = useUpdateCustomer();

    if (!user) {
        return (
            <p className="text-gray-500 text-sm">
                Không có thông tin khách hàng để hiển thị.
            </p>
        );
    }

    const customer = user.customer;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const address = formData.get("address") as string;
        const phone = formData.get("phone") as string;
        const birthday = formData.get("birthday") as string;

        try {
            const res = await updateCustomerMutation.mutateAsync({
                id: user.customer.id,
                name,
                address,
                phone,
                email: user.email,
                birthday,
                gender,
            });

            setUser({
                ...user,
                customer: {
                    ...user.customer,
                    name,
                    address,
                    phone,
                    birthday,
                    gender,
                },
            });

            toast.success("Cập nhật thông tin khách hàng thành công!");
        } catch (error: any) {
            toast.error(
                error?.message || "Cập nhật thất bại, vui lòng thử lại!"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
                <Label className="text-gray-600 text-sm font-medium mb-2">
                    Email
                </Label>
                <Input
                    value={user.email || ""}
                    disabled
                    className="bg-gray-100 text-gray-700 cursor-not-allowed"
                />
            </div>

            <div>
                <Label className="text-gray-600 text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Họ và tên
                </Label>
                <Input
                    name="name"
                    defaultValue={customer?.name || ""}
                    required
                />
            </div>

            <div>
                <Label className="text-gray-600 text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Địa chỉ
                </Label>
                <Input
                    name="address"
                    defaultValue={customer?.address || ""}
                    required
                />
            </div>

            <div>
                <Label className="text-gray-600 text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Số điện thoại
                </Label>
                <Input name="phone" defaultValue={user.phone || ""} required />
            </div>

            <div>
                <Label className="text-gray-600 text-sm font-medium mb-2">
                    Giới tính
                </Label>
                <Select
                    value={gender}
                    onValueChange={(val) =>
                        setGender(val as "Nam" | "Nữ" | "Khác")
                    }
                >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md h-10 px-3 text-gray-700 shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-gray-600 text-sm font-medium mb-2">
                    Ngày sinh
                </Label>
                <Input
                    name="birthday"
                    type="date"
                    defaultValue={customer?.birthday?.split("T")[0] || ""}
                />
            </div>

            <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                disabled={updateCustomerMutation.isPending}
            >
                {updateCustomerMutation.isPending
                    ? "Đang cập nhật..."
                    : "Cập nhật"}
            </Button>
        </form>
    );
}
