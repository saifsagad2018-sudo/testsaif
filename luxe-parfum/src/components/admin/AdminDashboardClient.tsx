"use client";
import { useState, useEffect, useCallback, CSSProperties } from "react";
import type { GistData, Product, Category, SiteSettings, VolumeVariant } from "@/types";
import { THEMES, DEFAULT_DATA } from "@/lib/themes";

/* ────────── helpers ────────── */
type Tab = "settings" | "whatsapp" | "themes" | "products" | "categories";

async function uploadToCloudinary(file: File): Promise<string> {
  const res = await fetch("/api/upload-image");
  if (!res.ok) throw new Error("Could not get upload credentials");
  const { cloudName, uploadPreset } = await res.json();
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  const up = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  const data = await up.json();
  if (!data.secure_url) throw new Error("Upload failed");
  return data.secure_url as string;
}

const LBL: CSSProperties = { display: "block", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "1.5rem", marginBottom: "1.5rem" }}>
      <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem" }}>{title}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={LBL}>{label}</label>
      {children}
    </div>
  );
}

/* ────────── Main Dashboard ────────── */
export default function AdminDashboardClient() {
  const [data, setData] = useState<GistData | null>(null);
  const [tab, setTab] = useState<Tab>("settings");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: true });

  useEffect(() => {
    fetch("/api/gist").then((r) => r.json()).then(setData).catch(() => setData(DEFAULT_DATA));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    setMsg({ text: "", ok: true });
    try {
      const res = await fetch("/api/gist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (res.ok) {
        setMsg({ text: "Saved successfully ✓", ok: true });
      } else {
        setMsg({ text: json.error ?? "Save failed", ok: false });
      }
    } catch {
      setMsg({ text: "Network error", ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ text: "", ok: true }), 3000);
    }
  }, [data]);

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin";
  };

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)", letterSpacing: "0.2em" }}>Loading dashboard…</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "settings", label: "Site Settings", icon: "⚙" },
    { id: "whatsapp", label: "WhatsApp Orders", icon: "✆" },
    { id: "themes", label: "Themes", icon: "◐" },
    { id: "products", label: "Products", icon: "◆" },
    { id: "categories", label: "Categories", icon: "◈" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", minHeight: "100vh", background: "var(--surface)", borderRight: "1px solid var(--border)", position: "fixed", top: 0, left: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "2rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--text)" }}>{data.settings.siteName}</p>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", marginTop: "0.25rem" }}>Admin Panel</p>
        </div>
        <nav style={{ flex: 1, padding: "1rem 0" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: "0.75rem", width: "100%",
              padding: "0.85rem 1.5rem",
              background: tab === t.id ? "var(--primary)" : "transparent",
              borderLeft: `3px solid ${tab === t.id ? "var(--gold)" : "transparent"}`,
              borderRight: "none", borderTop: "none", borderBottom: "none",
              color: tab === t.id ? "var(--text)" : "var(--text-muted)",
              fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", textAlign: "left", fontFamily: "var(--font-body)", transition: "all 0.2s",
            }}>
              <span style={{ fontSize: "1rem" }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)" }}>
          <button onClick={logout} style={{ width: "100%", padding: "0.6rem", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: "260px", flex: 1, padding: "2.5rem", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--text)", fontWeight: 400 }}>
            {tabs.find((t) => t.id === tab)?.label}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {msg.text && <p style={{ fontSize: "0.75rem", color: msg.ok ? "var(--gold)" : "#e05555" }}>{msg.text}</p>}
            <button className="btn-gold" onClick={save} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <a href="/" target="_blank" className="btn-outline" style={{ padding: "0.65rem 1.25rem", fontSize: "0.7rem", textDecoration: "none" }}>View Site →</a>
          </div>
        </div>

        {tab === "settings" && <SettingsTab data={data} setData={setData} uploadFn={uploadToCloudinary} />}
        {tab === "whatsapp" && <WhatsappTab data={data} setData={setData} />}
        {tab === "themes" && <ThemesTab data={data} setData={setData} />}
        {tab === "products" && <ProductsTab data={data} setData={setData} uploadFn={uploadToCloudinary} />}
        {tab === "categories" && <CategoriesTab data={data} setData={setData} />}
      </main>
    </div>
  );
}

