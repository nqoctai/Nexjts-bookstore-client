import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo_Book from "../../public/images/logo_book.jpg";

import VNPAY from "../../public/images/vn_pay.webp";
import MOMO from "../../public/images/momo_pay.webp";
import SHOPEEPAY from "../../public/images/shopee_pay.webp";
import ZALOPAY from "../../public/images/zalo_pay.webp";

export default function FooterCustomer() {
    return (
        <footer className="bg-gradient-to-b from-gray-100 to-white text-gray-700 pt-12 pb-6  border-t">
            <div className="max-w-screen-xl mx-auto  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <Image
                            src={Logo_Book}
                            alt="BookStore Logo"
                            width={80}
                            height={80}
                            className="rounded-lg shadow-md"
                            quality={100}
                        />
                        <h2 className="text-2xl font-bold">
                            <span className="text-blue-600">The Book</span>
                            <span className="text-gray-800"> Heaven</span>
                        </h2>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Nền tảng mua sách trực tuyến hiện đại — nơi bạn dễ dàng
                        tìm thấy cuốn sách yêu thích với giá tốt nhất.
                    </p>

                    <div className="flex items-center gap-4 mt-6">
                        <Link
                            href="#"
                            className="p-2 bg-blue-600 rounded-full hover:scale-110 transition-transform shadow-md"
                            aria-label="Facebook"
                        >
                            <FaFacebookF size={22} className="text-white" />
                        </Link>
                        <Link
                            href="#"
                            className="p-2 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full hover:scale-110 transition-transform shadow-md"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={22} className="text-white" />
                        </Link>
                        <Link
                            href="#"
                            className="p-2 bg-red-600 rounded-full hover:scale-110 transition-transform shadow-md"
                            aria-label="YouTube"
                        >
                            <FaYoutube size={22} className="text-white" />
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-blue-700 mb-4 border-l-4 border-blue-500 pl-3">
                        Về BookStore
                    </h3>
                    <ul className="space-y-2 text-base">
                        <li>
                            <Link href="#" className="hover:text-blue-600">
                                Giới thiệu
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className="hover:text-blue-600"
                            >
                                Liên hệ chúng tôi
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-600">
                                Tin tức & Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-600">
                                Hệ thống cửa hàng
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-blue-700 mb-4 border-l-4 border-blue-500 pl-3">
                        Hỗ trợ khách hàng
                    </h3>
                    <ul className="space-y-2 text-base">
                        <li>
                            <Link href="#" className="hover:text-blue-600">
                                Hướng dẫn mua hàng
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-600">
                                Phương thức thanh toán
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-600">
                                Chính sách đổi trả
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-600">
                                Câu hỏi thường gặp
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-blue-700 mb-4 border-l-4 border-blue-500 pl-3">
                        Liên hệ
                    </h3>
                    <ul className="space-y-3 text-base mb-6">
                        <li className="flex items-center gap-2">
                            <MapPin
                                size={20}
                                className="text-blue-600 shrink-0"
                            />
                            <span>
                                49 Nguyễn Đỗ Cung, phường Tây Thạnh, quận Tân
                                Phú, TP.HCM
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={18} className="text-blue-600" />
                            <span>0867173946</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={18} className="text-blue-600" />
                            <span>caoducnghia1605@gmail.com</span>
                        </li>
                    </ul>

                    <div>
                        <h4 className="text-xl font-semibold text-blue-700 mb-4 border-l-4 border-blue-500 pl-3">
                            Phương thức thanh toán
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {[VNPAY, MOMO, SHOPEEPAY, ZALOPAY].map((img, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl shadow-md border border-gray-200 p-2 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200"
                                >
                                    <Image
                                        src={img}
                                        alt="Phương thức thanh toán"
                                        width={70}
                                        height={70}
                                        className="object-contain w-16 h-10 sm:w-20 sm:h-12"
                                        quality={100}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-300 mt-12">
                <div className="max-w-screen-xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-base text-gray-600">
                    <p>
                        © {new Date().getFullYear()}{" "}
                        <span className="text-blue-600 font-semibold">
                            The Book Heaven
                        </span>{" "}
                        - Bản quyền thuộc về The Book Heaven . Mọi quyền được
                        bảo lưu.
                    </p>
                    <p className="mt-2 sm:mt-0 flex items-center justify-center sm:justify-start gap-1">
                        Thiết kế với{" "}
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
                        bởi{" "}
                        <span className="text-blue-600 font-semibold">
                            Đội ngũ The Book Heaven
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
