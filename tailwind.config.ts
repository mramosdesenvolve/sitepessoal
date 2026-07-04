import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        // Tokens da identidade visual — ver README. Os valores reais vivem
        // em app/globals.css como variáveis RGB (--color-*), redefinidas
        // dentro de `.dark` — assim os tokens abaixo funcionam nos dois temas
        // sem duplicar classes, e ainda suportam modificadores de opacidade
        // (ex. text-accent/80) via o placeholder <alpha-value>.
        paper: "rgb(var(--color-paper) / <alpha-value>)", // fundo
        ink: "rgb(var(--color-ink) / <alpha-value>)", // texto principal
        accent: "rgb(var(--color-accent) / <alpha-value>)", // única cor de destaque
        "accent-soft": "rgb(var(--color-accent) / 0.1)",
        line: "rgb(var(--color-ink) / 0.12)",
        muted: "rgb(var(--color-ink) / 0.6)",
      },
      fontFamily: {
        // Nomes mantidos por compatibilidade com o resto do código
        // (font-serif/font-sans já usados em ~10 componentes) — mas as
        // duas apontam para a mesma família (Space Grotesk, ver
        // app/layout.tsx), variando só o peso: serif = 700, sans = 400.
        serif: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
