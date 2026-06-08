"use client";

// ============================================================
// HEADER — Dynamic logo, site name, cart icon
// ============================================================

import Link from "next/link";
import { useState, useEffect } from "react";
import { SiteSettings } from "@/types";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/lib/cart";

interface Props {
  settings: SiteSettings;
}

export default function Header({ settings }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--color-header-bg)] backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo / Site Name */}
          <Link href="/" className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="font-display text-2xl text-[var(--color-accent)] tracking-[0.15em]">
                {settings.siteName}
              </span>
            )}
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "الرئيسية" },
              { href: "/#products", label: "المجموعة" },
              { href: "/#about", label: "عن العلامة" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm tracking-wide transition-colors font-arabic"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:text-[var(--color-accent)] transition-colors"
            aria-label="سلة التسوق"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        currency={settings.currencySymbol}
      />
    </>
  );
}
