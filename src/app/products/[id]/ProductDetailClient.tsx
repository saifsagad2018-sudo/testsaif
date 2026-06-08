"use client";

// ============================================================
// PRODUCT DETAIL CLIENT — Interactive variant selector + gallery
// ============================================================

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/lib/cart";

interface Props {
  product: Product;
  currency: string;
}

export default function ProductDetailClient({ product, currency }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeVariant, setActiveVariant] = useState(
    product.variants.findIndex((v) => v.status !== "sold_out") || 0
  );
  const { addItem } = useCart();

  const variant = product.variants[activeVariant];

  const handleAddToCart = () => {
    if (!variant || variant.status === "sold_out") return;
    addItem({
      productId: product.id,
      productName: product.name,
      image: product.images[0],
      ml: variant.ml,
      price: variant.price,
      quantity: 1,
    });
  };

  const statusLabel = {
    available: { text: "متوفر", color: "text-green-400" },
    limited: { text: "كمية محدودة", color: "text-yellow-400" },
    sold_out: { text: "نفذ الكمية", color: "text-red-400" },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      {/* ── Image Gallery ─────────────────────────────────── */}
      <div className="space-y-4">
        <div className="img-zoom aspect-square bg-[var(--color-surface-alt)] overflow-hidden">
          {product.images[activeImage] ? (
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">
              🌸
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 overflow-hidden border-2 transition-all ${
                  activeImage === i
                    ? "border-[var(--color-accent)]"
                    : "border-[var(--color-border)] opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Product Info ───────────────────────────────────── */}
      <div className="space-y-6 lg:sticky lg:top-28">
        <div>
          <p className="text-[var(--color-accent)] text-xs tracking-[0.3em] uppercase mb-2 font-arabic">
            {product.brand}
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-text)] leading-tight">
            {product.name}
          </h1>
        </div>

        <div className="h-px bg-[var(--color-border)]" />

        <p className="text-[var(--color-text-muted)] leading-relaxed font-arabic">
          {product.description}
        </p>

        {/* ── Volume Selector ────────────────────────────── */}
        <div>
          <p className="text-xs tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-arabic">
            اختر الحجم
          </p>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v, i) => (
              <button
                key={v.ml}
                onClick={() => v.status !== "sold_out" && setActiveVariant(i)}
                disabled={v.status === "sold_out"}
                className={`relative px-6 py-3 border text-sm font-arabic transition-all ${
                  activeVariant === i
                    ? "bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)]"
                    : v.status === "sold_out"
                    ? "border-[var(--color-border)] text-[var(--color-border)] cursor-not-allowed line-through"
                    : "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                }`}
              >
                {v.ml}ml
                {v.status === "limited" && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[8px] px-1 rounded-full">
                    !
                  </span>
                )}
              </button>
            ))}
          </div>
          {variant && (
            <p
              className={`mt-2 text-xs font-arabic ${
                statusLabel[variant.status].color
              }`}
            >
              ● {statusLabel[variant.status].text}
            </p>
          )}
        </div>

        {/* ── Price ─────────────────────────────────────────── */}
        <div className="flex items-baseline gap-3">
          <span className="font-display text-5xl text-[var(--color-accent)]">
            {currency}{variant?.price ?? "—"}
          </span>
        </div>

        {/* ── Add to Cart ───────────────────────────────────── */}
        <button
          onClick={handleAddToCart}
          disabled={!variant || variant.status === "sold_out"}
          className={`btn-luxury-fill w-full font-arabic text-base py-4 ${
            !variant || variant.status === "sold_out"
              ? "opacity-40 cursor-not-allowed"
              : ""
          }`}
        >
          {variant?.status === "sold_out" ? "نفذ الكمية" : "أضف إلى السلة"}
        </button>

        {/* ── Fragrance Notes ───────────────────────────────── */}
        <div className="border border-[var(--color-border)] p-6 space-y-4">
          <h3 className="font-display text-lg text-[var(--color-text)]">
            مكونات العطر
          </h3>
          <div className="divider-accent mx-0" />

          {[
            { label: "رائحة الافتتاح", notes: product.notes.top, emoji: "🌿" },
            { label: "القلب", notes: product.notes.heart, emoji: "🌸" },
            { label: "القاعدة", notes: product.notes.base, emoji: "🪵" },
          ].map(({ label, notes, emoji }) => (
            <div key={label}>
              <p className="text-[var(--color-text-muted)] text-xs tracking-widest uppercase mb-2 font-arabic">
                {emoji} {label}
              </p>
              <div className="flex flex-wrap gap-2">
                {notes.map((note) => (
                  <span key={note} className="tag-note font-arabic">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
