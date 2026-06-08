"use client";

// ============================================================
// HERO — Full-screen cinematic hero section
// ============================================================

import Link from "next/link";
import { SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings;
}

export default function Hero({ settings }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      {settings.heroImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${settings.heroImage})` }}
        />
      ) : (
        <div className="absolute inset-0">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-[var(--color-bg)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-10"
               style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} />
          <div className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full opacity-5"
               style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--color-bg)] opacity-60" />

      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-8 w-px h-32 bg-[var(--color-accent)] opacity-30" />
        <div className="absolute bottom-1/4 right-8 w-px h-32 bg-[var(--color-accent)] opacity-30" />
        <div className="absolute top-8 left-1/4 h-px w-32 bg-[var(--color-accent)] opacity-30" />
        <div className="absolute bottom-8 right-1/4 h-px w-32 bg-[var(--color-accent)] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[var(--color-accent)] text-xs tracking-[0.5em] uppercase mb-6 opacity-0 animate-fadeUp animate-stagger-1 font-arabic">
          ✦ العطور الفاخرة ✦
        </p>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[var(--color-text)] leading-tight mb-6 opacity-0 animate-fadeUp animate-stagger-2">
          {settings.heroTitle}
        </h1>

        <div className="divider-accent opacity-0 animate-fadeUp animate-stagger-2" />

        <p className="text-[var(--color-text-muted)] text-lg md:text-xl font-arabic font-light leading-relaxed mb-12 max-w-2xl mx-auto opacity-0 animate-fadeUp animate-stagger-3">
          {settings.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fadeUp"
             style={{ animationDelay: "0.4s" }}>
          <Link href="/#products" className="btn-luxury-fill font-arabic">
            استكشف المجموعة
          </Link>
          <Link href="/#about" className="btn-luxury font-arabic">
            عن العلامة التجارية
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs tracking-widest text-[var(--color-text-muted)] font-arabic">تمرير</span>
          <div className="w-px h-8 bg-[var(--color-accent)] animate-pulse" />
        </div>
      </div>
    </section>
  );
}
