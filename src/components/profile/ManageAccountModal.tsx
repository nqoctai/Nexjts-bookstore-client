"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UserInfoForm from "./UserInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import CustomerInfoForm from "./CustomerInfoForm";

export default function ManageAccountModal({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const isCustomer = true; // tạm thời mock role CUSTOMER

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Quản lý tài khoản
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="info" className="mt-2">
                    <TabsList className="flex gap-2">
                        <TabsTrigger value="info">
                            Thông tin tài khoản
                        </TabsTrigger>
                        <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                        {isCustomer && (
                            <TabsTrigger value="customer">
                                Thông tin khách hàng
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="info" className="mt-4">
                        <UserInfoForm />
                    </TabsContent>

                    <TabsContent value="password" className="mt-4">
                        <ChangePasswordForm />
                    </TabsContent>

                    {isCustomer && (
                        <TabsContent value="customer" className="mt-4">
                            <CustomerInfoForm />
                        </TabsContent>
                    )}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
