"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Mail, KeyRound, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import {
    ForgotPasswordEmailBody,
    ForgotPasswordEmailBodyType,
    ResetPasswordBody,
    ResetPasswordBodyType,
} from "@/schemaValidations/forgotPassword.schema";
import {
    useForgotPasswordMutation,
    useResendCodeMutation,
    useResetPasswordMutation,
} from "@/queries/useForgotPassword";

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "reset">("email");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const forgotPasswordMutation = useForgotPasswordMutation();
    const resendCodeMutation = useResendCodeMutation();
    const resetPasswordMutation = useResetPasswordMutation();

    const emailForm = useForm<ForgotPasswordEmailBodyType>({
        defaultValues: { email: "" },
        resolver: zodResolver(ForgotPasswordEmailBody),
    });

    const resetForm = useForm<ResetPasswordBodyType>({
        defaultValues: {
            email: "",
            code: "",
            password: "",
        },
        resolver: zodResolver(ResetPasswordBody),
    });

    const onSubmitEmail = async (data: ForgotPasswordEmailBodyType) => {
        if (forgotPasswordMutation.isPending) return;
        try {
            const result = await forgotPasswordMutation.mutateAsync(data);
            toast.success(
                result.payload.message || "Mã xác nhận đã được gửi đến email!"
            );
            setEmail(data.email);
            resetForm.setValue("email", data.email);
            setStep("reset");
            startCountdown();
        } catch (error: any) {
            toast.error(
                error?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại."
            );
        }
    };

    const onSubmitReset = async (data: ResetPasswordBodyType) => {
        if (resetPasswordMutation.isPending) return;
        try {
            const result = await resetPasswordMutation.mutateAsync(data);
            toast.success(result.payload.message || "Đổi mật khẩu thành công!");
            resetForm.reset();
            setTimeout(() => router.push("/login"), 1500);
        } catch (error: any) {
            toast.error(
                error?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
            );
        }
    };

    const handleResendCode = async () => {
        if (resendCodeMutation.isPending || countdown > 0) return;
        try {
            const result = await resendCodeMutation.mutateAsync({ email });
            toast.success(
                result.payload.message || "Mã xác nhận đã được gửi lại!"
            );
            startCountdown();
        } catch (error: any) {
            toast.error(
                error?.message || "Gửi lại mã thất bại. Vui lòng thử lại."
            );
        }
    };

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    if (step === "email") {
        return (
            <Card className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-2xl border border-white/30 rounded-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-blue-600/10">
                            <Mail className="w-7 h-7 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-800">
                        Quên mật khẩu
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-base">
                        Nhập email để nhận mã xác nhận
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...emailForm}>
                        <form
                            onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                            className="space-y-5"
                            noValidate
                        >
                            <FormField
                                control={emailForm.control}
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
                                                className="bg-white/80 border-gray-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                                disabled={forgotPasswordMutation.isPending}
                            >
                                {forgotPasswordMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-5 w-5" />
                                        Gửi mã xác nhận
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-2xl border border-white/30 rounded-2xl">
            <CardHeader className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-blue-600/10">
                        <KeyRound className="w-7 h-7 text-blue-600" />
                    </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800">
                    Đặt lại mật khẩu
                </CardTitle>
                <CardDescription className="text-gray-500 text-base">
                    Nhập mã xác nhận và mật khẩu mới
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...resetForm}>
                    <form
                        onSubmit={resetForm.handleSubmit(onSubmitReset)}
                        className="space-y-4"
                        noValidate
                    >
                        <FormField
                            control={resetForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="!text-gray-900">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            disabled
                                            className="bg-gray-100 cursor-not-allowed"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={resetForm.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="!text-gray-900">
                                        Mã xác nhận
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập mã 6 ký tự"
                                            className="bg-white/80 border-gray-300"
                                            maxLength={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={resetForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="!text-gray-900">
                                        Mật khẩu mới
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="••••••••"
                                                className="bg-white/80 border-gray-300 pr-10"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) => !prev
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? (
                                                    <Eye className="w-5 h-5" />
                                                ) : (
                                                    <EyeOff className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                            disabled={resetPasswordMutation.isPending}
                        >
                            {resetPasswordMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <KeyRound className="mr-2 h-5 w-5" />
                                    Đặt lại mật khẩu
                                </>
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-4">
                    <Button
                        type="button"
                        onClick={handleResendCode}
                        disabled={countdown > 0 || resendCodeMutation.isPending}
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                        {countdown > 0 ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5" />
                                Gửi lại mã sau {countdown}s
                            </>
                        ) : resendCodeMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-5 w-5" />
                                Gửi lại mã xác nhận
                            </>
                        )}
                    </Button>
                </div>

                <div className="mt-4 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Quay lại đăng nhập
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
