"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useChangePassword } from "@/queries/useAccount";
import {
    ChangePasswordBody,
    ChangePasswordBodyType,
} from "@/schemaValidations/changePassword.schema";
import { toast } from "sonner";

export default function ChangePasswordForm() {
    const user = useUserStore((state) => state.user);
    const changePasswordMutation = useChangePassword();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const form = useForm<ChangePasswordBodyType>({
        resolver: zodResolver(ChangePasswordBody),
        defaultValues: {
            email: user?.email || "",
            oldPassword: "",
            newPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordBodyType) => {
        if (changePasswordMutation.isPending) return;
        try {
            await changePasswordMutation.mutateAsync(data);
            toast.success("✅ Đổi mật khẩu thành công!");
            form.reset({
                email: user?.email || "",
                oldPassword: "",
                newPassword: "",
            });
        } catch (error: any) {
            toast.error(
                error?.message || "Không thể đổi mật khẩu, vui lòng thử lại!"
            );
        }
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-lg"
            noValidate
        >
            <div>
                <Label className="text-gray-600 text-sm font-medium mb-2">
                    Email
                </Label>
                <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-100 cursor-not-allowed text-gray-700"
                />
            </div>

            <div className="relative">
                <Label className="text-gray-600 text-sm font-medium mb-2 block">
                    <span className="text-red-500">*</span> Mật khẩu hiện tại
                </Label>
                <Input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    {...form.register("oldPassword")}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                >
                    {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {form.formState.errors.oldPassword && (
                    <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.oldPassword.message}
                    </p>
                )}
            </div>

            <div className="relative">
                <Label className="text-gray-600 text-sm font-medium mb-2 block">
                    <span className="text-red-500">*</span> Mật khẩu mới
                </Label>
                <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    {...form.register("newPassword")}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                >
                    {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {form.formState.errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.newPassword.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
                {changePasswordMutation.isPending
                    ? "Đang xử lý..."
                    : "Xác nhận"}
            </Button>
        </form>
    );
}
