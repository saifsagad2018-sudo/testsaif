"use client";
import Link from "next/link";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const hasStock = product.variants.some((v) => v.status !== "out_of_stock");

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card" style={{ overflow: "hidden", cursor: "pointer" }}>
        <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "var(--primary)" }}>
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "3rem" }}>◆</div>
          )}
          {product.featured && (
            <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--gold)", color: "var(--bg)", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.25rem 0.6rem", fontWeight: 500 }}>
              Featured
            </div>
          )}
          {!hasStock && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Sold Out</span>
            </div>
          )}
        </div>
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.4rem" }}>
            {product.category}
          </p>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 400, marginBottom: "0.3rem", color: "var(--text)" }}>
            {product.name}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem", fontStyle: "italic" }}>
            {product.tagline}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>From ${minPrice}</span>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {product.variants.map((v) => (
                <span key={v.size} className="tag" style={{ opacity: v.status === "out_of_stock" ? 0.4 : 1 }}>{v.size}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
