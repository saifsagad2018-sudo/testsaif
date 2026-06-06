/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:    "var(--color-primary)",
          secondary:  "var(--color-secondary)",
          background: "var(--color-background)",
          text:       "var(--color-text)",
          accent:     "var(--color-accent)",
          surface:    "var(--color-surface)",
        },
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body:    "var(--font-body)",
      },
    },
  },
  plugins: [],
};
