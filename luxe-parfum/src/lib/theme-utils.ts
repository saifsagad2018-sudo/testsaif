import type { ThemeColors, SiteSettings } from "@/types";
import { THEMES } from "./themes";

export function resolveThemeColors(settings: SiteSettings): ThemeColors {
  const base = THEMES.find((t) => t.id === settings.activeTheme)?.colors ?? THEMES[0].colors;
  return { ...base, ...(settings.customColors ?? {}) };
}

export function generateThemeStyle(settings: SiteSettings): string {
  const c = resolveThemeColors(settings);
  return `
    :root {
      --bg: ${c.background};
      --surface: ${c.surface};
      --primary: ${c.primary};
      --accent: ${c.accent};
      --text: ${c.text};
      --text-muted: ${c.textMuted};
      --border: ${c.border};
      --gold: ${c.gold};
    }
  `;
}
