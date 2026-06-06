"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { CartItem } from "@/types";

function buildWhatsappCartUrl(cart: CartItem[]): string | null {
  if (typeof window === "undefined") return null;
  const items = cart.map((i) => `• ${i.productName} (${i.size}) x${i.quantity} = $${i.price * i.quantity}`).join("\n");
  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const msg = `Hello! I'd like to place the following order:\n\n${items}\n\n*Total: $${total}*`;
  return msg;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappMsg, setWhatsappMsg] = useState("Hello! I'd like to order:");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("luxe-cart") ?? "[]"));
    // Fetch whatsapp number from settings
    fetch("/api/gist")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings?.whatsapp) setWhatsapp(data.settings.whatsapp.replace(/\D/g, ""));
        if (data.settings?.whatsappMessage) setWhatsappMsg(data.settings.whatsappMessage);
      })
      .catch(() => {});
  }, []);

  const update = (idx: number, qty: number) => {
    const updated = [...cart];
    if (qty <= 0) updated.splice(idx, 1); else updated[idx].quantity = qty;
    setCart(updated);
    localStorage.setItem("luxe-cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleWhatsappOrder = () => {
    if (!whatsapp) return alert("WhatsApp number is not configured.");
    const msg = buildWhatsappCartUrl(cart);
    if (!msg) return;
    const fullMsg = `${whatsappMsg}\n\n${msg}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(fullMsg)}`, "_blank");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "7rem 2rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/products" style={{ color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.15em", textDecoration: "none", textTransform: "uppercase" }}>← Continue Shopping</Link>
      </div>
      <h1 className="display" style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Your Cart</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "1rem" }}>Your cart is empty</p>
          <Link href="/products" className="btn-gold">Explore Collection</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "3rem", alignItems: "start" }}>
          <div>
            {cart.map((item, idx) => (
              <div key={`${item.productId}-${item.size}`} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "1.25rem", padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: "80px", height: "100px", background: "var(--primary)", overflow: "hidden" }}>
                  {item.image && <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>{item.productName}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "0.75rem" }}>{item.size}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
                      <button onClick={() => update(idx, item.quantity - 1)} style={{ padding: "0.3rem 0.75rem", background: "none", color: "var(--text)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>−</button>
                      <span style={{ padding: "0 0.75rem" }}>{item.quantity}</span>
                      <button onClick={() => update(idx, item.quantity + 1)} style={{ padding: "0.3rem 0.75rem", background: "none", color: "var(--text)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>+</button>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>${item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "1.5rem", position: "sticky", top: "5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.5rem" }}>Order Summary</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="gold-line" style={{ margin: "1rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>${total}</span>
            </div>

            {/* WhatsApp Order */}
            <button className="whatsapp-btn" onClick={handleWhatsappOrder} style={{ marginBottom: "0.75rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </button>

            {!whatsapp && (
              <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center" }}>WhatsApp not configured yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
