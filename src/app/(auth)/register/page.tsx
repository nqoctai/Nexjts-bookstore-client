import Image from "next/image";

import BookRegister from "../../../../public/images/book_register.png";
import RegisterForm from "./RegisterForm";

export const metadata = {
    title: "Đăng ký tài khoản | The Book Heaven",
    description: "Tạo tài khoản để tham gia cộng đồng The Book Heaven.",
};

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#f0f9ff] to-[#e0f7fa] overflow-hidden">
            <div className="hidden lg:flex flex-1 items-center justify-center relative">
                <div className="absolute inset-0 bg-cover opacity-10" />
                <div className="relative z-10 max-w-full text-center px-10">
                    <Image
                        src={BookRegister}
                        alt="Book illustration"
                        width={470}
                        height={470}
                        className="mx-auto mb-10 drop-shadow-2xl"
                        priority
                        quality={100}
                    />
                    <h2 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
                        The Book Heaven
                    </h2>
                    <p className="text-gray-600 text-xl leading-relaxed max-w-xl">
                        Tham gia cộng đồng nơi tri thức và đam mê đọc sách giao
                        hòa. Mỗi trang sách là một hành trình mới
                    </p>
                </div>
            </div>

            <RegisterForm />
        </div>
    );
}
