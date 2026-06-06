import { useState, useEffect, useCallback, useRef } from "react";

// ─── TYPE DEFINITIONS (TypeScript-style JSDoc) ───────────────────────────────
/**
 * @typedef {Object} FragranceNote
 * @property {string[]} top
 * @property {string[]} heart
 * @property {string[]} base
 */

/**
 * @typedef {Object} ProductVariant
 * @property {string} id
 * @property {number} volume_ml
 * @property {string} concentration - "Extrait de Parfum" | "Eau de Parfum" | "Eau de Toilette"
 * @property {number} price
 * @property {number} stock
 * @property {'in_stock'|'low_stock'|'out_of_stock'} status
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} collection
 * @property {string} description
 * @property {string} image
 * @property {string} family
 * @property {ProductVariant[]} variants
 * @property {FragranceNote} notes
 * @property {boolean} featured
 */

/**
 * @typedef {Object} SiteConfig
 * @property {{primary: string, secondary: string, background: string, text: string, accent: string}} colors
 * @property {{heading: string, body: string}} fonts
 * @property {string} logo_text
 * @property {string} logo_url
 * @property {string} tagline
 * @property {string[]} nav_links
 * @property {{title: string, subtitle: string}} hero
 */

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  colors: {
    primary: "#1a1208",
    secondary: "#c9a96e",
    background: "#faf8f5",
    text: "#1a1208",
    accent: "#8b6914",
    surface: "#f0ebe2",
  },
  fonts: { heading: "Cormorant Garamond", body: "Jost" },
  logo_text: "MAISON LUMIÈRE",
  logo_url: "",
  tagline: "Parfumeur de Prestige depuis 1924",
  hero: {
    title: "L'Art de la Séduction",
    subtitle: "Rare ingredients. Timeless compositions. Uncompromising luxury.",
  },
};

const INITIAL_CATEGORIES = [
  { id: "oriental", name: "Oriental", description: "Warm, exotic, sensual" },
  { id: "woody", name: "Woody", description: "Deep forest, cedar, sandalwood" },
  { id: "citrus", name: "Citrus", description: "Fresh, bright, invigorating" },
  { id: "oud", name: "Oud", description: "Rare resinous, precious wood" },
  { id: "floral", name: "Floral", description: "Blooming gardens, delicate petals" },
];

const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Nuit d'Or",
    collection: "Heritage",
    description:
      "An opulent nocturnal composition where golden amber meets rare oud. The opening bursts with Calabrian bergamot before surrendering to a warm, resinous heart of Bulgarian rose absolute and aged Indian oud. The drydown lingers for hours — a luminous trail of vanilla-kissed sandalwood.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
    family: "oud",
    variants: [
      { id: "p1-30", volume_ml: 30, concentration: "Extrait de Parfum", price: 285, stock: 12, status: "in_stock" },
      { id: "p1-50", volume_ml: 50, concentration: "Extrait de Parfum", price: 420, stock: 5, status: "low_stock" },
      { id: "p1-100", volume_ml: 100, concentration: "Extrait de Parfum", price: 680, stock: 0, status: "out_of_stock" },
    ],
    notes: {
      top: ["Calabrian Bergamot", "Pink Pepper", "Cardamom"],
      heart: ["Bulgarian Rose Absolute", "Indian Oud", "Jasmine Sambac"],
      base: ["Madagascar Vanilla", "Sandalwood", "Ambergris"],
    },
    featured: true,
  },
  {
    id: "p2",
    name: "Rosée du Matin",
    collection: "Jardins",
    description:
      "Captured at the precise moment when dawn dew clings to petals in the Grasse countryside. A masterpiece of transparency — dewy green aldehydes, the freshness of lily-of-the-valley, and the warmth of white musks create an ethereal, skin-like fragrance.",
    image: "https://images.unsplash.com/photo-1588776814546-ec7e1d8ade0a?w=600&q=80",
    family: "floral",
    variants: [
      { id: "p2-30", volume_ml: 30, concentration: "Eau de Parfum", price: 195, stock: 20, status: "in_stock" },
      { id: "p2-50", volume_ml: 50, concentration: "Eau de Parfum", price: 295, stock: 8, status: "low_stock" },
      { id: "p2-100", volume_ml: 100, concentration: "Eau de Parfum", price: 450, stock: 15, status: "in_stock" },
    ],
    notes: {
      top: ["Green Aldehydes", "Bergamot", "Peach Sorbet"],
      heart: ["Lily of the Valley", "Grasse Rose", "Peony"],
      base: ["White Musk", "Cashmeran", "Ambrette"],
    },
    featured: true,
  },
  {
    id: "p3",
    name: "Cèdre Impérial",
    collection: "Boisé",
    description:
      "An architectural woody fragrance inspired by ancient cedar forests at dusk. Virginia cedarwood forms the spine while smoky vetiver and dark patchouli add earthen depth. A touch of frankincense elevates it into something sacred, ceremonial.",
    image: "https://images.unsplash.com/photo-1566977776052-6e61e35bf9be?w=600&q=80",
    family: "woody",
    variants: [
      { id: "p3-30", volume_ml: 30, concentration: "Eau de Parfum", price: 220, stock: 18, status: "in_stock" },
      { id: "p3-50", volume_ml: 50, concentration: "Eau de Parfum", price: 330, stock: 3, status: "low_stock" },
      { id: "p3-100", volume_ml: 100, concentration: "Eau de Parfum", price: 510, stock: 22, status: "in_stock" },
    ],
    notes: {
      top: ["Pink Grapefruit", "Elemi", "Black Pepper"],
      heart: ["Virginia Cedarwood", "Frankincense", "Orris"],
      base: ["Haitian Vetiver", "Dark Patchouli", "Labdanum"],
    },
    featured: false,
  },
  {
    id: "p4",
    name: "Ambre Solaire",
    collection: "Heritage",
    description:
      "The warmth of Mediterranean sun crystallized in golden amber. This sumptuous oriental unfolds with honeyed labdanum, cinnamon bark, and benzoin resin — a fragrance that evokes sunlit marble and languid afternoons.",
    image: "https://images.unsplash.com/photo-1547887538-047f814d0d9a?w=600&q=80",
    family: "oriental",
    variants: [
      { id: "p4-30", volume_ml: 30, concentration: "Extrait de Parfum", price: 260, stock: 14, status: "in_stock" },
      { id: "p4-50", volume_ml: 50, concentration: "Extrait de Parfum", price: 390, stock: 0, status: "out_of_stock" },
      { id: "p4-100", volume_ml: 100, concentration: "Extrait de Parfum", price: 620, stock: 9, status: "in_stock" },
    ],
    notes: {
      top: ["Mandarin Zest", "Cinnamon Bark", "Clove Bud"],
      heart: ["Labdanum Absolute", "Benzoin Resin", "Heliotrope"],
      base: ["Tonka Bean", "Vanilla Planifolia", "Castoreum"],
    },
    featured: true,
  },
  {
    id: "p5",
    name: "Agrumes Précieux",
    collection: "Lumière",
    description:
      "A luminous citrus symphony composed with the rarest ingredients: hand-pressed Amalfi lemon zest, Sicilian bergamot bigarade, and yuzu from Japanese mountain orchards. Effortlessly sophisticated, impossibly fresh.",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
    family: "citrus",
    variants: [
      { id: "p5-30", volume_ml: 30, concentration: "Eau de Parfum", price: 175, stock: 30, status: "in_stock" },
      { id: "p5-50", volume_ml: 50, concentration: "Eau de Parfum", price: 265, stock: 24, status: "in_stock" },
      { id: "p5-100", volume_ml: 100, concentration: "Eau de Parfum", price: 395, stock: 11, status: "in_stock" },
    ],
    notes: {
      top: ["Amalfi Lemon", "Yuzu", "Sicilian Bergamot Bigarade"],
      heart: ["Neroli", "Petitgrain", "White Tea"],
      base: ["Ambrette Seed", "White Cedar", "Musk"],
    },
    featured: false,
  },
];

