import { fetchGistData } from "@/lib/gist";
import Header from "@/components/store/Header";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface Props { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const data = await fetchGistData();
  const product = data.products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header settings={data.settings} />
      <ProductDetailClient product={product} settings={data.settings} />
    </div>
  );
}
