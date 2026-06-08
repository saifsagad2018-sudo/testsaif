// ============================================================
// HOMEPAGE — Hero + Featured Products + Categories
// ============================================================

import { fetchGistData } from "@/lib/gist";
import Header from "@/components/store/Header";
import Hero from "@/components/store/Hero";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import CategoryFilter from "@/components/store/CategoryFilter";
import Footer from "@/components/store/Footer";

export const revalidate = 30;

export default async function HomePage() {
  const data = await fetchGistData();
  const { settings, products, categories } = data;
  const featured = products.filter((p) => p.featured);

  return (
    <main>
      <Header settings={settings} />
      <Hero settings={settings} />

      {/* ── Categories ─────────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[var(--color-accent)] text-xs tracking-[0.3em] uppercase mb-3 font-arabic">
            تصفح حسب العائلة العطرية
          </p>
          <h2 className="font-display text-4xl text-[var(--color-text)]">
            مجموعاتنا
          </h2>
          <div className="divider-accent" />
        </div>
        <CategoryFilter categories={categories} />
      </section>

      {/* ── Featured Products ──────────────────────────── */}
      <section className="py-16 px-6 bg-[var(--color-surface-alt)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[var(--color-accent)] text-xs tracking-[0.3em] uppercase mb-3 font-arabic">
              الأكثر طلباً
            </p>
            <h2 className="font-display text-4xl text-[var(--color-text)]">
              العطور المميزة
            </h2>
            <div className="divider-accent" />
          </div>
          <FeaturedProducts
            products={featured}
            currency={settings.currencySymbol}
          />
        </div>
      </section>

      {/* ── All Products ───────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[var(--color-accent)] text-xs tracking-[0.3em] uppercase mb-3 font-arabic">
            استكشف المجموعة
          </p>
          <h2 className="font-display text-4xl text-[var(--color-text)]">
            جميع العطور
          </h2>
          <div className="divider-accent" />
        </div>
        <FeaturedProducts
          products={products}
          categories={categories}
          currency={settings.currencySymbol}
          showFilters
        />
      </section>

      <Footer settings={settings} />
    </main>
  );
}
