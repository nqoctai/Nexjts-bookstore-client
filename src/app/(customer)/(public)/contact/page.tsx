import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Liên hệ với The Book Heaven | Hỗ trợ khách hàng",
    description:
        "Liên hệ The Book Heaven để được hỗ trợ. Địa chỉ: 49 Nguyễn Đỗ Cung, TP.HCM. Điện thoại: 0867 173 946",
};

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-300 via-blue-200 to-blue-50 py-20 text-center shadow-inner">
                <div className="relative z-10 max-w-screen-xl mx-auto px-6">
                    <h1 className="mb-3 text-4xl font-extrabold text-blue-700 drop-shadow-sm md:text-5xl">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="mt-4 text-lg text-gray-700">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn{" "}
                        <span className="font-semibold text-blue-600">
                            ☆*: .｡. o(≧▽≦)o .｡.:*☆
                        </span>
                    </p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto grid items-start gap-10 px-6 py-16 md:grid-cols-2">
                <div>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8 shadow-md">
                        <div className="mb-8 space-y-4">
                            <div className="flex items-start space-x-3">
                                <span className="text-xl text-blue-600">
                                    📍
                                </span>
                                <p className="text-gray-700">
                                    <span className="font-semibold">
                                        Địa chỉ:
                                    </span>{" "}
                                    49 Nguyễn Đỗ Cung, phường Tây Thạnh, Quận
                                    Tân Phú, TP. Hồ Chí Minh
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-xl text-blue-600">
                                    📞
                                </span>
                                <p className="text-gray-700">
                                    <span className="font-semibold">
                                        Điện thoại:
                                    </span>{" "}
                                    0867 173 946
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-xl text-blue-600">
                                    ✉️
                                </span>
                                <p className="text-gray-700">
                                    <span className="font-semibold">
                                        Email:
                                    </span>{" "}
                                    contact@nhasachabc.com
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-xl text-blue-600">
                                    ⏰
                                </span>
                                <p className="text-gray-700">
                                    <span className="font-semibold">
                                        Giờ làm việc:
                                    </span>{" "}
                                    8:00 - 20:00 (Thứ 2 - CN)
                                </p>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <h2 className="mb-3 text-xl font-semibold text-blue-700">
                                Gửi tin nhắn cho chúng tôi
                            </h2>
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                className="w-full rounded-xl border border-blue-200 bg-white p-3 outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full rounded-xl border border-blue-200 bg-white p-3 outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <textarea
                                placeholder="Nội dung"
                                className="h-28 w-full resize-none rounded-xl border border-blue-200 bg-white p-3 outline-none focus:ring-2 focus:ring-blue-400"
                            ></textarea>
                            <button
                                type="button"
                                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-110"
                            >
                                Gửi liên hệ
                            </button>
                        </form>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-blue-100 shadow-md">
                    <iframe
                        title="Bản đồ nhà sách"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.085385250164!2d106.62700297480426!3d10.807214689340555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175295882f32fe5%3A0x381719f817d6a970!2zNDkgxJAuIE5ndXnhu4VuIMSQ4buXIEN1bmcsIFRheSBUaOG6pW5oLCBUw6JuIFBow7osIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1697377000000!5m2!1svi!2s"
                        width="100%"
                        height="500"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
            </div>

            <div className="mt-12 border-t border-blue-100 bg-gradient-to-r from-blue-100 to-blue-50 py-14">
                <div className="max-w-screen-xl mx-auto text-center px-6">
                    <h3 className="mb-8 text-3xl font-bold text-blue-700">
                        Đăng ký nhận tin khuyến mãi
                    </h3>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="w-full sm:w-[70%] rounded-full border border-blue-200 bg-white/60 p-4 text-gray-700 outline-none backdrop-blur-sm focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="button"
                            className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-10 py-4 font-semibold text-white shadow-md transition hover:brightness-110"
                        >
                            Đăng ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
