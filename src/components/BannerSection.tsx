"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import banner1 from "../../public/images/banner1.webp";
import banner2 from "../../public/images/banner2.webp";
import banner3 from "../../public/images/banner3.webp";
import banner4 from "../../public/images/banner4.webp";
import banner5 from "../../public/images/banner5.webp";
import banner6 from "../../public/images/banner6.jpg";
import promo2 from "../../public/images/promo2.webp";
import promo3 from "../../public/images/promo3.webp";
import card1 from "../../public/images/card1.webp";
import card2 from "../../public/images/card2.webp";
import card3 from "../../public/images/card3.webp";
import card4 from "../../public/images/card4.jpg";

export default function BannerSection() {
    return (
        <section className="max-w-screen-xl mx-auto pt-10 flex flex-col gap-6 lg:px-0">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-2/3">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 3000 }}
                        loop
                        pagination={{ clickable: true }}
                        className="rounded-xl shadow-lg overflow-hidden"
                    >
                        {[
                            banner1,
                            banner2,
                            banner3,
                            banner4,
                            banner5,
                            banner6,
                        ].map((img, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-[200px] sm:h-[280px] md:h-[320px] lg:h-[360px]">
                                    <Image
                                        src={img}
                                        alt={`banner-${index + 1}`}
                                        className="object-cover w-full h-full rounded-xl"
                                        priority={index === 0}
                                        quality={100}
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="w-full lg:w-1/3 flex flex-col sm:flex-row lg:flex-col gap-4">
                    {[promo2, promo3].map((img, index) => (
                        <div
                            key={index}
                            className="relative flex-1 h-[130px] sm:h-[160px] md:h-[180px] lg:h-[150px] rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                        >
                            <Image
                                src={img}
                                alt={`promo-${index + 1}`}
                                quality={100}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[card1, card2, card3, card4].map((img, index) => (
                    <div
                        key={index}
                        className="relative w-full h-[120px] sm:h-[150px] md:h-[180px] rounded-xl overflow-hidden"
                    >
                        <Image
                            src={img}
                            alt={`promo-card-${index + 1}`}
                            quality={100}
                            className="object-cover hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