/* ────────── Settings Tab ────────── */
function SettingsTab({ data, setData, uploadFn }: { data: GistData; setData: (d: GistData) => void; uploadFn: (f: File) => Promise<string> }) {
  const s = data.settings;
  const upd = (patch: Partial<SiteSettings>) => setData({ ...data, settings: { ...s, ...patch } });
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logoUrl" | "faviconUrl" | "heroImage") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadFn(file);
      upd({ [field]: url });
    } catch (err) {
      alert("Upload failed. Check Cloudinary env vars.");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div style={{ maxWidth: "680px" }}>
      <Section title="Brand Identity">
        <Field label="Site Name">
          <input value={s.siteName} onChange={(e) => upd({ siteName: e.target.value })} className="lux-input" />
        </Field>
        <Field label="Logo">
          {s.logoUrl && <img src={s.logoUrl} alt="logo" style={{ height: "50px", marginBottom: "0.5rem", display: "block", objectFit: "contain" }} />}
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "logoUrl")} style={{ color: "var(--text-muted)", fontSize: "0.8rem" }} disabled={uploading === "logoUrl"} />
          {uploading === "logoUrl" && <p style={{ color: "var(--gold)", fontSize: "0.75rem" }}>Uploading…</p>}
        </Field>
        <Field label="Favicon">
          {s.faviconUrl && <img src={s.faviconUrl} alt="fav" style={{ height: "32px", marginBottom: "0.5rem", display: "block" }} />}
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "faviconUrl")} style={{ color: "var(--text-muted)", fontSize: "0.8rem" }} disabled={uploading === "faviconUrl"} />
          {uploading === "faviconUrl" && <p style={{ color: "var(--gold)", fontSize: "0.75rem" }}>Uploading…</p>}
        </Field>
      </Section>

      <Section title="Homepage Content">
        <Field label="Hero Title">
          <input value={s.heroTitle} onChange={(e) => upd({ heroTitle: e.target.value })} className="lux-input" />
        </Field>
        <Field label="Hero Subtitle">
          <textarea value={s.heroSubtitle} onChange={(e) => upd({ heroSubtitle: e.target.value })} className="lux-input" rows={2} style={{ resize: "vertical" }} />
        </Field>
        <Field label="Hero Background Image">
          {s.heroImage && <img src={s.heroImage} alt="hero" style={{ height: "80px", objectFit: "cover", width: "100%", marginBottom: "0.5rem", display: "block" }} />}
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "heroImage")} style={{ color: "var(--text-muted)", fontSize: "0.8rem" }} disabled={uploading === "heroImage"} />
          {uploading === "heroImage" && <p style={{ color: "var(--gold)", fontSize: "0.75rem" }}>Uploading…</p>}
        </Field>
        <Field label="Announcement Banner">
          <input value={s.announcement} onChange={(e) => upd({ announcement: e.target.value })} className="lux-input" placeholder="e.g. Free shipping on orders over $150" />
        </Field>
      </Section>

      <Section title="Store Settings">
        <Field label="Currency">
          <select value={s.currency} onChange={(e) => upd({ currency: e.target.value })} className="lux-input">
            {["USD", "EUR", "GBP", "AED", "SAR", "KWD", "QAR"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Instagram Handle">
          <input value={s.instagram ?? ""} onChange={(e) => upd({ instagram: e.target.value })} className="lux-input" placeholder="@yourbrand" />
        </Field>
      </Section>
    </div>
  );
}

