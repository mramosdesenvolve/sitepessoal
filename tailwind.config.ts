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
        // Identidade "terminal" (editor de código) — segue a mesma
        // convenção .dark de paper/ink/accent (valores em app/globals.css).
        "term-bg": "rgb(var(--term-bg) / <alpha-value>)",
        "term-elevated": "rgb(var(--term-elevated) / <alpha-value>)",
        "term-inset": "rgb(var(--term-inset) / <alpha-value>)",
        "term-ink": "rgb(var(--term-ink) / <alpha-value>)",
        "term-muted": "rgb(var(--term-muted) / <alpha-value>)",
        "term-muted-2": "rgb(var(--term-muted-2) / <alpha-value>)",
        "term-accent": "rgb(var(--term-accent) / <alpha-value>)",
        "term-accent-dim": "rgb(var(--term-accent-dim) / <alpha-value>)",
        "term-accent2": "rgb(var(--term-accent2) / <alpha-value>)",
        "term-accent2-dim": "rgb(var(--term-accent2-dim) / <alpha-value>)",
        "term-line": "rgb(var(--term-line) / <alpha-value>)",
        "term-danger": "rgb(var(--term-danger) / <alpha-value>)",
      },
      fontFamily: {
        // Nomes mantidos por compatibilidade com o resto do código
        // (font-serif/font-sans já usados em ~10 componentes) — mas as
        // duas apontam para a mesma família (Space Grotesk, ver
        // app/layout.tsx), variando só o peso: serif = 700, sans = 400.
        serif: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        // pilhas de fontes do sistema — sem next/font, igual ao mockup
        "term-mono": [
          "ui-monospace",
          "SF Mono",
          "Cascadia Code",
          "JetBrains Mono",
          "Fira Code",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
        "term-serif": [
          "Charter",
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "Georgia",
          "Noto Serif",
          "serif",
        ],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
