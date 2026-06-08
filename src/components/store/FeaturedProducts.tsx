"use client";

// ============================================================
// FEATURED PRODUCTS — Grid with optional category/price filters
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { Product, Category } from "@/types";
import { useCart } from "@/lib/cart";

interface Props {
  products: Product[];
  categories?: Category[];
  currency: string;
  showFilters?: boolean;
}

export default function FeaturedProducts({
  products,
  categories = [],
  currency,
  showFilters = false,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">(
    "default"
  );
  const { addItem } = useCart();

  let filtered = products.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  if (sortBy === "price-asc") {
    filtered = [...filtered].sort(
      (a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0)
    );
  } else if (sortBy === "price-desc") {
    filtered = [...filtered].sort(
      (a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0)
    );
  }

  return (
    <div>
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 mb-10 justify-center">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2 text-sm border transition-all font-arabic ${
              activeCategory === "all"
                ? "bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 text-sm border transition-all font-arabic ${
                activeCategory === cat.id
                  ? "bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]"
              }`}
            >
              {cat.icon} {cat.nameAr}
            </button>
          ))}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-luxury max-w-[160px] text-sm font-arabic"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price-asc">السعر: الأقل أولاً</option>
            <option value="price-desc">السعر: الأعلى أولاً</option>
          </select>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={currency}
            delay={i * 0.05}
            onAddToCart={() => {
              const v = product.variants.find((v) => v.status !== "sold_out");
              if (v) {
                addItem({
                  productId: product.id,
                  productName: product.name,
                  image: product.images[0],
                  ml: v.ml,
                  price: v.price,
                  quantity: 1,
                });
              }
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[var(--color-text-muted)] font-arabic">
          لا توجد منتجات في هذه الفئة
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  currency,
  delay,
  onAddToCart,
}: {
  product: Product;
  currency: string;
  delay: number;
  onAddToCart: () => void;
}) {
  const lowestPrice = Math.min(...product.variants.map((v) => v.price));
  const hasAvailable = product.variants.some((v) => v.status !== "sold_out");

  return (
    <article
      className="card-luxury group cursor-pointer opacity-0 animate-fadeUp"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="img-zoom relative aspect-[3/4] overflow-hidden bg-[var(--color-surface-alt)]">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20">🌸</span>
            </div>
          )}
          {/* Featured badge */}
          {product.featured && (
            <span className="absolute top-4 right-4 bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] px-3 py-1 tracking-widest uppercase font-arabic">
              مميز
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-6">
        <p className="text-[var(--color-text-muted)] text-xs tracking-widest uppercase mb-1 font-arabic">
          {product.brand}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-display text-xl text-[var(--color-text)] mb-2 hover:text-[var(--color-accent)] transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-[var(--color-text-muted)] text-sm line-clamp-2 mb-4 font-arabic leading-relaxed">
          {product.description}
        </p>

        {/* Variants pills */}
        <div className="flex gap-2 flex-wrap mb-4">
          {product.variants.map((v) => (
            <span
              key={v.ml}
              className={`text-xs px-2 py-1 border font-arabic ${
                v.status === "sold_out"
                  ? "opacity-30 line-through border-[var(--color-border)]"
                  : "border-[var(--color-accent)] text-[var(--color-accent)]"
              }`}
            >
              {v.ml}ml
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-border)]">
          <span className="font-display text-xl text-[var(--color-accent)]">
            {currency}{lowestPrice}
          </span>
          <button
            onClick={onAddToCart}
            disabled={!hasAvailable}
            className={`btn-luxury text-xs py-2 px-5 ${!hasAvailable ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            {hasAvailable ? "أضف للسلة" : "نفذ الكمية"}
          </button>
        </div>
      </div>
    </article>
  );
}
