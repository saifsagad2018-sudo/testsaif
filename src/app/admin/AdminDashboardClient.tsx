"use client";

// ============================================================
// ADMIN DASHBOARD CLIENT — Full control panel
// ============================================================

import { useState } from "react";
import { GistData, Product, Category, Theme, VolumeVariant, FragranceNote } from "@/types";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { BUILT_IN_THEMES } from "@/lib/defaults";

interface Props {
  initialData: GistData;
}

type Tab = "settings" | "themes" | "products" | "categories";

export default function AdminDashboardClient({ initialData }: Props) {
  const [data, setData] = useState<GistData>(initialData);
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // ── Save to Gist ──────────────────────────────────────────
  const saveData = async (newData: GistData) => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/gist/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      setSaveMsg(res.ok ? "✓ تم الحفظ بنجاح" : "✗ فشل الحفظ");
    } catch {
      setSaveMsg("✗ خطأ في الاتصال");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const update = (newData: GistData) => {
    setData(newData);
    saveData(newData);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "settings", label: "الإعدادات", icon: "⚙️" },
    { id: "themes", label: "الثيمات", icon: "🎨" },
    { id: "products", label: "المنتجات", icon: "🧴" },
    { id: "categories", label: "التصنيفات", icon: "📂" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex" dir="rtl">
      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className="w-64 bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[var(--color-border)]">
          <p className="font-display text-lg text-[var(--color-accent)] tracking-widest">
            ADMIN
          </p>
          <p className="text-[var(--color-text-muted)] text-xs font-arabic mt-1">
            {data.settings.siteName}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-right px-4 py-3 text-sm font-arabic flex items-center gap-3 transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <a
            href="/"
            target="_blank"
            className="block text-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors font-arabic py-2"
          >
            ← عرض المتجر
          </a>
          <a
            href="/api/admin/logout"
            className="block text-center text-xs text-red-400 hover:text-red-300 transition-colors font-arabic py-2"
          >
            تسجيل الخروج
          </a>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-arabic text-lg text-[var(--color-text)]">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          {saveMsg && (
            <span
              className={`text-sm font-arabic ${
                saveMsg.startsWith("✓") ? "text-green-400" : "text-red-400"
              }`}
            >
              {saveMsg}
            </span>
          )}
          {saving && (
            <span className="text-[var(--color-text-muted)] text-sm font-arabic">
              جاري الحفظ...
            </span>
          )}
        </div>

        <div className="p-8">
          {activeTab === "settings" && (
            <SettingsPanel data={data} onUpdate={update} />
          )}
          {activeTab === "themes" && (
            <ThemesPanel data={data} onUpdate={update} />
          )}
          {activeTab === "products" && (
            <ProductsPanel data={data} onUpdate={update} />
          )}
          {activeTab === "categories" && (
            <CategoriesPanel data={data} onUpdate={update} />
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// SETTINGS PANEL
// ============================================================
function SettingsPanel({
  data,
  onUpdate,
}: {
  data: GistData;
  onUpdate: (d: GistData) => void;
}) {
  const [settings, setSettings] = useState(data.settings);
  const [uploading, setUploading] = useState<string | null>(null);

  const save = () => onUpdate({ ...data, settings });

  const handleUpload = async (file: File, field: "logoUrl" | "faviconUrl" | "heroImage") => {
    setUploading(field);
    try {
      const result = await uploadToCloudinary(file, "perfume-brand");
      const updated = { ...settings, [field]: result.secure_url };
      setSettings(updated);
      onUpdate({ ...data, settings: updated });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل رفع الصورة";
      alert(message);
    }
    setUploading(null);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <Section title="الهوية الأساسية">
        <Field label="اسم الموقع">
          <input
            className="input-luxury"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
          />
        </Field>
        <Field label="عنوان الهيرو">
          <input
            className="input-luxury"
            value={settings.heroTitle}
            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
          />
        </Field>
        <Field label="وصف الهيرو">
          <textarea
            className="input-luxury"
            rows={3}
            value={settings.heroSubtitle}
            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
          />
        </Field>
        <Field label="نص الفوتر">
          <input
            className="input-luxury"
            value={settings.footerText}
            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="العملة (رمز)">
            <input
              className="input-luxury"
              value={settings.currencySymbol}
              onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
              maxLength={5}
            />
          </Field>
          <Field label="العملة (كود)">
            <input
              className="input-luxury"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              maxLength={5}
            />
          </Field>
        </div>
      </Section>

      <Section title="الصور">
        {[
          { label: "اللوجو", field: "logoUrl" as const },
          { label: "الأيقونة (Favicon)", field: "faviconUrl" as const },
          { label: "صورة الهيرو", field: "heroImage" as const },
        ].map(({ label, field }) => (
          <Field key={field} label={label}>
            <div className="flex items-center gap-4">
              {settings[field] && (
                <img
                  src={settings[field]}
                  alt={label}
                  className="h-12 w-12 object-contain border border-[var(--color-border)] p-1"
                />
              )}
              <label className="btn-luxury text-xs cursor-pointer">
                {uploading === field ? "جاري الرفع..." : "رفع صورة"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, field);
                  }}
                />
              </label>
              {settings[field] && (
                <button
                  onClick={() => setSettings({ ...settings, [field]: "" })}
                  className="text-xs text-red-400 hover:text-red-300 font-arabic"
                >
                  حذف
                </button>
              )}
            </div>
          </Field>
        ))}
      </Section>

      <button onClick={save} className="btn-luxury-fill font-arabic">
        حفظ الإعدادات
      </button>
    </div>
  );
}

