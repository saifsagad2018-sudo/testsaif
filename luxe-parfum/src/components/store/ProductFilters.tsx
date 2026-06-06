"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
  sizes: string[];
  activeCategory?: string;
  activeSize?: string;
  activeSort?: string;
}

export default function ProductFilters({ categories, sizes, activeCategory, activeSize, activeSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    router.push(`${pathname}?${params.toString()}`);
  };

  const btn = (active: boolean): React.CSSProperties => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "0.5rem 0.75rem",
    background: active ? "var(--gold)" : "transparent",
    color: active ? "var(--bg)" : "var(--text-muted)",
    border: `1px solid ${active ? "var(--gold)" : "transparent"}`,
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.3s",
    marginBottom: "0.25rem",
    fontFamily: "var(--font-body)",
  });

  return (
    <div style={{ position: "sticky", top: "5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>Family</p>
        <button style={btn(!activeCategory)} onClick={() => update("category", undefined)}>All</button>
        {categories.map((cat) => (
          <button key={cat.id} style={btn(activeCategory === cat.id)} onClick={() => update("category", cat.id)}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>Size</p>
        <button style={btn(!activeSize)} onClick={() => update("size", undefined)}>All</button>
        {sizes.map((s) => (
          <button key={s} style={btn(activeSize === s)} onClick={() => update("size", s)}>{s}</button>
        ))}
      </div>
      <div>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>Sort</p>
        {[{ label: "Default", value: "" }, { label: "Price Low-High", value: "price-asc" }, { label: "Price High-Low", value: "price-desc" }].map((opt) => (
          <button key={opt.value} style={btn((!activeSort && !opt.value) || activeSort === opt.value)} onClick={() => update("sort", opt.value || undefined)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
