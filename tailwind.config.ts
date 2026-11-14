import type { Config } from "tailwindcss";

/**
 * ID Pessoal — Design System v0.3. Os valores vivem em app/globals.css
 * (variáveis CSS); aqui só os nomes. Duas decisões do sistema ficam
 * impostas pela própria configuração:
 *   — só existem dois raios, reto e círculo (borderRadius sobrescrito);
 *   — não existe sombra (boxShadow sobrescrito) — profundidade é inversão
 *     e fio.
 * E a escala de tipo começa em 16px: não há `text-xs`/`text-sm`.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    borderRadius: {
      none: "0",
      full: "999px",
    },
    boxShadow: {
      none: "none",
    },
    fontSize: {
      "step-0": "var(--text-0)",
      "step-1": "var(--text-1)",
      "step-2": "var(--text-2)",
      "step-3": "var(--text-3)",
      "step-4": "var(--text-4)",
      "step-5": "var(--text-5)",
      "step-6": "var(--text-6)",
      "step-7": "var(--text-7)",
      "step-8": "var(--text-8)",
      "step-9": "var(--text-9)",
      "step-10": "var(--text-10)",
      "step-12": "var(--text-12)",
    },
    extend: {
      colors: {
        paper: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--fg-1)",
        "ink-2": "var(--fg-2)",
        "ink-3": "var(--fg-3)",
        rule: "var(--rule)",
        hair: "var(--border)",
        signal: "var(--red)",
        action: "var(--action)",
        "action-text": "var(--action-text)",
        "action-hover": "var(--action-hover)",
        "on-action": "var(--on-action)",
        inverse: "var(--inverse-bg)",
        "on-inverse": "var(--inverse-fg)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        poster: ["var(--font-poster)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        measure: "var(--measure)",
        container: "var(--container)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
      },
      transitionDuration: {
        instant: "var(--dur-instant)",
        quick: "var(--dur-quick)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
    },
  },
  plugins: [],
};

export default config;
