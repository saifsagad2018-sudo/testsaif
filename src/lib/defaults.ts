// ============================================================
// DEFAULT DATA — Themes, Categories, Sample Products
// ============================================================

import { GistData, Theme } from "@/types";

export const BUILT_IN_THEMES: Theme[] = [
  {
    id: "dark-luxury",
    name: "Dark Luxury",
    colors: {
      bg: "#0A0805",
      surface: "#13110C",
      surfaceAlt: "#1C1812",
      accent: "#C9A84C",
      accentLight: "#E8C96A",
      text: "#F5F0E8",
      textMuted: "#8A7E6A",
      border: "#2A2418",
      headerBg: "rgba(10,8,5,0.95)",
    },
  },
  {
    id: "light-minimal",
    name: "Light Minimalist",
    colors: {
      bg: "#FAFAF8",
      surface: "#FFFFFF",
      surfaceAlt: "#F2F0EB",
      accent: "#2C2420",
      accentLight: "#5C4A3A",
      text: "#1A1612",
      textMuted: "#8A8278",
      border: "#E8E2D8",
      headerBg: "rgba(250,250,248,0.97)",
    },
  },
  {
    id: "pastel-warm",
    name: "Warm Pastel",
    colors: {
      bg: "#FBF6F0",
      surface: "#FFFFFF",
      surfaceAlt: "#F5EDE4",
      accent: "#B07A5C",
      accentLight: "#C99478",
      text: "#2A1F18",
      textMuted: "#9A7D6A",
      border: "#E8D8CC",
      headerBg: "rgba(251,246,240,0.97)",
    },
  },
];

export const DEFAULT_GIST_DATA: GistData = {
  settings: {
    siteName: "MAISON OLFACT",
    logoUrl: "",
    faviconUrl: "",
    activeTheme: "dark-luxury",
    customColors: BUILT_IN_THEMES[0].colors,
    heroTitle: "تجربة عطور لا مثيل لها",
    heroSubtitle: "مجموعة مختارة من أرقى العطور العالمية",
    heroImage: "",
    footerText: "© 2025 MAISON OLFACT. جميع الحقوق محفوظة.",
    currency: "USD",
    currencySymbol: "$",
  },
  categories: [
    { id: "oriental", name: "Oriental", nameAr: "شرقي", icon: "🌙" },
    { id: "woody", name: "Woody", nameAr: "خشبي", icon: "🪵" },
    { id: "citrus", name: "Citrus", nameAr: "حمضيات", icon: "🍋" },
    { id: "oud", name: "Oud", nameAr: "عود", icon: "🌿" },
    { id: "floral", name: "Floral", nameAr: "زهري", icon: "🌸" },
  ],
  themes: BUILT_IN_THEMES,
  products: [
    {
      id: "p1",
      name: "Noir de Minuit",
      brand: "MAISON OLFACT",
      category: "oriental",
      description:
        "عطر شرقي أسطوري يفتح بإكليل الجبل والبرغموت الإيطالي، قبل أن يكشف عن قلبه الدافئ من الورد الطائفي والعنبر. يختتم بأعماق من الصندل والمسك الأبيض الذي يبقى على البشرة لساعات.",
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800",
        "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800",
      ],
      variants: [
        { ml: 30, price: 95, stock: 25, status: "available" },
        { ml: 50, price: 145, stock: 12, status: "limited" },
        { ml: 100, price: 220, stock: 0, status: "sold_out" },
      ],
      notes: {
        top: ["البرغموت", "إكليل الجبل", "الفلفل الأسود"],
        heart: ["الورد الطائفي", "العنبر", "البخور"],
        base: ["خشب الصندل", "المسك الأبيض", "الفانيليا"],
      },
      featured: true,
      createdAt: "2025-01-01",
    },
    {
      id: "p2",
      name: "Lumière d'Or",
      brand: "MAISON OLFACT",
      category: "floral",
      description:
        "عطر زهري ضوئي مستوحى من حقول الياسمين في غروب الشمس. تمزج قلوبه الزهرية الناعمة مع خيوط المسك وخشب الأرز لتمنحك ضوء دافئ يعلق على بشرتك طوال اليوم.",
      images: [
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
      ],
      variants: [
        { ml: 30, price: 85, stock: 40, status: "available" },
        { ml: 50, price: 130, stock: 20, status: "available" },
        { ml: 100, price: 195, stock: 8, status: "limited" },
      ],
      notes: {
        top: ["الياسمين", "الورد الداماسكي", "البرتقال"],
        heart: ["زنبق الوادي", "الفاوانيا", "الأيريس"],
        base: ["المسك", "خشب الأرز", "أمبريت"],
      },
      featured: true,
      createdAt: "2025-01-05",
    },
    {
      id: "p3",
      name: "Oud Impérial",
      brand: "MAISON OLFACT",
      category: "oud",
      description:
        "ملك العطور. عود هندي نقي مدخن يلتقي مع الورد البلغاري وحبة البركة في تجربة شرقية ملكية. لمن يبحث عن عطر يقول الكثير بصمت.",
      images: [
        "https://images.unsplash.com/photo-1592945403407-9caf930c3ded?w=800",
      ],
      variants: [
        { ml: 30, price: 180, stock: 10, status: "limited" },
        { ml: 50, price: 280, stock: 5, status: "limited" },
        { ml: 100, price: 420, stock: 2, status: "limited" },
      ],
      notes: {
        top: ["الزعفران", "الكمون", "الفلفل الوردي"],
        heart: ["العود الهندي", "الورد البلغاري", "حبة البركة"],
        base: ["الأمبرجريس", "اللبان", "المسك الثمين"],
      },
      featured: true,
      createdAt: "2025-01-10",
    },
  ],
};
