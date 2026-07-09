import { EB_Garamond, IBM_Plex_Mono } from "next/font/google";

/**
 * Fontes da identidade visual "cubista" (retrato → xadrez → rizoma, ver
 * design_handoff_homepage_acervo/README.md) — usadas na home e em
 * qualquer outra página que adote essa mesma identidade (ex. /acervo).
 * Centralizadas aqui para next/font não gerar instâncias/hashes
 * duplicados entre os componentes que as importam.
 */
export const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
