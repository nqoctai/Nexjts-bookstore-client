"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { BookOpen, Sparkles, Eye, EyeOff } from "lucide-react";
import { useRegisterMutation } from "@/queries/useAuth";
import {
    RegisterBody,
    RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function RegisterForm() {
    const router = useRouter();
    const registerMutation = useRegisterMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<RegisterBodyType>({
        defaultValues: {
            username: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
        resolver: zodResolver(RegisterBody),
    });

    const onSubmit = async (data: RegisterBodyType) => {
        if (registerMutation.isPending) return;
        try {
            const { confirmPassword, ...payload } = data;
            const result = await registerMutation.mutateAsync(payload);
            toast.success(result.payload.message || "Đăng ký thành công!");
            form.reset();
            setTimeout(() => router.push("/login"), 1500);
        } catch (error: any) {
            toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <Card className="w-full max-w-lg bg-white/60 backdrop-blur-lg shadow-2xl border border-white/40 rounded-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-blue-600/10">
                            <BookOpen className="w-7 h-7 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-4xl font-bold text-gray-800">
                        Đăng ký tài khoản
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-base">
                        Chào mừng đến với hành trình đọc sách cùng BookStore ✨
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                            noValidate
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="!text-gray-900">
                                            Họ và tên
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nguyễn Văn A"
                                                className="mt-1 bg-white/80 border-gray-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="!text-gray-900">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                className="mt-1 bg-white/80 border-gray-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="!text-gray-900">
                                            Số điện thoại
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="0123 456 789"
                                                className="mt-1 bg-white/80 border-gray-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="!text-gray-900">
                                            Mật khẩu
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="••••••••"
                                                    className="mt-1 bg-white/80 border-gray-300 pr-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <Eye className="w-5 h-5" />
                                                ) : (
                                                    <EyeOff className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="!text-gray-900">
                                            Xác nhận mật khẩu
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={
                                                        showConfirm
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="••••••••"
                                                    className="mt-1 bg-white/80 border-gray-300 pr-10"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                                onClick={() =>
                                                    setShowConfirm(!showConfirm)
                                                }
                                                tabIndex={-1}
                                            >
                                                {showConfirm ? (
                                                    <Eye className="w-5 h-5" />
                                                ) : (
                                                    <EyeOff className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium rounded-lg"
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Đăng ký ngay
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
