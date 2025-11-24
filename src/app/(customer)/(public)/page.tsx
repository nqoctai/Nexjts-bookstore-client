import HomeClient from "@/components/home/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cửa hàng bán sách online | The Book Heaven",
    description:
        "Mua sách online với giá tốt nhất. The Book Heaven - Nền tảng mua bán sách trực tuyến hiện đại.",
};

export default function HomePage() {
    return (
        <section className="bg-gray-100 min-h-screen">
            <HomeClient />
        </section>
    );
}
