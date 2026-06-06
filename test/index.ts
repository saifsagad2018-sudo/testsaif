export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type Concentration = "Extrait de Parfum" | "Eau de Parfum" | "Eau de Toilette" | "Eau de Cologne";

export interface ProductVariant {
  id: string;
  volume_ml: 10 | 30 | 50 | 75 | 100 | 150 | 200;
  concentration: Concentration;
  price: number;
  stock: number;
  status: StockStatus;
}

export interface FragranceNotes { top: string[]; heart: string[]; base: string[]; }

export interface Product {
  id: string; name: string; collection: string; description: string;
  image: string; family: string; variants: ProductVariant[];
  notes: FragranceNotes; featured: boolean;
  createdAt?: string; updatedAt?: string;
}

export interface Category { id: string; name: string; description: string; image?: string; }

export interface ColorPalette {
  primary: string; secondary: string; background: string;
  text: string; accent: string; surface: string;
}

export interface SiteConfig {
  version: number;
  colors: ColorPalette;
  fonts: { heading: string; body: string };
  logo_text: string; logo_url: string; tagline: string;
  hero: { title: string; subtitle: string; backgroundImage?: string };
  nav_links: string[]; updatedAt: string;
}

export interface GistData { config: SiteConfig; products: Product[]; categories: Category[]; }

export interface CartItem {
  productId: string; variantId: string; name: string;
  volume: number; concentration: Concentration; price: number; qty: number; image: string;
}
