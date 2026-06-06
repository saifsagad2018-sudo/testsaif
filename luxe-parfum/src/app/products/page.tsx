import { fetchGistData } from "@/lib/gist";
import Header from "@/components/store/Header";
import ProductCard from "@/components/store/ProductCard";
import ProductFilters from "@/components/store/ProductFilters";
import { Suspense } from "react";

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ category?: string; size?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const data = await fetchGistData();
  const { settings, products, categories } = data;

  let filtered = [...products];
  if (params.category) filtered = filtered.filter((p) => p.category === params.category);
  if (params.size) filtered = filtered.filter((p) => p.variants.some((v) => v.size === params.size));
  if (params.sort === "price-asc") {
    filtered.sort((a, b) => Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price)));
  } else if (params.sort === "price-desc") {
    filtered.sort((a, b) => Math.min(...b.variants.map((v) => v.price)) - Math.min(...a.variants.map((v) => v.price)));
  }

  const allSizes = Array.from(new Set(products.flatMap((p) => p.variants.map((v) => v.size)))).sort();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header settings={settings} />
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "7rem 2rem 4rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "0.5rem" }}>◆ The Collection</p>
          <h1 className="display" style={{ fontSize: "3.5rem", color: "var(--text)" }}>All Fragrances</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>{filtered.length} scents</p>
        </div>
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start" }}>
          <div style={{ width: "220px", flexShrink: 0 }}>
            <Suspense fallback={null}>
              <ProductFilters
                categories={categories}
                sizes={allSizes}
                activeCategory={params.category}
                activeSize={params.size}
                activeSort={params.sort}
              />
            </Suspense>
          </div>
          <div style={{ flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}>No fragrances found</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
