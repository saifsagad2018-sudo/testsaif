"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { SiteSettings, CartItem } from "@/types";

export default function Header({ settings }: { settings: SiteSettings }) {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const cart: CartItem[] = JSON.parse(localStorage.getItem("luxe-cart") ?? "[]");
      setCartCount(cart.reduce((acc, i) => acc + i.quantity, 0));
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cart-updated", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all 0.4s ease",
      background: scrolled ? "rgba(10,8,6,0.96)" : "transparent",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      padding: "1.25rem 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt={settings.siteName} style={{ height: "36px", objectFit: "contain" }} />
        ) : (
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 400, letterSpacing: "0.2em", color: "var(--text)" }}>
            {settings.siteName}
          </span>
        )}
      </Link>

      <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {[{ label: "Collection", href: "/products" }, { label: "About", href: "/about" }].map(({ label, href }) => (
          <Link key={label} href={href} style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none" }}>
            {label}
          </Link>
        ))}
        <Link href="/cart" style={{ position: "relative", color: "var(--text)", textDecoration: "none", fontSize: "1.1rem" }}>
          ◻
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: "-6px", right: "-8px",
              width: "16px", height: "16px", background: "var(--gold)", color: "var(--bg)",
              borderRadius: "50%", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600,
            }}>
              {cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
