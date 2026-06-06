export interface VolumeVariant {
  size: string;
  price: number;
  stock: number;
  status: "available" | "limited" | "out_of_stock";
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  description: string;
  category: string;
  images: string[];
  variants: VolumeVariant[];
  notes: FragranceNotes;
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
  background: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
  gold: string;
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
  customColors: Partial<ThemeColors>;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  announcement: string;
  currency: string;
  whatsapp: string;
  instagram: string;
  whatsappMessage: string;
}

export interface GistData {
  settings: SiteSettings;
  products: Product[];
  categories: Category[];
}

export interface CartItem {
  productId: string;
  productName: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}
