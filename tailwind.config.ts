import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        // Tokens da identidade visual única (ver app/globals.css e README) —
        // grotesca única, quase monocromática, um só acento de cor.
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent) / 0.08)",
        line: "rgb(var(--color-ink) / 0.12)",
        muted: "rgb(var(--color-ink) / 0.55)",
        "muted-2": "rgb(var(--color-ink) / 0.32)",
      },
      fontFamily: {
        // Uma família só, em pesos variados — ver app/layout.tsx (next/font).
        sans: ["var(--font-inter)", "-apple-system", "Helvetica Neue", "Arial", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
