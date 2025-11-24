"use client";

import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useUploadAvatar } from "@/queries/useUploadAvatar";
import { useUserStore } from "@/stores/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateAccount } from "@/queries/useAccount";
import { useAccountQuery } from "@/queries/useAuth";

export default function UserInfoForm() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { user, tempAvatar, setTempAvatar } = useUserStore();

    const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const { mutate: uploadAvatar, isPending } = useUploadAvatar();
    const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();
    const { refetch: refetchAccount } = useAccountQuery();

    useEffect(() => {
        if (tempAvatar) {
            setAvatarUrl(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/avatar/${tempAvatar}`
            );
        } else if (user?.avatar) {
            setAvatarUrl(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/avatar/${user.avatar}`
            );
        } else {
            setAvatarUrl("/default-avatar.png");
        }

        if (user) {
            setName(user.name || "");
            setPhone(user.phone || "");
            setEmail(user.email || "");
        }
    }, [user, tempAvatar]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);

        uploadAvatar(file, {
            onSuccess: (res) => {
                const fileName = res?.payload?.data?.fileName;
                toast.success("Ảnh đại diện đã được tải lên thành công!");
                setTempAvatar(fileName);
                URL.revokeObjectURL(previewUrl);
            },
            onError: (err: any) => {
                toast.error("Tải ảnh thất bại, vui lòng thử lại!");
                URL.revokeObjectURL(previewUrl);
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("⚠️ Vui lòng nhập tên hiển thị");
            return;
        }

        if (!phone.trim()) {
            toast.error("⚠️ Vui lòng nhập số điện thoại");
            return;
        }

        if (!user?.id) {
            toast.error("⚠️ Không tìm thấy tài khoản để cập nhật");
            return;
        }

        const body = {
            id: user.id,
            email,
            username: name,
            phone,
            avatar: tempAvatar || user.avatar || null,
        };

        updateAccount(body, {
            onSuccess: async () => {
                toast.success("Cập nhật tài khoản thành công!");

                await refetchAccount();
            },
            onError: () => {
                toast.error("Cập nhật thất bại, vui lòng thử lại!");
            },
        });
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
                <div className="flex flex-col items-center gap-3 sm:w-[200px]">
                    <Avatar className="w-36 h-36 border shadow-sm">
                        {avatarUrl && (
                            <AvatarImage
                                src={avatarUrl}
                                alt={user?.name || "User Avatar"}
                                className="object-cover"
                            />
                        )}
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <Button
                        variant="outline"
                        onClick={handleUploadClick}
                        disabled={isPending}
                        className="flex items-center gap-2 text-sm border-gray-300"
                    >
                        <Upload size={14} />
                        {isPending ? "Đang tải..." : "Upload Avatar"}
                    </Button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                <form
                    onSubmit={handleUpdate}
                    className="flex-1 w-full max-w-[500px] space-y-5"
                >
                    <div>
                        <Label className="text-gray-600 text-sm font-medium mb-2">
                            Email
                        </Label>
                        <Input
                            value={email}
                            disabled
                            className="bg-gray-100 text-gray-700"
                        />
                    </div>

                    <div>
                        <Label className="text-gray-600 text-sm font-medium mb-2">
                            <span className="text-red-500">*</span> Tên hiển thị
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label className="text-gray-600 text-sm font-medium mb-2">
                            <span className="text-red-500">*</span> Số điện
                            thoại
                        </Label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8"
                        >
                            {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
