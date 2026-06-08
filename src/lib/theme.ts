// ============================================================
// THEME — Generate CSS custom properties from active theme
// ============================================================

import { GistData, ThemeColors } from "@/types";

/**
 * Resolve the active theme colors from site settings.
 * Merges built-in theme with any manual overrides.
 */
export function resolveActiveTheme(data: GistData): ThemeColors {
  const activeId = data.settings.activeTheme;
  const builtIn = data.themes?.find((t) => t.id === activeId);
  const base = builtIn?.colors ?? data.themes?.[0]?.colors ?? data.settings.customColors;

  // customColors acts as per-theme overrides
  return { ...base, ...data.settings.customColors };
}

/**
 * Convert ThemeColors to CSS custom properties string.
 * Injected as <style> in the root layout for instant theme application.
 */
export function themeToCSS(colors: ThemeColors): string {
  return `
    :root {
      --color-bg: ${colors.bg};
      --color-surface: ${colors.surface};
      --color-surface-alt: ${colors.surfaceAlt};
      --color-accent: ${colors.accent};
      --color-accent-light: ${colors.accentLight};
      --color-text: ${colors.text};
      --color-text-muted: ${colors.textMuted};
      --color-border: ${colors.border};
      --color-header-bg: ${colors.headerBg};
    }
  `.trim();
}

/**
 * Generate full theme CSS string for a given GistData object.
 */
export function generateThemeStyles(data: GistData): string {
  const colors = resolveActiveTheme(data);
  return themeToCSS(colors);
}
