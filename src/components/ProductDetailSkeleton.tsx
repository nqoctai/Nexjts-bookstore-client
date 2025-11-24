"use client";

export default function ProductDetailSkeleton() {
    return (
        <section className="bg-gray-50 py-8 px-4 animate-pulse">
            <div className="max-w-screen-xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                    <div>
                        <div className="w-full h-[460px] bg-gray-200 rounded-lg mb-4" />
                        <div className="flex justify-center gap-3 mt-4">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-20 h-20 bg-gray-200 rounded-lg"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="h-5 w-1/2 bg-gray-200 rounded" />
                        <div className="h-8 w-3/4 bg-gray-200 rounded" />
                        <div className="h-5 w-1/3 bg-gray-200 rounded" />
                        <div className="h-10 w-1/2 bg-gray-200 rounded" />
                        <div className="h-6 w-2/3 bg-gray-200 rounded" />
                        <div className="h-10 w-3/4 bg-gray-200 rounded" />
                        <div className="flex gap-3">
                            <div className="h-12 w-1/2 bg-gray-200 rounded-md" />
                            <div className="h-12 w-1/2 bg-gray-200 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
