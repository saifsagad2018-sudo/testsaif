// ============================================================
// TYPES — Luxury Perfume Store
// ============================================================

export interface FragranceNote {
  top: string[];
  heart: string[];
  base: string[];
}

export interface VolumeVariant {
  ml: number;
  price: number;
  stock: number;
  status: "available" | "limited" | "sold_out";
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  variants: VolumeVariant[];
  notes: FragranceNote;
  featured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
}

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  accent: string;
  accentLight: string;
  text: string;
  textMuted: string;
  border: string;
  headerBg: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  activeTheme: string;
  customColors: ThemeColors;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  footerText: string;
  currency: string;
  currencySymbol: string;
}

export interface GistData {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  themes: Theme[];
}

export interface CartItem {
  productId: string;
  productName: string;
  image: string;
  ml: number;
  price: number;
  quantity: number;
}
