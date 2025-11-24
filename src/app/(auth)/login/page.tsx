import Image from "next/image";
import BookLogin from "../../../../public/images/book_login.png";
import LoginForm from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng nhập | The Book Heaven",
    description: "Đăng nhập vào tài khoản The Book Heaven để mua sách.",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#f0f9ff] to-[#e0f7fa] overflow-hidden">
            <div className="flex flex-1 items-center justify-center p-8">
                <LoginForm />
            </div>

            <div className="hidden lg:flex flex-1 items-center justify-center relative">
                <div className="absolute inset-0 bg-cover opacity-10" />
                <div className="relative z-10 max-w-full text-center px-10">
                    <Image
                        src={BookLogin}
                        alt="Book illustration"
                        width={480}
                        height={480}
                        className="mx-auto drop-shadow-lg"
                        priority
                        quality={100}
                    />
                    <h2 className="text-6xl font-bold text-gray-800 mb-3 leading-tight">
                        Khám phá tri thức 📖
                    </h2>
                    <p className="text-gray-600 text-xl leading-relaxed max-w-xl">
                        Đọc sách, chia sẻ và cùng nhau phát triển. <br />
                        The Book Heaven là nơi những câu chuyện bắt đầu. <br />
                        ☆*: .｡. o(≧▽≦)o .｡.:*☆
                    </p>
                </div>
            </div>
        </div>
    );
}
