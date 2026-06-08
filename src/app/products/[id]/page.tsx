// ============================================================
// PRODUCT DETAIL PAGE — Images, variants, notes, add to cart
// ============================================================

import { notFound } from "next/navigation";
import { fetchGistData } from "@/lib/gist";
import ProductDetailClient from "./ProductDetailClient";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

export const revalidate = 30;

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const data = await fetchGistData();
  return data.products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: Props) {
  const data = await fetchGistData();
  const product = data.products.find((p) => p.id === params.id);

  if (!product) notFound();

  return (
    <>
      <Header settings={data.settings} />
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <ProductDetailClient
          product={product}
          currency={data.settings.currencySymbol}
        />
      </main>
      <Footer settings={data.settings} />
    </>
  );
}