// ============================================================
// THEMES PANEL
// ============================================================
function ThemesPanel({
  data,
  onUpdate,
}: {
  data: GistData;
  onUpdate: (d: GistData) => void;
}) {
  const themes = data.themes?.length ? data.themes : BUILT_IN_THEMES;
  const [customColors, setCustomColors] = useState(data.settings.customColors);

  const activateTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;
    onUpdate({
      ...data,
      settings: {
        ...data.settings,
        activeTheme: themeId,
        customColors: theme.colors,
      },
    });
    setCustomColors(theme.colors);
  };

  const saveCustomColors = () => {
    onUpdate({
      ...data,
      settings: { ...data.settings, customColors },
    });
  };

  const colorFields: { key: keyof typeof customColors; label: string }[] = [
    { key: "bg", label: "خلفية الصفحة" },
    { key: "surface", label: "خلفية البطاقات" },
    { key: "surfaceAlt", label: "خلفية بديلة" },
    { key: "accent", label: "لون التمييز" },
    { key: "accentLight", label: "تمييز فاتح" },
    { key: "text", label: "النص الرئيسي" },
    { key: "textMuted", label: "نص ثانوي" },
    { key: "border", label: "الحدود" },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <Section title="الثيمات الجاهزة">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`p-4 border-2 cursor-pointer transition-all ${
                data.settings.activeTheme === theme.id
                  ? "border-[var(--color-accent)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
              onClick={() => activateTheme(theme.id)}
            >
              {/* Color swatches */}
              <div className="flex gap-1 mb-3">
                {[theme.colors.bg, theme.colors.accent, theme.colors.surface, theme.colors.text].map(
                  (c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-white/10"
                      style={{ background: c }}
                    />
                  )
                )}
              </div>
              <p className="font-arabic text-sm text-[var(--color-text)]">{theme.name}</p>
              {data.settings.activeTheme === theme.id && (
                <p className="text-[var(--color-accent)] text-xs mt-1 font-arabic">✓ مفعّل</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="تخصيص الألوان يدوياً">
        <div className="grid grid-cols-2 gap-4">
          {colorFields.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={customColors[key] || "#000000"}
                onChange={(e) =>
                  setCustomColors({ ...customColors, [key]: e.target.value })
                }
                className="w-10 h-10 border-0 cursor-pointer rounded"
              />
              <div>
                <p className="text-xs font-arabic text-[var(--color-text)]">{label}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
                  {customColors[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={saveCustomColors} className="btn-luxury-fill font-arabic mt-4">
          حفظ الألوان المخصصة
        </button>
      </Section>
    </div>
  );
}

// ============================================================
// PRODUCTS PANEL
// ============================================================
function ProductsPanel({
  data,
  onUpdate,
}: {
  data: GistData;
  onUpdate: (d: GistData) => void;
}) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const newProduct = (): Product => ({
    id: `p${Date.now()}`,
    name: "",
    brand: data.settings.siteName,
    category: data.categories[0]?.id ?? "oriental",
    description: "",
    images: [],
    variants: [{ ml: 50, price: 100, stock: 10, status: "available" }],
    notes: { top: [], heart: [], base: [] },
    featured: false,
    createdAt: new Date().toISOString().split("T")[0],
  });

  const save = (product: Product) => {
    const products = isNew
      ? [...data.products, product]
      : data.products.map((p) => (p.id === product.id ? product : p));
    onUpdate({ ...data, products });
    setEditing(null);
    setIsNew(false);
  };

  const deleteProduct = (id: string) => {
    if (!confirm("حذف هذا المنتج؟")) return;
    onUpdate({ ...data, products: data.products.filter((p) => p.id !== id) });
  };

  if (editing) {
    return (
      <ProductEditor
        product={editing}
        categories={data.categories}
        onSave={save}
        onCancel={() => { setEditing(null); setIsNew(false); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-[var(--color-text-muted)] text-sm font-arabic">
          {data.products.length} منتج
        </p>
        <button
          onClick={() => { setEditing(newProduct()); setIsNew(true); }}
          className="btn-luxury-fill font-arabic text-sm"
        >
          + إضافة منتج
        </button>
      </div>

      <div className="space-y-3">
        {data.products.map((product) => (
          <div
            key={product.id}
            className="card-luxury p-4 flex items-center gap-4"
          >
            <div className="w-16 h-20 bg-[var(--color-surface-alt)] flex-shrink-0 overflow-hidden">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">
                  🌸
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-arabic text-sm text-[var(--color-text)] mb-1">{product.name}</p>
              <p className="text-[var(--color-text-muted)] text-xs font-arabic">
                {product.variants.map((v) => `${v.ml}ml`).join(" · ")} |{" "}
                {data.categories.find((c) => c.id === product.category)?.nameAr ?? product.category}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {product.featured && (
                <span className="text-[var(--color-accent)] text-xs font-arabic">⭐ مميز</span>
              )}
              <button
                onClick={() => setEditing(product)}
                className="btn-luxury text-xs py-1 px-4"
              >
                تعديل
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="text-red-400 hover:text-red-300 text-xs transition-colors font-arabic"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT EDITOR
// ============================================================
function ProductEditor({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product;
  categories: Category[];
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [p, setP] = useState<Product>(product);
  const [uploading, setUploading] = useState(false);

  const updateVariant = (i: number, field: keyof VolumeVariant, value: unknown) => {
    const variants = [...p.variants];
    variants[i] = { ...variants[i], [field]: value };
    setP({ ...p, variants });
  };

  const addVariant = () =>
    setP({ ...p, variants: [...p.variants, { ml: 30, price: 0, stock: 0, status: "available" }] });

  const removeVariant = (i: number) =>
    setP({ ...p, variants: p.variants.filter((_, idx) => idx !== i) });

  const updateNotes = (tier: keyof FragranceNote, value: string) =>
    setP({ ...p, notes: { ...p.notes, [tier]: value.split("،").map((s) => s.trim()).filter(Boolean) } });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "perfume-products");
      setP({ ...p, images: [...p.images, result.secure_url] });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "فشل رفع الصورة");
    }
    setUploading(false);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-arabic text-lg text-[var(--color-text)]">
          {product.name || "منتج جديد"}
        </h2>
        <button onClick={onCancel} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-arabic text-sm">
          ← رجوع
        </button>
      </div>

      <Section title="المعلومات الأساسية">
        <Field label="اسم العطر">
          <input className="input-luxury" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
        </Field>
        <Field label="العلامة التجارية">
          <input className="input-luxury" value={p.brand} onChange={(e) => setP({ ...p, brand: e.target.value })} />
        </Field>
        <Field label="التصنيف">
          <select className="input-luxury" value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </select>
        </Field>
        <Field label="الوصف">
          <textarea className="input-luxury" rows={4} value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} />
        </Field>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={p.featured} onChange={(e) => setP({ ...p, featured: e.target.checked })} className="w-4 h-4 accent-[var(--color-accent)]" />
          <span className="text-sm font-arabic text-[var(--color-text)]">منتج مميز</span>
        </label>
      </Section>

      <Section title="الصور">
        <div className="flex flex-wrap gap-3 mb-4">
          {p.images.map((img, i) => (
            <div key={i} className="relative w-20 h-24">
              <img src={img} className="w-full h-full object-cover" alt="" />
              <button
                onClick={() => setP({ ...p, images: p.images.filter((_, idx) => idx !== i) })}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >✕</button>
            </div>
          ))}
          <label className="w-20 h-24 border-2 border-dashed border-[var(--color-border)] flex items-center justify-center cursor-pointer hover:border-[var(--color-accent)] transition-colors text-[var(--color-text-muted)]">
            {uploading ? "..." : "+"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
          </label>
        </div>
      </Section>

      <Section title="الأحجام والأسعار">
        <div className="space-y-3">
          {p.variants.map((v, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 items-center bg-[var(--color-surface-alt)] p-3">
              <div>
                <label className="text-xs text-[var(--color-text-muted)] font-arabic block mb-1">الحجم (ml)</label>
                <input type="number" className="input-luxury text-sm" value={v.ml} onChange={(e) => updateVariant(i, "ml", +e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-muted)] font-arabic block mb-1">السعر</label>
                <input type="number" className="input-luxury text-sm" value={v.price} onChange={(e) => updateVariant(i, "price", +e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-muted)] font-arabic block mb-1">المخزون</label>
                <input type="number" className="input-luxury text-sm" value={v.stock} onChange={(e) => updateVariant(i, "stock", +e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-muted)] font-arabic block mb-1">الحالة</label>
                <select className="input-luxury text-sm" value={v.status} onChange={(e) => updateVariant(i, "status", e.target.value)}>
                  <option value="available">متاح</option>
                  <option value="limited">محدود</option>
                  <option value="sold_out">نفذ</option>
                </select>
              </div>
              <button onClick={() => removeVariant(i)} className="text-red-400 text-xs font-arabic col-span-4 text-left">حذف هذا الحجم</button>
            </div>
          ))}
        </div>
        <button onClick={addVariant} className="btn-luxury text-xs mt-3 font-arabic">+ إضافة حجم</button>
      </Section>

      <Section title="مكونات العطر (افصل بـ ،)">
        {[
          { key: "top" as const, label: "رائحة الافتتاح (Top Notes)" },
          { key: "heart" as const, label: "القلب (Heart Notes)" },
          { key: "base" as const, label: "القاعدة (Base Notes)" },
        ].map(({ key, label }) => (
          <Field key={key} label={label}>
            <input
              className="input-luxury"
              placeholder="مثال: الورد، البرغموت، المسك"
              value={p.notes[key].join("، ")}
              onChange={(e) => updateNotes(key, e.target.value)}
            />
          </Field>
        ))}
      </Section>

      <div className="flex gap-4">
        <button onClick={() => onSave(p)} className="btn-luxury-fill font-arabic flex-1">
          حفظ المنتج
        </button>
        <button onClick={onCancel} className="btn-luxury font-arabic">
          إلغاء
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CATEGORIES PANEL
// ============================================================
function CategoriesPanel({
  data,
  onUpdate,
}: {
  data: GistData;
  onUpdate: (d: GistData) => void;
}) {
  const [categories, setCategories] = useState<Category[]>(data.categories);

  const addCategory = () => {
    setCategories([...categories, { id: `cat${Date.now()}`, name: "", nameAr: "", icon: "🌸" }]);
  };

  const updateCat = (i: number, field: keyof Category, value: string) => {
    const cats = [...categories];
    cats[i] = { ...cats[i], [field]: value };
    setCategories(cats);
  };

  const removeCat = (i: number) => setCategories(categories.filter((_, idx) => idx !== i));

  const save = () => onUpdate({ ...data, categories });

  return (
    <div className="max-w-xl space-y-6">
      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={cat.id} className="grid grid-cols-4 gap-3 items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
            <input className="input-luxury" value={cat.icon} onChange={(e) => updateCat(i, "icon", e.target.value)} placeholder="أيقونة" maxLength={2} />
            <input className="input-luxury" value={cat.nameAr} onChange={(e) => updateCat(i, "nameAr", e.target.value)} placeholder="الاسم عربي" />
            <input className="input-luxury" value={cat.name} onChange={(e) => updateCat(i, "name", e.target.value)} placeholder="Name EN" />
            <button onClick={() => removeCat(i)} className="text-red-400 hover:text-red-300 text-sm font-arabic text-center">حذف</button>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={addCategory} className="btn-luxury font-arabic">+ إضافة تصنيف</button>
        <button onClick={save} className="btn-luxury-fill font-arabic">حفظ التصنيفات</button>
      </div>
    </div>
  );
}

// ── Reusable UI helpers ───────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="font-arabic text-base text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs tracking-wide text-[var(--color-text-muted)] font-arabic">
        {label}
      </label>
      {children}
    </div>
  );
}
