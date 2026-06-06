import type { Metadata } from "next";
import "./globals.css";
import { fetchGistData } from "@/lib/gist";
import { generateThemeStyle } from "@/lib/theme-utils";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchGistData();
  return {
    title: data.settings.siteName,
    description: data.settings.heroSubtitle,
    icons: data.settings.faviconUrl ? { icon: data.settings.faviconUrl } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await fetchGistData();
  const themeStyle = generateThemeStyle(data.settings);

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
