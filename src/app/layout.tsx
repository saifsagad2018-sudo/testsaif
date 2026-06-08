// ============================================================
// ROOT LAYOUT — Dynamic theme + SEO from Gist data
// ============================================================

import type { Metadata } from "next";
import { fetchGistData } from "@/lib/gist";
import { generateThemeStyles } from "@/lib/theme";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchGistData();
  return {
    title: data.settings.siteName,
    description: data.settings.heroSubtitle,
    icons: {
      icon: data.settings.faviconUrl || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchGistData();
  const themeCSS = generateThemeStyles(data);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Tajawal:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] font-arabic min-h-screen">
        {children}
      </body>
    </html>
  );
}
