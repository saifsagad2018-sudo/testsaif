import type { GistData, SiteConfig } from "../types";

let _cache: GistData | null = null;
let _lastFetch = 0;
const TTL = 30_000;

export async function getSiteData(): Promise<GistData> {
  if (_cache && Date.now() - _lastFetch < TTL) return _cache;
  try {
    const res = await fetch("/api/config", { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`${res.status}`);
    _cache = await res.json();
    _lastFetch = Date.now();
    return _cache!;
  } catch (e) {
    if (_cache) return _cache; // graceful degradation
    throw e;
  }
}

export async function updateSiteData(partial: Partial<GistData>): Promise<void> {
  const res = await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(partial) });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Update failed"); }
  _cache = null;
}

export function injectCssVars(cfg: SiteConfig): void {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  r.style.setProperty("--color-primary",    cfg.colors.primary);
  r.style.setProperty("--color-secondary",  cfg.colors.secondary);
  r.style.setProperty("--color-background", cfg.colors.background);
  r.style.setProperty("--color-text",       cfg.colors.text);
  r.style.setProperty("--color-accent",     cfg.colors.accent);
  r.style.setProperty("--color-surface",    cfg.colors.surface);
  r.style.setProperty("--font-heading",     `'${cfg.fonts.heading}', serif`);
  r.style.setProperty("--font-body",        `'${cfg.fonts.body}', sans-serif`);
}
