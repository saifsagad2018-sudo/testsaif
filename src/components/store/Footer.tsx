import { SiteSettings } from "@/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto text-center">
        <span className="font-display text-2xl text-[var(--color-accent)] tracking-[0.15em] block mb-4">
          {settings.siteName}
        </span>
        <div className="divider-accent" />
        <p className="text-[var(--color-text-muted)] text-sm font-arabic mt-4">
          {settings.footerText}
        </p>
      </div>
    </footer>
  );
}