/* ────────── WhatsApp Tab ────────── */
function WhatsappTab({ data, setData }: { data: GistData; setData: (d: GistData) => void }) {
  const s = data.settings;
  const upd = (patch: Partial<SiteSettings>) => setData({ ...data, settings: { ...s, ...patch } });

  const previewMsg = `${s.whatsappMessage || "Hello! I'd like to order:"}

*Noir de Sable*
• Size: 50ml
• Quantity: 2
• Price: $130 each
• Total: $260`;

  return (
    <div style={{ maxWidth: "680px" }}>
      <Section title="WhatsApp Configuration">
        <div style={{ padding: "1rem", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.75rem", color: "#25D366", lineHeight: 1.7 }}>
            <strong>How it works:</strong> When a customer clicks "Order via WhatsApp", they are redirected to WhatsApp with a pre-filled message containing their order details. You receive the order directly in your WhatsApp.
          </p>
        </div>

        <Field label="WhatsApp Phone Number">
          <input
            value={s.whatsapp ?? ""}
            onChange={(e) => upd({ whatsapp: e.target.value })}
            className="lux-input"
            placeholder="e.g. 9647701234567 (with country code, no + or spaces)"
          />
          <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
            Include country code without + symbol. Example: 9647701234567 for Iraq (+964)
          </p>
        </Field>

        <Field label="Default Order Message">
          <textarea
            value={s.whatsappMessage ?? "Hello! I'd like to order:"}
            onChange={(e) => upd({ whatsappMessage: e.target.value })}
            className="lux-input"
            rows={3}
            style={{ resize: "vertical" }}
            placeholder="Hello! I'd like to order:"
          />
          <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
            This text appears at the beginning of every order message sent by customers.
          </p>
        </Field>
      </Section>

      <Section title="Message Preview">
        <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "1rem", letterSpacing: "0.05em" }}>This is how the order message will appear to customers:</p>
        <div style={{ background: "var(--primary)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "0 12px 12px 12px", maxWidth: "380px", whiteSpace: "pre-line", fontSize: "0.85rem", lineHeight: 1.8, color: "var(--text)" }}>
          {previewMsg}
        </div>
      </Section>

      <Section title="Test Your Setup">
        {s.whatsapp ? (
          <div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Your number: <strong style={{ color: "var(--text)" }}>+{s.whatsapp}</strong>
            </p>
            <a
              href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello! This is a test message from my perfume store.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
              style={{ width: "auto", display: "inline-flex" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send Test Message
            </a>
          </div>
        ) : (
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Add your phone number above to test.</p>
        )}
      </Section>
    </div>
  );
}

/* ────────── Themes Tab ────────── */
function ThemesTab({ data, setData }: { data: GistData; setData: (d: GistData) => void }) {
  const s = data.settings;
  const upd = (patch: Partial<SiteSettings>) => setData({ ...data, settings: { ...s, ...patch } });
  const activeThemeColors = THEMES.find((t) => t.id === s.activeTheme)?.colors;

  return (
    <div style={{ maxWidth: "800px" }}>
      <Section title="Select Theme">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          {THEMES.map((theme) => (
            <div key={theme.id} onClick={() => upd({ activeTheme: theme.id, customColors: {} })} style={{ border: `2px solid ${s.activeTheme === theme.id ? "var(--gold)" : "var(--border)"}`, padding: "1.25rem", cursor: "pointer", background: theme.colors.background, transition: "all 0.2s" }}>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem" }}>
                {(["background", "gold", "text"] as const).map((k) => (
                  <div key={k} style={{ width: "20px", height: "20px", borderRadius: "50%", background: theme.colors[k], border: "1px solid rgba(255,255,255,0.1)" }} />
                ))}
              </div>
              <p style={{ fontFamily: "var(--font-display)", color: theme.colors.text, fontSize: "0.95rem" }}>{theme.name}</p>
              {s.activeTheme === theme.id && <p style={{ fontSize: "0.6rem", color: theme.colors.gold, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.3rem" }}>Active</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Customize Colors">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {activeThemeColors && (Object.entries(activeThemeColors) as [keyof typeof activeThemeColors, string][]).map(([key, defaultVal]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input type="color" value={(s.customColors?.[key]) ?? defaultVal} onChange={(e) => upd({ customColors: { ...s.customColors, [key]: e.target.value } })} style={{ width: "40px", height: "36px", padding: "2px", border: "1px solid var(--border)", background: "var(--primary)", cursor: "pointer" }} />
              <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, " $1")}</label>
            </div>
          ))}
        </div>
        <button className="btn-outline" onClick={() => upd({ customColors: {} })} style={{ marginTop: "1.25rem", fontSize: "0.7rem" }}>Reset to Default</button>
      </Section>
    </div>
  );
}

/* ────────── Products Tab ────────── */
function ProductsTab({ data, setData, uploadFn }: { data: GistData; setData: (d: GistData) => void; uploadFn: (f: File) => Promise<string> }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const deleteProduct = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setData({ ...data, products: data.products.filter((p) => p.id !== id) });
  };

  const saveProduct = (product: Product) => {
    const exists = data.products.some((p) => p.id === product.id);
    const products = exists ? data.products.map((p) => (p.id === product.id ? product : p)) : [...data.products, product];
    setData({ ...data, products });
    setEditing(null);
    setCreating(false);
  };

  if (editing || creating) {
    return <ProductEditor product={editing ?? undefined} categories={data.categories} onSave={saveProduct} onCancel={() => { setEditing(null); setCreating(false); }} uploadFn={uploadFn} />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <button className="btn-gold" onClick={() => setCreating(true)}>+ New Product</button>
      </div>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {data.products.map((product) => (
          <div key={product.id} style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", gap: "1rem", alignItems: "center", background: "var(--surface)", border: "1px solid var(--border)", padding: "1rem 1.25rem" }}>
            <div style={{ width: "70px", height: "80px", background: "var(--primary)", overflow: "hidden", flexShrink: 0 }}>
              {product.images[0] && <img src={product.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>{product.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{product.category} · {product.variants.map((v) => v.size).join(", ")}</p>
              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
                {product.variants.map((v) => (
                  <span key={v.size} style={{ fontSize: "0.6rem", padding: "0.15rem 0.4rem", border: "1px solid var(--border)", color: v.status === "out_of_stock" ? "#e05555" : v.status === "limited" ? "#e8a020" : "var(--text-muted)" }}>
                    {v.size} ${v.price}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-outline" onClick={() => setEditing(product)} style={{ padding: "0.5rem 1rem", fontSize: "0.7rem" }}>Edit</button>
              <button onClick={() => deleteProduct(product.id)} style={{ padding: "0.5rem 0.75rem", background: "transparent", color: "#e05555", border: "1px solid #e05555", cursor: "pointer", fontSize: "0.75rem", fontFamily: "var(--font-body)" }}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────── Product Editor ────────── */
function ProductEditor({ product, categories, onSave, onCancel, uploadFn }: { product?: Product; categories: Category[]; onSave: (p: Product) => void; onCancel: () => void; uploadFn: (f: File) => Promise<string> }) {
  const blank: Product = { id: `p${Date.now()}`, name: "", nameAr: "", tagline: "", description: "", category: categories[0]?.id ?? "", images: [], variants: [{ size: "50ml", price: 100, stock: 10, status: "available" }], notes: { top: [], heart: [], base: [] }, featured: false, createdAt: new Date().toISOString() };
  const [p, setP] = useState<Product>(product ?? blank);
  const [imgUploading, setImgUploading] = useState(false);

  const upd = (patch: Partial<Product>) => setP((prev) => ({ ...prev, ...patch }));

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const url = await uploadFn(file);
      upd({ images: [...p.images, url] });
    } catch { alert("Image upload failed. Check Cloudinary settings."); }
    finally { setImgUploading(false); }
  };

  const updV = (i: number, patch: Partial<VolumeVariant>) => upd({ variants: p.variants.map((v, idx) => idx === i ? { ...v, ...patch } : v) });

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>{product ? "Edit Product" : "New Product"}</h2>
        <button className="btn-outline" onClick={onCancel} style={{ fontSize: "0.7rem" }}>Cancel</button>
      </div>

      <Section title="Basic Info">
        <Field label="Name (English)"><input value={p.name} onChange={(e) => upd({ name: e.target.value })} className="lux-input" /></Field>
        <Field label="Name (Arabic)"><input value={p.nameAr ?? ""} onChange={(e) => upd({ nameAr: e.target.value })} className="lux-input" dir="rtl" placeholder="اسم العطر" /></Field>
        <Field label="Tagline"><input value={p.tagline} onChange={(e) => upd({ tagline: e.target.value })} className="lux-input" /></Field>
        <Field label="Description"><textarea value={p.description} onChange={(e) => upd({ description: e.target.value })} className="lux-input" rows={3} style={{ resize: "vertical" }} /></Field>
        <Field label="Category">
          <select value={p.category} onChange={(e) => upd({ category: e.target.value })} className="lux-input">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input type="checkbox" id="feat" checked={p.featured} onChange={(e) => upd({ featured: e.target.checked })} />
          <label htmlFor="feat" style={{ fontSize: "0.75rem", color: "var(--text-muted)", cursor: "pointer" }}>Mark as Featured</label>
        </div>
      </Section>

      <Section title="Images">
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {p.images.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={img} alt="" style={{ width: "80px", height: "90px", objectFit: "cover", border: "1px solid var(--border)" }} />
              <button onClick={() => upd({ images: p.images.filter((_, idx) => idx !== i) })} style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", cursor: "pointer", padding: "0 5px", fontSize: "12px", lineHeight: "18px" }}>×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleImg} disabled={imgUploading} style={{ color: "var(--text-muted)", fontSize: "0.8rem" }} />
        {imgUploading && <p style={{ color: "var(--gold)", fontSize: "0.75rem", marginTop: "0.4rem" }}>Uploading image…</p>}
      </Section>

      <Section title="Volume Variants & Pricing">
        {p.variants.map((v, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "0.5rem", alignItems: "end", marginBottom: "0.75rem" }}>
            <Field label="Size"><input value={v.size} onChange={(e) => updV(i, { size: e.target.value })} className="lux-input" placeholder="50ml" /></Field>
            <Field label="Price"><input type="number" value={v.price} onChange={(e) => updV(i, { price: +e.target.value })} className="lux-input" /></Field>
            <Field label="Stock"><input type="number" value={v.stock} onChange={(e) => updV(i, { stock: +e.target.value })} className="lux-input" /></Field>
            <Field label="Status">
              <select value={v.status} onChange={(e) => updV(i, { status: e.target.value as VolumeVariant["status"] })} className="lux-input">
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </Field>
            <button onClick={() => upd({ variants: p.variants.filter((_, idx) => idx !== i) })} style={{ padding: "0.6rem 0.75rem", background: "transparent", color: "#e05555", border: "1px solid #e05555", cursor: "pointer", fontFamily: "var(--font-body)", marginBottom: "1px" }}>×</button>
          </div>
        ))}
        <button className="btn-outline" onClick={() => upd({ variants: [...p.variants, { size: "30ml", price: 80, stock: 5, status: "available" }] })} style={{ fontSize: "0.7rem" }}>+ Add Variant</button>
      </Section>

      <Section title="Fragrance Notes">
        {(["top", "heart", "base"] as const).map((key) => (
          <Field key={key} label={`${key.charAt(0).toUpperCase() + key.slice(1)} Notes (comma separated)`}>
            <input value={p.notes[key].join(", ")} onChange={(e) => upd({ notes: { ...p.notes, [key]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })} className="lux-input" placeholder="e.g. Bergamot, Saffron, Rose" />
          </Field>
        ))}
      </Section>

      <button className="btn-gold" onClick={() => onSave(p)}>Save Product</button>
    </div>
  );
}

/* ────────── Categories Tab ────────── */
function CategoriesTab({ data, setData }: { data: GistData; setData: (d: GistData) => void }) {
  const [cats, setCats] = useState<Category[]>(data.categories);

  const sync = (updated: Category[]) => { setCats(updated); setData({ ...data, categories: updated }); };

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <button className="btn-gold" onClick={() => sync([...cats, { id: `cat-${Date.now()}`, name: "New", nameAr: "", icon: "◉" }])}>+ Add Category</button>
      </div>
      {cats.map((cat, i) => (
        <div key={cat.id} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr auto", gap: "0.75rem", alignItems: "end", background: "var(--surface)", border: "1px solid var(--border)", padding: "1rem", marginBottom: "0.75rem" }}>
          <Field label="Icon"><input value={cat.icon} onChange={(e) => sync(cats.map((c, idx) => idx === i ? { ...c, icon: e.target.value } : c))} className="lux-input" style={{ textAlign: "center", fontSize: "1.2rem" }} /></Field>
          <Field label="Name (EN)"><input value={cat.name} onChange={(e) => sync(cats.map((c, idx) => idx === i ? { ...c, name: e.target.value } : c))} className="lux-input" /></Field>
          <Field label="Name (AR)"><input value={cat.nameAr ?? ""} onChange={(e) => sync(cats.map((c, idx) => idx === i ? { ...c, nameAr: e.target.value } : c))} className="lux-input" dir="rtl" /></Field>
          <button onClick={() => { if (confirm("Delete?")) sync(cats.filter((_, idx) => idx !== i)); }} style={{ padding: "0.6rem 0.75rem", background: "transparent", color: "#e05555", border: "1px solid #e05555", cursor: "pointer", marginBottom: "1px", fontFamily: "var(--font-body)" }}>×</button>
        </div>
      ))}
    </div>
  );
}
