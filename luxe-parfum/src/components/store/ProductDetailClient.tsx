"use client";
import { useState } from "react";
import type { Product, CartItem, SiteSettings } from "@/types";

interface Props {
  product: Product;
  settings: SiteSettings;
}

function buildWhatsappUrl(settings: SiteSettings, product: Product, size: string, price: number, qty: number): string {
  const phone = settings.whatsapp?.replace(/\D/g, "") ?? "";
  if (!phone) return "#";
  const currencySymbol = settings.currency === "USD" ? "$" : settings.currency;
  const msg = `${settings.whatsappMessage || "Hello! I'd like to order:"}

*${product.name}*
• Size: ${size}
• Quantity: ${qty}
• Price: ${currencySymbol}${price} each
• Total: ${currencySymbol}${price * qty}

Product link: ${typeof window !== "undefined" ? window.location.href : ""}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export default function ProductDetailClient({ product, settings }: Props) {
  const firstAvailable = product.variants.find((v) => v.status !== "out_of_stock") ?? product.variants[0];
  const [activeVariant, setActiveVariant] = useState(firstAvailable);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const currencySymbol = settings.currency === "USD" ? "$" : settings.currency;

  const addToCart = () => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("luxe-cart") ?? "[]");
    const idx = cart.findIndex((i) => i.productId === product.id && i.size === activeVariant.size);
    if (idx > -1) {
      cart[idx].quantity += qty;
    } else {
      cart.push({ productId: product.id, productName: product.name, image: product.images[0] ?? "", size: activeVariant.size, price: activeVariant.price, quantity: qty });
    }
    localStorage.setItem("luxe-cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappUrl = buildWhatsappUrl(settings, product, activeVariant.size, activeVariant.price, qty);
  const hasWhatsapp = !!settings.whatsapp;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "7rem 2rem 4rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>

        {/* Images */}
        <div>
          <div style={{ aspectRatio: "4/5", overflow: "hidden", background: "var(--primary)", marginBottom: "0.75rem" }}>
            {product.images[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "4rem" }}>◆</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} style={{ width: "70px", height: "70px", overflow: "hidden", border: `2px solid ${i === activeImage ? "var(--gold)" : "var(--border)"}`, background: "none", cursor: "pointer", padding: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ paddingTop: "1rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "0.75rem" }}>{product.category}</p>
          <h1 className="display" style={{ fontSize: "2.8rem", color: "var(--text)", marginBottom: "0.25rem" }}>{product.name}</h1>
          {product.nameAr && (
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "0.5rem", direction: "rtl" }}>{product.nameAr}</p>
          )}
          <p style={{ fontStyle: "italic", color: "var(--text-muted)", marginBottom: "1.5rem" }}>{product.tagline}</p>

          <div className="gold-line" style={{ marginBottom: "1.5rem" }} />

          <p style={{ color: "var(--text-muted)", lineHeight: 1.9, marginBottom: "2rem" }}>{product.description}</p>

          {/* Variant selector */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>Select Size</p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {product.variants.map((v) => (
                <button
                  key={v.size}
                  onClick={() => { if (v.status !== "out_of_stock") setActiveVariant(v); }}
                  disabled={v.status === "out_of_stock"}
                  style={{
                    padding: "0.6rem 1.25rem",
                    border: `1px solid ${activeVariant.size === v.size ? "var(--gold)" : "var(--border)"}`,
                    background: activeVariant.size === v.size ? "var(--gold)" : "transparent",
                    color: activeVariant.size === v.size ? "var(--bg)" : v.status === "out_of_stock" ? "var(--text-muted)" : "var(--text)",
                    opacity: v.status === "out_of_stock" ? 0.4 : 1,
                    cursor: v.status === "out_of_stock" ? "not-allowed" : "pointer",
                    transition: "all 0.3s",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {v.size}
                  {v.status === "limited" && <span style={{ fontSize: "0.55rem", marginLeft: "0.3rem", color: "#e8a020" }}> Limited</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: "2rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", color: "var(--text)" }}>
              {currencySymbol}{activeVariant.price}
            </span>
            {activeVariant.status === "limited" && (
              <span style={{ marginLeft: "0.75rem", fontSize: "0.7rem", color: "#e8a020", letterSpacing: "0.1em", textTransform: "uppercase" }}>Limited Stock</span>
            )}
          </div>

          {/* Qty */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "0.6rem 1rem", background: "none", color: "var(--text)", border: "none", cursor: "pointer", fontSize: "1.1rem", fontFamily: "var(--font-body)" }}>−</button>
              <span style={{ padding: "0.6rem 1rem", minWidth: "40px", textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ padding: "0.6rem 1rem", background: "none", color: "var(--text)", border: "none", cursor: "pointer", fontSize: "1.1rem", fontFamily: "var(--font-body)" }}>+</button>
            </div>
            <button className="btn-gold" onClick={addToCart} disabled={activeVariant.status === "out_of_stock"} style={{ flex: 1 }}>
              {added ? "✓ Added" : "Add to Cart"}
            </button>
          </div>

          {/* WhatsApp Order Button */}
          {hasWhatsapp && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
              style={{ marginBottom: "1.5rem", display: "flex" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </a>
          )}

          {/* Fragrance Notes */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem" }}>Fragrance Notes</p>
            {([["Top Notes", product.notes.top], ["Heart Notes", product.notes.heart], ["Base Notes", product.notes.base]] as [string, string[]][]).map(([label, notes]) => (
              <div key={label} style={{ marginBottom: "0.75rem" }}>
                <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.35rem" }}>{label}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {notes.map((note) => <span key={note} className="tag">{note}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
