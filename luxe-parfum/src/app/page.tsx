import { fetchGistData } from "@/lib/gist";
import Header from "@/components/store/Header";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchGistData();
  const { settings, products, categories } = data;
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header settings={settings} />

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8rem 2rem 4rem", position: "relative", overflow: "hidden" }}>
        {settings.heroImage && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${settings.heroImage})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
        )}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="animate-fade-up" style={{ position: "relative" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "2rem" }}>◆ Maison de Parfum ◆</p>
          <h1 className="display" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1.05, color: "var(--text)", marginBottom: "1.5rem", maxWidth: "900px" }}>
            {settings.heroTitle}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 3rem", lineHeight: 1.8 }}>
            {settings.heroSubtitle}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn-gold">Explore Collection</Link>
            <Link href="/products" className="btn-outline">Our Story</Link>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", color: "var(--text-muted)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span>Scroll</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
        </div>
      </section>

      {/* Announcement */}
      {settings.announcement && (
        <div style={{ background: "var(--gold)", color: "var(--bg)", textAlign: "center", padding: "0.6rem", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
          {settings.announcement}
        </div>
      )}

      {/* Categories */}
      <section style={{ padding: "5rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="gold-line" style={{ marginBottom: "3rem" }}>Our Families</div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "1.25rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", minWidth: "120px", cursor: "pointer" }}>
                <span style={{ fontSize: "1.5rem", color: "var(--gold)" }}>{cat.icon}</span>
                <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: "2rem 2rem 6rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="gold-line" style={{ marginBottom: "3rem" }}>Featured Scents</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {featured.map((product, i) => (
            <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/products" className="btn-outline">View Full Collection →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "3rem 2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--text)", marginBottom: "0.5rem" }}>{settings.siteName}</p>
        {settings.instagram && (
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>@{settings.instagram}</p>
        )}
        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          © {new Date().getFullYear()} · All rights reserved
        </p>
      </footer>
    </div>
  );
}
