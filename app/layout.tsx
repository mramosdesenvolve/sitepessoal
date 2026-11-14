import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Jost } from "next/font/google";
import { Busca } from "@/components/site/Busca";
import "./globals.css";

// ID Pessoal: uma família, duas vozes. Jost (cartaz, herdeira da Futura),
// Archivo (títulos e corpo) e IBM Plex Mono (dados). Archivo e Jost são
// variáveis — o peso 650 do corpo existe de verdade.
const poster = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const sans = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Estudo como a literatura pode produzir novas formas de imaginar o mundo.",
};

export const viewport: Viewport = {
  themeColor: "#F2F1EE",
};

// Aplica o tema salvo antes da primeira pintura (o padrão, claro, já vem
// no HTML do servidor — este script só troca se o visitante escolheu escuro).
// Também marca que há JS: as entradas animadas só escondem o estado inicial
// quando existe script para revelá-lo (ver [data-js] em globals.css).
const themeInitScript = `document.documentElement.dataset.js="1";try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      className={`${poster.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen font-sans text-ink bg-paper">
        {children}
        <Busca />
      </body>
    </html>
  );
}
