import ProductDetailClient from "@/components/product/ProductDetailClient";

interface ProductPageProps {
    params: { slug: string };
    searchParams: Promise<{ id?: string }>;
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
    const query = await searchParams;
    const id = Number(query.id);

    return <ProductDetailClient id={id} />;
}
