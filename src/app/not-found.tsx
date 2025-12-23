import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export const metadata = {
    title: "404 - Trang không tồn tại | The Book Heaven",
    description: "Rất tiếc! Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.",
};

export default function NotFoundPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-100 px-6 text-center">
            <div className="absolute inset-0">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-gradient-to-tr from-blue-500 to-blue-700 p-6 rounded-full shadow-lg">
                    <BookOpen className="text-white w-16 h-16 animate-bounce-slow" />
                </div>

                <h1 className="mt-8 text-6xl font-extrabold text-blue-700 drop-shadow-sm">
                    404
                </h1>
                <h2 className="mt-3 text-2xl font-semibold text-gray-700">
                    Ôi không! Trang bạn tìm kiếm không tồn tại
                </h2>
                <p className="mt-3 text-gray-500 max-w-md">
                    Có thể đường dẫn bị sai, trang đã bị xóa, hoặc đang trong
                    quá trình cập nhật. Hãy quay lại và khám phá thêm những cuốn
                    sách tuyệt vời khác
                </p>

                <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-110"
                >
                    <Home className="w-5 h-5" />
                    Quay về trang chủ
                </Link>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl h-2 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded-full blur-lg opacity-50"></div>
        </div>
    );
}