// ─── CART UTILS ────────────────────────────────────────────────────────────────
function useCart() {
  const [items, setItems] = useState([]);
  const addItem = (product, variant) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variant.id);
      if (existing) return prev.map((i) => i.variantId === variant.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: product.id, variantId: variant.id, name: product.name, volume: variant.volume_ml, concentration: variant.concentration, price: variant.price, qty: 1, image: product.image }];
    });
  };
  const removeItem = (variantId) => setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  const updateQty = (variantId, qty) => {
    if (qty < 1) return removeItem(variantId);
    setItems((prev) => prev.map((i) => i.variantId === variantId ? { ...i, qty } : i));
  };
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return { items, addItem, removeItem, updateQty, total, count };
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = { in_stock: ["#166534", "#dcfce7", "In Stock"], low_stock: ["#854d0e", "#fef9c3", "Low Stock"], out_of_stock: ["#991b1b", "#fee2e2", "Out of Stock"] };
  const [color, bg, label] = map[status] || map.in_stock;
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>;
};

// ─── STOREFRONT ──────────────────────────────────────────────────────────────
function Storefront({ config, products, categories, cart, onAddToCart, onViewProduct }) {
  const [activeFamily, setActiveFamily] = useState("all");
  const [priceRange, setPriceRange] = useState(1000);
  const [activeSize, setActiveSize] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const c = config.colors;
  const fonts = config.fonts;

  const filtered = products.filter((p) => {
    const familyOk = activeFamily === "all" || p.family === activeFamily;
    const sizeOk = activeSize === "all" || p.variants.some((v) => v.volume_ml === parseInt(activeSize));
    const minPrice = Math.min(...p.variants.map((v) => v.price));
    const priceOk = minPrice <= priceRange;
    return familyOk && sizeOk && priceOk;
  });

  const featured = products.filter((p) => p.featured);

  return (
    <div style={{ fontFamily: fonts.body, background: c.background, color: c.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-gold { background: ${c.secondary}; color: ${c.primary}; border: none; padding: 12px 28px; font-family: ${fonts.body}; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .btn-gold:hover { background: ${c.accent}; color: #fff; }
        .btn-outline { background: transparent; color: ${c.secondary}; border: 1px solid ${c.secondary}; padding: 10px 24px; font-family: ${fonts.body}; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .btn-outline:hover { background: ${c.secondary}; color: ${c.primary}; }
        .filter-btn { background: transparent; border: 1px solid #d4c5a9; padding: 6px 16px; font-size: 12px; letter-spacing: 0.08em; cursor: pointer; transition: all 0.2s; font-family: ${fonts.body}; color: ${c.text}; }
        .filter-btn.active { background: ${c.secondary}; color: ${c.primary}; border-color: ${c.secondary}; }
        .product-card { background: #fff; border: 1px solid #e8ddd0; transition: all 0.3s; cursor: pointer; overflow: hidden; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(26,18,8,0.12); }
        .nav-link { color: ${c.text}; text-decoration: none; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: ${c.secondary}; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e8ddd0", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Maison", "Collections", "Boutique", "Atelier"].map((l) => (
            <span key={l} className="nav-link">{l}</span>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          {config.logo_url ? <img src={config.logo_url} style={{ height: 36 }} alt="logo" /> : (
            <div style={{ fontFamily: fonts.heading, fontSize: 22, letterSpacing: "0.25em", fontWeight: 400, color: c.primary, lineHeight: 1 }}>
              {config.logo_text}
              <div style={{ fontSize: 9, letterSpacing: "0.3em", color: c.accent, fontFamily: fonts.body, fontWeight: 500, marginTop: 2 }}>{config.tagline}</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span className="nav-link">Account</span>
          <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.text} strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cart.count > 0 && <span style={{ position: "absolute", top: -2, right: -2, background: c.secondary, color: c.primary, borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{cart.count}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: c.primary, color: "#f5f0e8", padding: "120px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", minHeight: 520 }}>
        <div>
          <div style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: c.secondary, marginBottom: 20 }}>Collection Exclusive 2024</div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 72, fontWeight: 300, lineHeight: 1.05, marginBottom: 24, fontStyle: "italic" }}>{config.hero.title}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#c8b99a", maxWidth: 420, marginBottom: 36 }}>{config.hero.subtitle}</p>
          <div style={{ display: "flex", gap: 16 }}>
            <button className="btn-gold">Discover the Collection</button>
            <button className="btn-outline" style={{ color: "#c8b99a", borderColor: "#c8b99a" }}>Our Maison</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, height: 400 }}>
          {featured.slice(0, 4).map((p, i) => (
            <div key={p.id} onClick={() => onViewProduct(p)} style={{ overflow: "hidden", cursor: "pointer", position: "relative" }}>
              <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)", transition: "transform 0.6s" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"} />
              <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                <div style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 400, fontStyle: "italic", color: "#fff" }}>{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: c.secondary, padding: "10px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 48, animation: "none", whiteSpace: "nowrap", fontFamily: fonts.body, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: c.primary, justifyContent: "center" }}>
          {["Free Worldwide Shipping on Orders Over €250", "·", "Complimentary Gift Wrapping", "·", "Exclusive Members Rewards", "·", "Pure Ingredients, No Compromise"].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* CATALOG */}
      <section style={{ padding: "80px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: c.accent, marginBottom: 12 }}>Our Creations</div>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 48, fontWeight: 300, fontStyle: "italic", color: c.primary }}>The Collection</h2>
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32, alignItems: "center" }}>
          <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: c.accent, marginRight: 8 }}>Family:</span>
          <button className={`filter-btn ${activeFamily === "all" ? "active" : ""}`} onClick={() => setActiveFamily("all")}>All</button>
          {categories.map((cat) => (
            <button key={cat.id} className={`filter-btn ${activeFamily === cat.id ? "active" : ""}`} onClick={() => setActiveFamily(cat.id)}>{cat.name}</button>
          ))}
          <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: c.accent, marginLeft: 16, marginRight: 8 }}>Size:</span>
          {["all", "30", "50", "100"].map((s) => (
            <button key={s} className={`filter-btn ${activeSize === s ? "active" : ""}`} onClick={() => setActiveSize(s)}>{s === "all" ? "All" : `${s}ml`}</button>
          ))}
          <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: c.accent, marginLeft: 16, marginRight: 8 }}>Max: €{priceRange}</span>
          <input type="range" min="100" max="1000" step="50" value={priceRange} onChange={e => setPriceRange(+e.target.value)} style={{ width: 120 }} />
        </div>

        {/* GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} config={config} onView={() => onViewProduct(product)} onAddToCart={onAddToCart} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, color: c.accent, fontFamily: fonts.heading, fontSize: 22, fontStyle: "italic" }}>No fragrances match your selection.</div>
        )}
      </section>

      {/* ATELIER SECTION */}
      <section style={{ background: c.primary, color: "#f5f0e8", padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: c.secondary, marginBottom: 16 }}>Le Savoir-Faire</div>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 48, fontWeight: 300, fontStyle: "italic", marginBottom: 24 }}>The Art of<br />Perfumery</h2>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "#c8b99a", marginBottom: 32 }}>Each Maison Lumière fragrance is the result of years of research, sourcing the world's finest raw materials — from Bulgarian rose fields to Indonesian oud plantations — to create compositions of enduring beauty.</p>
          <button className="btn-outline" style={{ color: "#c8b99a", borderColor: "#c8b99a" }}>Discover Our Process</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[["100+", "Rare Ingredients"], ["12", "Master Perfumers"], ["1924", "Founded"], ["50+", "Countries Served"]].map(([num, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 16, borderBottom: "1px solid rgba(201,169,110,0.2)", paddingBottom: 20 }}>
              <span style={{ fontFamily: fonts.heading, fontSize: 42, fontWeight: 300, color: c.secondary }}>{num}</span>
              <span style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c8b99a" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d0b06", color: "#8b7355", padding: "60px 48px 32px", borderTop: "1px solid #2a2418" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: fonts.heading, fontSize: 24, letterSpacing: "0.2em", color: "#f5f0e8", marginBottom: 12 }}>{config.logo_text}</div>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>Haute parfumerie crafted with the world's most precious ingredients. A century of olfactory excellence.</p>
          </div>
          {[["Collections", ["Heritage", "Jardins", "Boisé", "Lumière"]], ["Maison", ["Our Story", "Atelier", "Ingredients", "Press"]], ["Service", ["Shipping", "Returns", "Gift Wrapping", "Contact"]]].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: c.secondary, marginBottom: 16 }}>{title}</div>
              {links.map(l => <div key={l} style={{ fontSize: 13, marginBottom: 8, cursor: "pointer", transition: "color 0.2s" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #2a2418", paddingTop: 24, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span>© 2024 Maison Lumière. All rights reserved.</span>
          <span>Crafted with precision & passion</span>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && <CartDrawer cart={cart} config={config} onClose={() => setCartOpen(false)} />}
    </div>
  );
}

function ProductCard({ product, config, onView, onAddToCart }) {
  const c = config.colors;
  const fonts = config.fonts;
  const defaultVariant = product.variants.find(v => v.status !== "out_of_stock") || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  return (
    <div className="product-card" style={{ position: "relative" }}>
      <div onClick={onView} style={{ overflow: "hidden", height: 320, cursor: "pointer" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"} />
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <StatusBadge status={selectedVariant.status} />
        </div>
        <div style={{ position: "absolute", top: 16, right: 16, background: c.secondary, color: c.primary, fontSize: 10, fontWeight: 600, padding: "3px 8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {product.collection}
        </div>
      </div>
      <div style={{ padding: "20px 20px 24px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: c.accent, marginBottom: 4 }}>{product.family}</div>
        <h3 onClick={onView} style={{ fontFamily: fonts.heading, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: c.primary, cursor: "pointer", marginBottom: 8 }}>{product.name}</h3>
        <p style={{ fontSize: 12, lineHeight: 1.7, color: "#6b5c47", marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {product.variants.map((v) => (
            <button key={v.id} onClick={() => setSelectedVariant(v)} disabled={v.status === "out_of_stock"}
              style={{ border: `1px solid ${selectedVariant.id === v.id ? c.secondary : "#d4c5a9"}`, background: selectedVariant.id === v.id ? c.secondary : "transparent", color: v.status === "out_of_stock" ? "#c0b09a" : c.primary, padding: "4px 10px", fontSize: 11, cursor: v.status === "out_of_stock" ? "not-allowed" : "pointer", fontFamily: fonts.body, opacity: v.status === "out_of_stock" ? 0.5 : 1 }}>
              {v.volume_ml}ml
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: fonts.heading, fontSize: 24, fontWeight: 400, color: c.primary }}>€{selectedVariant.price}</div>
            <div style={{ fontSize: 11, color: c.accent }}>{selectedVariant.concentration}</div>
          </div>
          <button className="btn-gold" onClick={() => onAddToCart(product, selectedVariant)} disabled={selectedVariant.status === "out_of_stock"}
            style={{ padding: "10px 20px", fontSize: 11, opacity: selectedVariant.status === "out_of_stock" ? 0.4 : 1, cursor: selectedVariant.status === "out_of_stock" ? "not-allowed" : "pointer" }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, config, onClose }) {
  const c = config.colors;
  const fonts = config.fonts;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 420, background: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 32px", borderBottom: "1px solid #e8ddd0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 24, fontStyle: "italic", fontWeight: 400 }}>Your Selection</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: c.accent, fontFamily: fonts.heading, fontStyle: "italic", fontSize: 18 }}>Your cart is empty</div>
          ) : cart.items.map((item) => (
            <div key={item.variantId} style={{ display: "flex", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e8ddd0" }}>
              <img src={item.image} alt={item.name} style={{ width: 72, height: 88, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.heading, fontSize: 18, fontStyle: "italic", marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: c.accent, marginBottom: 8 }}>{item.volume}ml · {item.concentration}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #d4c5a9", padding: "2px 8px" }}>
                    <button onClick={() => cart.updateQty(item.variantId, item.qty - 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: c.accent }}>−</button>
                    <span style={{ fontSize: 13, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => cart.updateQty(item.variantId, item.qty + 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: c.accent }}>+</button>
                  </div>
                  <span style={{ fontFamily: fonts.heading, fontSize: 18 }}>€{(item.price * item.qty).toFixed(0)}</span>
                </div>
              </div>
              <button onClick={() => cart.removeItem(item.variantId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0b09a", alignSelf: "start", fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
        {cart.items.length > 0 && (
          <div style={{ padding: "24px 32px", borderTop: "1px solid #e8ddd0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: c.accent }}>Subtotal</span>
              <span style={{ fontFamily: fonts.heading, fontSize: 20 }}>€{cart.total.toFixed(0)}</span>
            </div>
            <div style={{ fontSize: 12, color: "#c0b09a", marginBottom: 20 }}>Shipping calculated at checkout · Free over €250</div>
            <button className="btn-gold" style={{ width: "100%", padding: "16px", fontSize: 13 }}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
function ProductDetail({ product, config, cart, onBack, onAddToCart }) {
  const c = config.colors;
  const fonts = config.fonts;
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [activeTab, setActiveTab] = useState("notes");

  return (
    <div style={{ fontFamily: fonts.body, background: c.background, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap'); * { box-sizing:border-box; margin:0; padding:0; }`}</style>

      {/* BREADCRUMB */}
      <div style={{ padding: "20px 64px", borderBottom: "1px solid #e8ddd0", background: "#fff" }}>
        <span onClick={onBack} style={{ fontSize: 12, letterSpacing: "0.1em", color: c.accent, cursor: "pointer", textTransform: "uppercase" }}>← Back to Collection</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 1200, margin: "0 auto" }}>
        {/* IMAGE */}
        <div style={{ position: "relative", background: c.surface }}>
          <img src={product.image} alt={product.name} style={{ width: "100%", height: 640, objectFit: "cover" }} />
          <div style={{ position: "absolute", top: 24, left: 24, background: c.secondary, color: c.primary, fontSize: 10, fontWeight: 600, padding: "4px 12px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{product.collection}</div>
        </div>

        {/* INFO */}
        <div style={{ padding: "64px 56px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: c.accent, marginBottom: 12 }}>{product.family} · {selectedVariant.concentration}</div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 56, fontWeight: 300, fontStyle: "italic", lineHeight: 1.1, color: c.primary, marginBottom: 24 }}>{product.name}</h1>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "#5a4c3a", marginBottom: 40 }}>{product.description}</p>

          {/* VARIANT SELECTOR */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: c.text, marginBottom: 12, fontWeight: 500 }}>Select Volume</div>
            <div style={{ display: "flex", gap: 12 }}>
              {product.variants.map((v) => (
                <button key={v.id} onClick={() => v.status !== "out_of_stock" && setSelectedVariant(v)} disabled={v.status === "out_of_stock"}
                  style={{ flex: 1, padding: "16px 8px", border: `1px solid ${selectedVariant.id === v.id ? c.secondary : "#d4c5a9"}`, background: selectedVariant.id === v.id ? c.secondary : "transparent", color: v.status === "out_of_stock" ? "#c0b09a" : c.primary, cursor: v.status === "out_of_stock" ? "not-allowed" : "pointer", fontFamily: fonts.body, opacity: v.status === "out_of_stock" ? 0.5 : 1, transition: "all 0.2s" }}>
                  <div style={{ fontSize: 18, fontFamily: fonts.heading, marginBottom: 4 }}>{v.volume_ml}ml</div>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em" }}>{v.status === "out_of_stock" ? "Sold Out" : `€${v.price}`}</div>
                </button>
              ))}
            </div>
          </div>

          {/* PRICE & CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: fonts.heading, fontSize: 36, fontWeight: 400, color: c.primary }}>€{selectedVariant.price}</div>
              <StatusBadge status={selectedVariant.status} />
            </div>
            <button onClick={() => onAddToCart(product, selectedVariant)} disabled={selectedVariant.status === "out_of_stock"}
              style={{ flex: 1, background: selectedVariant.status === "out_of_stock" ? "#c0b09a" : c.primary, color: "#f5f0e8", border: "none", padding: "18px", fontFamily: fonts.body, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", cursor: selectedVariant.status === "out_of_stock" ? "not-allowed" : "pointer", fontWeight: 500 }}>
              {selectedVariant.status === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {/* TABS */}
          <div style={{ borderTop: "1px solid #e8ddd0" }}>
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e8ddd0" }}>
              {["notes", "details"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: "14px 24px", background: "none", border: "none", borderBottom: activeTab === tab ? `2px solid ${c.secondary}` : "2px solid transparent", fontFamily: fonts.body, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: activeTab === tab ? c.primary : c.accent, cursor: "pointer", fontWeight: 500, marginBottom: -1 }}>
                  {tab === "notes" ? "Fragrance Notes" : "Details"}
                </button>
              ))}
            </div>
            <div style={{ paddingTop: 28 }}>
              {activeTab === "notes" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[["Top Notes", product.notes.top, "✦"], ["Heart Notes", product.notes.heart, "♡"], ["Base Notes", product.notes.base, "◉"]].map(([label, notes, sym]) => (
                    <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ width: 32, textAlign: "center", color: c.secondary, fontSize: 14, paddingTop: 2 }}>{sym}</div>
                      <div>
                        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: c.accent, marginBottom: 6 }}>{label}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {notes.map((n) => <span key={n} style={{ background: c.surface, padding: "4px 12px", fontSize: 12, color: c.text }}>{n}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13 }}>
                  {[["Concentration", selectedVariant.concentration], ["Volume", `${selectedVariant.volume_ml}ml`], ["Family", product.family], ["Collection", product.collection]].map(([k, v]) => (
                    <div key={k} style={{ borderBottom: "1px solid #e8ddd0", paddingBottom: 12 }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: c.accent, marginBottom: 4 }}>{k}</div>
                      <div style={{ textTransform: "capitalize" }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ config, setConfig, products, setProducts, categories, setCategories }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveConfig = (newConfig) => {
    setConfig(newConfig);
    notify("Settings saved successfully — changes are live on storefront");
  };

  const sections = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "branding", label: "Branding & Style", icon: "🎨" },
    { id: "products", label: "Product Catalog", icon: "📦" },
    { id: "categories", label: "Collections", icon: "📁" },
    { id: "inventory", label: "Inventory", icon: "📋" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Jost, sans-serif", background: "#f8f6f2", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap'); * { box-sizing:border-box; margin:0; padding:0; } input,textarea,select { font-family: Jost, sans-serif; font-size: 13px; }`}</style>

      {/* SIDEBAR */}
      <div style={{ width: 240, background: "#1a1208", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid #2a2418" }}>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, letterSpacing: "0.2em", color: "#f5f0e8", marginBottom: 2 }}>Maison Lumière</div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e" }}>Admin Console</div>
        </div>
        <nav style={{ flex: 1, padding: "16px 0" }}>
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", background: activeSection === s.id ? "rgba(201,169,110,0.15)" : "transparent", color: activeSection === s.id ? "#c9a96e" : "#8b7355", border: "none", borderLeft: `3px solid ${activeSection === s.id ? "#c9a96e" : "transparent"}`, cursor: "pointer", fontSize: 13, fontFamily: "Jost, sans-serif", textAlign: "left" }}>
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: "20px 24px", borderTop: "1px solid #2a2418", fontSize: 11, color: "#5a4c3a" }}>
          <div>Config stored via GitHub Gist</div>
          <div style={{ color: "#c9a96e", marginTop: 4, cursor: "pointer" }}>● Live · Syncing...</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TOPBAR */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e8ddd0", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: "#1a1208" }}>
            {sections.find(s => s.id === activeSection)?.label}
          </h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {notification && (
              <div style={{ background: notification.type === "success" ? "#dcfce7" : "#fee2e2", color: notification.type === "success" ? "#166534" : "#991b1b", padding: "6px 16px", borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                {notification.msg}
              </div>
            )}
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#c9a96e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#1a1208" }}>A</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          {activeSection === "overview" && <AdminOverview products={products} categories={categories} />}
          {activeSection === "branding" && <AdminBranding config={config} onSave={saveConfig} notify={notify} />}
          {activeSection === "products" && <AdminProducts products={products} setProducts={setProducts} categories={categories} notify={notify} />}
          {activeSection === "categories" && <AdminCategories categories={categories} setCategories={setCategories} notify={notify} />}
          {activeSection === "inventory" && <AdminInventory products={products} setProducts={setProducts} notify={notify} />}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "#c9a96e" }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: "20px 24px" }}>
      <div style={{ fontSize: 12, color: "#8b7355", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 400, color: "#1a1208", marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color }}>{sub}</div>}
    </div>
  );
}

function AdminOverview({ products, categories }) {
  const totalVariants = products.reduce((s, p) => s + p.variants.length, 0);
  const lowStock = products.reduce((s, p) => s + p.variants.filter(v => v.status === "low_stock").length, 0);
  const outOfStock = products.reduce((s, p) => s + p.variants.filter(v => v.status === "out_of_stock").length, 0);
  const totalStock = products.reduce((s, p) => s + p.variants.reduce((vs, v) => vs + v.stock, 0), 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Products" value={products.length} sub={`${totalVariants} variants`} />
        <StatCard label="Collections" value={categories.length} sub="Active" />
        <StatCard label="Units in Stock" value={totalStock} sub="Across all variants" />
        <StatCard label="Alerts" value={lowStock + outOfStock} sub={`${lowStock} low · ${outOfStock} out`} color="#dc2626" />
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20, color: "#1a1208" }}>Inventory Status</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8ddd0" }}>
              {["Product", "Collection", "Family", "Variants", "Min Stock", "Status"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8b7355", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const minStock = Math.min(...p.variants.map(v => v.stock));
              const worstStatus = p.variants.some(v => v.status === "out_of_stock") ? "out_of_stock" : p.variants.some(v => v.status === "low_stock") ? "low_stock" : "in_stock";
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #f0ebe2" }}>
                  <td style={{ padding: "12px 12px" }}><strong style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 15, fontStyle: "italic" }}>{p.name}</strong></td>
                  <td style={{ padding: "12px 12px", color: "#8b7355" }}>{p.collection}</td>
                  <td style={{ padding: "12px 12px", textTransform: "capitalize", color: "#8b7355" }}>{p.family}</td>
                  <td style={{ padding: "12px 12px" }}>{p.variants.length}</td>
                  <td style={{ padding: "12px 12px" }}>{minStock}</td>
                  <td style={{ padding: "12px 12px" }}><StatusBadge status={worstStatus} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminBranding({ config, onSave, notify }) {
  const [local, setLocal] = useState({ ...config });
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const updateColor = (key, val) => setLocal(prev => ({ ...prev, colors: { ...prev.colors, [key]: val } }));
  const updateFont = (key, val) => setLocal(prev => ({ ...prev, fonts: { ...prev.fonts, [key]: val } }));

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    // Simulate Cloudinary upload (in production: POST to Cloudinary API with CLOUDINARY_UPLOAD_PRESET)
    setTimeout(() => {
      const fakeUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload/${file.name}`;
      setLocal(prev => ({ ...prev, logo_url: fakeUrl }));
      setUploading(false);
      notify("Logo uploaded to Cloudinary successfully");
    }, 1500);
  };

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8b7355", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #d4c5a9", background: "#faf8f5", outline: "none", fontSize: 13, borderRadius: 4, color: "#1a1208" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* LOGO */}
      <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24, gridColumn: "span 2" }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20, color: "#1a1208" }}>Logo & Brand Identity</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <Field label="Brand Name (Text Logo)">
              <input style={inputStyle} value={local.logo_text} onChange={e => setLocal(prev => ({ ...prev, logo_text: e.target.value }))} />
            </Field>
            <Field label="Tagline">
              <input style={inputStyle} value={local.tagline} onChange={e => setLocal(prev => ({ ...prev, tagline: e.target.value }))} />
            </Field>
            <Field label="Hero Title">
              <input style={inputStyle} value={local.hero.title} onChange={e => setLocal(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} />
            </Field>
            <Field label="Hero Subtitle">
              <textarea style={{ ...inputStyle, height: 72, resize: "vertical" }} value={local.hero.subtitle} onChange={e => setLocal(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))} />
            </Field>
          </div>
          <div>
            <Field label="Logo Image (Upload to Cloudinary)">
              <div style={{ border: "2px dashed #d4c5a9", borderRadius: 4, padding: 24, textAlign: "center", cursor: "pointer", position: "relative" }}>
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                {uploading ? <div style={{ color: "#c9a96e" }}>Uploading to Cloudinary...</div> : local.logo_url ? (
                  <div>
                    <div style={{ fontSize: 12, color: "#166534", marginBottom: 8 }}>✓ Logo uploaded</div>
                    <div style={{ fontSize: 11, color: "#8b7355", wordBreak: "break-all" }}>{local.logo_url.slice(0, 50)}...</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 13, color: "#8b7355" }}>Click to upload logo</div>
                    <div style={{ fontSize: 11, color: "#c0b09a", marginTop: 4 }}>PNG, SVG · Stores in Cloudinary</div>
                  </div>
                )}
              </div>
            </Field>
            <div style={{ background: "#1a1208", padding: 24, borderRadius: 4, textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, letterSpacing: "0.2em", color: "#f5f0e8" }}>{local.logo_text}</div>
              <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#c9a96e", marginTop: 4 }}>{local.tagline}</div>
              <div style={{ fontSize: 10, color: "#5a4c3a", marginTop: 12 }}>Live preview</div>
            </div>
          </div>
        </div>
      </div>

      {/* COLORS */}
      <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20, color: "#1a1208" }}>Color Palette</h3>
        {[["primary", "Primary (Background/Text)"], ["secondary", "Gold Accent"], ["background", "Page Background"], ["text", "Text Color"], ["accent", "Subtle Accent"]].map(([key, label]) => (
          <Field key={key} label={label}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="color" value={local.colors[key]} onChange={e => updateColor(key, e.target.value)} style={{ width: 40, height: 36, border: "1px solid #d4c5a9", cursor: "pointer", padding: 2, borderRadius: 4 }} />
              <input style={{ ...inputStyle, flex: 1 }} value={local.colors[key]} onChange={e => updateColor(key, e.target.value)} />
            </div>
          </Field>
        ))}
      </div>

      {/* TYPOGRAPHY */}
      <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20, color: "#1a1208" }}>Typography</h3>
        {[["heading", "Heading Font (Google Fonts)"], ["body", "Body Font (Google Fonts)"]].map(([key, label]) => (
          <Field key={key} label={label}>
            <select style={inputStyle} value={local.fonts[key]} onChange={e => updateFont(key, e.target.value)}>
              {["Cormorant Garamond", "Playfair Display", "EB Garamond", "Libre Baskerville", "Sorts Mill Goudy"].map(f => <option key={f}>{f}</option>)}
            </select>
          </Field>
        ))}
        <div style={{ marginTop: 24, padding: 20, background: "#faf8f5", borderRadius: 4 }}>
          <div style={{ fontFamily: local.fonts.heading + ", serif", fontSize: 28, fontStyle: "italic", color: "#1a1208", marginBottom: 8 }}>The Art of Perfumery</div>
          <div style={{ fontFamily: local.fonts.body + ", sans-serif", fontSize: 13, color: "#5a4c3a", lineHeight: 1.7 }}>Preview your typography selection here. Choose fonts that reflect the luxury essence of your brand.</div>
        </div>
        <div style={{ marginTop: 20, padding: 12, background: "#fef9c3", borderRadius: 4, fontSize: 12, color: "#854d0e" }}>
          💡 Changes inject CSS variables into `:root` — live across the entire storefront
        </div>
      </div>

      <div style={{ gridColumn: "span 2", display: "flex", gap: 12 }}>
        <button onClick={() => onSave(local)} style={{ background: "#1a1208", color: "#f5f0e8", border: "none", padding: "14px 32px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Jost, sans-serif", fontWeight: 500, borderRadius: 4 }}>
          Save & Publish to Gist
        </button>
        <button onClick={() => setLocal({ ...config })} style={{ background: "transparent", color: "#8b7355", border: "1px solid #d4c5a9", padding: "14px 24px", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", fontFamily: "Jost, sans-serif", borderRadius: 4 }}>
          Discard Changes
        </button>
      </div>
    </div>
  );
}

function AdminProducts({ products, setProducts, categories, notify }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const emptyProduct = { id: `p${Date.now()}`, name: "", collection: "", description: "", image: "", family: categories[0]?.id || "", variants: [{ id: `v${Date.now()}`, volume_ml: 50, concentration: "Eau de Parfum", price: 0, stock: 0, status: "in_stock" }], notes: { top: [], heart: [], base: [] }, featured: false };
  const [form, setForm] = useState(emptyProduct);
  const [noteInputs, setNoteInputs] = useState({ top: "", heart: "", base: "" });
  const [imageUploading, setImageUploading] = useState(false);

  const openNew = () => { setForm({ ...emptyProduct, id: `p${Date.now()}` }); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); setShowForm(true); };
  const handleDelete = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); notify("Product deleted"); };

  const addVariant = () => setForm(prev => ({ ...prev, variants: [...prev.variants, { id: `v${Date.now()}`, volume_ml: 30, concentration: "Eau de Parfum", price: 0, stock: 0, status: "in_stock" }] }));
  const updateVariant = (id, field, val) => setForm(prev => ({ ...prev, variants: prev.variants.map(v => v.id === id ? { ...v, [field]: field === "price" || field === "stock" || field === "volume_ml" ? +val : val } : v) }));
  const removeVariant = (id) => setForm(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== id) }));
  const addNote = (type) => { if (!noteInputs[type].trim()) return; setForm(prev => ({ ...prev, notes: { ...prev.notes, [type]: [...prev.notes[type], noteInputs[type].trim()] } })); setNoteInputs(prev => ({ ...prev, [type]: "" })); };
  const removeNote = (type, idx) => setForm(prev => ({ ...prev, notes: { ...prev.notes, [type]: prev.notes[type].filter((_, i) => i !== idx) } }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    // Simulate Cloudinary upload
    setTimeout(() => {
      setForm(prev => ({ ...prev, image: `https://images.unsplash.com/photo-1541643600914-78b084683702?w=600` }));
      setImageUploading(false);
      notify("Image uploaded to Cloudinary");
    }, 1200);
  };

  const handleSave = () => {
    if (!form.name || !form.family) return notify("Name and family are required", "error");
    setProducts(prev => editing ? prev.map(p => p.id === editing ? form : p) : [...prev, form]);
    setShowForm(false);
    notify(editing ? "Product updated successfully" : "Product created successfully");
  };

  const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid #d4c5a9", background: "#faf8f5", fontSize: 13, borderRadius: 4, color: "#1a1208" };

  if (showForm) return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontStyle: "italic", fontWeight: 400 }}>{editing ? "Edit Fragrance" : "New Fragrance"}</h2>
        <button onClick={() => setShowForm(false)} style={{ background: "none", border: "1px solid #d4c5a9", padding: "8px 16px", cursor: "pointer", fontSize: 12, borderRadius: 4 }}>← Back</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* BASIC INFO */}
        <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Basic Information</h3>
          {[["Fragrance Name", "name", "text"], ["Collection", "collection", "text"]].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", marginBottom: 5 }}>{label}</label>
              <input type={type} style={inputStyle} value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", marginBottom: 5 }}>Olfactory Family</label>
            <select style={inputStyle} value={form.family} onChange={e => setForm(prev => ({ ...prev, family: e.target.value }))}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", marginBottom: 5 }}>Description</label>
            <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", marginBottom: 5 }}>Product Image (Cloudinary)</label>
            <div style={{ border: "2px dashed #d4c5a9", borderRadius: 4, padding: 16, textAlign: "center", position: "relative", cursor: "pointer" }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
              {imageUploading ? <div style={{ color: "#c9a96e" }}>Uploading...</div> : form.image ? <div style={{ fontSize: 12, color: "#166534" }}>✓ Image set</div> : <div style={{ fontSize: 12, color: "#8b7355" }}>Upload image → Cloudinary CDN</div>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))} />
            <label htmlFor="featured" style={{ fontSize: 13, color: "#1a1208" }}>Feature on homepage</label>
          </div>
        </div>

        {/* FRAGRANCE NOTES */}
        <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Fragrance Notes Architecture</h3>
          {["top", "heart", "base"].map(type => (
            <div key={type} style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", marginBottom: 8, textTransform: "capitalize" }}>{type} Notes</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="e.g. Bergamot" value={noteInputs[type]} onChange={e => setNoteInputs(prev => ({ ...prev, [type]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && addNote(type)} />
                <button onClick={() => addNote(type)} style={{ background: "#c9a96e", color: "#1a1208", border: "none", padding: "0 14px", cursor: "pointer", fontSize: 18, borderRadius: 4 }}>+</button>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {form.notes[type].map((n, i) => (
                  <span key={i} style={{ background: "#f0ebe2", padding: "3px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 6, borderRadius: 3 }}>
                    {n} <span onClick={() => removeNote(type, i)} style={{ cursor: "pointer", color: "#c9a96e", fontWeight: 700 }}>×</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* VARIANTS */}
        <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24, gridColumn: "span 2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500 }}>Volume Variants & Pricing</h3>
            <button onClick={addVariant} style={{ background: "#1a1208", color: "#f5f0e8", border: "none", padding: "8px 16px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>+ Add Variant</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {form.variants.map((v) => (
              <div key={v.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end", background: "#faf8f5", padding: 16, borderRadius: 4, border: "1px solid #e8ddd0" }}>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", display: "block", marginBottom: 5 }}>Volume (ml)</label>
                  <select style={inputStyle} value={v.volume_ml} onChange={e => updateVariant(v.id, "volume_ml", e.target.value)}>
                    {[10, 30, 50, 75, 100, 150, 200].map(ml => <option key={ml}>{ml}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", display: "block", marginBottom: 5 }}>Concentration</label>
                  <select style={inputStyle} value={v.concentration} onChange={e => updateVariant(v.id, "concentration", e.target.value)}>
                    {["Extrait de Parfum", "Eau de Parfum", "Eau de Toilette", "Eau de Cologne"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", display: "block", marginBottom: 5 }}>Price (€)</label>
                  <input type="number" style={inputStyle} value={v.price} onChange={e => updateVariant(v.id, "price", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", display: "block", marginBottom: 5 }}>Stock</label>
                  <input type="number" style={inputStyle} value={v.stock} onChange={e => { const stock = +e.target.value; const status = stock === 0 ? "out_of_stock" : stock <= 5 ? "low_stock" : "in_stock"; updateVariant(v.id, "stock", e.target.value); updateVariant(v.id, "status", status); }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", display: "block", marginBottom: 5 }}>Status</label>
                  <StatusBadge status={v.status} />
                </div>
                {form.variants.length > 1 && (
                  <button onClick={() => removeVariant(v.id)} style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: 4, alignSelf: "end" }}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: "span 2", display: "flex", gap: 12 }}>
          <button onClick={handleSave} style={{ background: "#1a1208", color: "#f5f0e8", border: "none", padding: "14px 32px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", borderRadius: 4, fontFamily: "Jost, sans-serif" }}>
            {editing ? "Update Product" : "Create Product"}
          </button>
          <button onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#8b7355", border: "1px solid #d4c5a9", padding: "14px 24px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "#8b7355" }}>{products.length} fragrances in catalog</p>
        <button onClick={openNew} style={{ background: "#1a1208", color: "#f5f0e8", border: "none", padding: "12px 24px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 4, fontFamily: "Jost, sans-serif" }}>+ New Fragrance</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {products.map((p) => (
          <div key={p.id} style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ position: "relative", height: 200 }}>
              <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {p.featured && <div style={{ position: "absolute", top: 10, right: 10, background: "#c9a96e", color: "#1a1208", fontSize: 9, fontWeight: 700, padding: "3px 8px", letterSpacing: "0.1em" }}>FEATURED</div>}
            </div>
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b7355", marginBottom: 4 }}>{p.collection} · {p.family}</div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontStyle: "italic", marginBottom: 8 }}>{p.name}</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {p.variants.map(v => <StatusBadge key={v.id} status={v.status} />)}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(p)} style={{ flex: 1, background: "#f0ebe2", color: "#1a1208", border: "none", padding: "8px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "8px 14px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCategories({ categories, setCategories, notify }) {
  const [form, setForm] = useState({ id: "", name: "", description: "" });
  const [editing, setEditing] = useState(null);
  const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid #d4c5a9", background: "#faf8f5", fontSize: 13, borderRadius: 4 };

  const save = () => {
    if (!form.name) return;
    const entry = { ...form, id: form.id || form.name.toLowerCase().replace(/\s+/g, "_") };
    setCategories(prev => editing ? prev.map(c => c.id === editing ? entry : c) : [...prev, entry]);
    setForm({ id: "", name: "", description: "" });
    setEditing(null);
    notify(editing ? "Collection updated" : "Collection created");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
      <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>{editing ? "Edit" : "New"} Collection</h3>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", display: "block", marginBottom: 5 }}>Name</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Oriental" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7355", display: "block", marginBottom: 5 }}>Description</label>
          <textarea style={{ ...inputStyle, height: 72, resize: "vertical" }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." />
        </div>
        <button onClick={save} style={{ background: "#1a1208", color: "#f5f0e8", border: "none", padding: "10px 24px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>
          {editing ? "Update" : "Create Collection"}
        </button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>All Collections</h3>
        {categories.map((c) => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f0ebe2" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#8b7355" }}>{c.description}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setForm(c); setEditing(c.id); }} style={{ background: "#f0ebe2", color: "#1a1208", border: "none", padding: "6px 14px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>Edit</button>
              <button onClick={() => { setCategories(prev => prev.filter(cat => cat.id !== c.id)); notify("Collection deleted"); }} style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 14px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminInventory({ products, setProducts, notify }) {
  const updateStock = (productId, variantId, stock) => {
    const newStock = parseInt(stock) || 0;
    const status = newStock === 0 ? "out_of_stock" : newStock <= 5 ? "low_stock" : "in_stock";
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, variants: p.variants.map(v => v.id === variantId ? { ...v, stock: newStock, status } : v) } : p));
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 8, padding: 24 }}>
      <div style={{ marginBottom: 20, padding: 12, background: "#fef9c3", borderRadius: 4, fontSize: 12, color: "#854d0e" }}>
        💡 Stock levels auto-set status: 0 → Out of Stock, 1–5 → Low Stock, 6+ → In Stock
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e8ddd0" }}>
            {["Fragrance", "Variant", "Concentration", "Price", "Stock", "Status"].map(h => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8b7355", fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.flatMap((p) => p.variants.map((v, vi) => (
            <tr key={v.id} style={{ borderBottom: "1px solid #f0ebe2" }}>
              {vi === 0 && <td rowSpan={p.variants.length} style={{ padding: "12px 12px", fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontStyle: "italic", verticalAlign: "top", paddingTop: 16 }}>{p.name}</td>}
              <td style={{ padding: "12px 12px" }}>{v.volume_ml}ml</td>
              <td style={{ padding: "12px 12px", fontSize: 12, color: "#8b7355" }}>{v.concentration}</td>
              <td style={{ padding: "12px 12px" }}>€{v.price}</td>
              <td style={{ padding: "12px 12px" }}>
                <input type="number" min="0" value={v.stock} onChange={e => updateStock(p.id, v.id, e.target.value)}
                  style={{ width: 70, padding: "6px 10px", border: "1px solid #d4c5a9", borderRadius: 4, fontSize: 13, background: "#faf8f5" }} />
              </td>
              <td style={{ padding: "12px 12px" }}><StatusBadge status={v.status} /></td>
            </tr>
          )))}
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => notify("Inventory synced to GitHub Gist")} style={{ background: "#1a1208", color: "#f5f0e8", border: "none", padding: "10px 24px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>
          Sync to Gist
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("storefront"); // "storefront" | "admin" | "product"
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cart = useCart();

  const handleViewProduct = (product) => { setSelectedProduct(product); setView("product"); };
  const handleAddToCart = (product, variant) => { cart.addItem(product, variant); };

  // Apply CSS variables from config dynamically
  useEffect(() => {
    const root = document.documentElement;
    const c = config.colors;
    root.style.setProperty("--color-primary", c.primary);
    root.style.setProperty("--color-secondary", c.secondary);
    root.style.setProperty("--color-background", c.background);
    root.style.setProperty("--color-text", c.text);
  }, [config]);

  return (
    <div style={{ fontFamily: "Jost, sans-serif" }}>
      {/* DEMO SWITCHER */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, display: "flex", gap: 8 }}>
        <button onClick={() => setView("storefront")} style={{ background: view === "storefront" ? "#c9a96e" : "#1a1208", color: view === "storefront" ? "#1a1208" : "#f5f0e8", border: "none", padding: "10px 20px", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", borderRadius: 4, fontFamily: "Jost, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          🛍 Storefront
        </button>
        <button onClick={() => setView("admin")} style={{ background: view === "admin" ? "#c9a96e" : "#1a1208", color: view === "admin" ? "#1a1208" : "#f5f0e8", border: "none", padding: "10px 20px", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", borderRadius: 4, fontFamily: "Jost, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          ⚙️ Admin Dashboard
        </button>
      </div>

      {view === "storefront" && <Storefront config={config} products={products} categories={categories} cart={cart} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />}
      {view === "product" && selectedProduct && <ProductDetail product={selectedProduct} config={config} cart={cart} onBack={() => setView("storefront")} onAddToCart={handleAddToCart} />}
      {view === "admin" && <AdminDashboard config={config} setConfig={setConfig} products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} />}
    </div>
  );
}
