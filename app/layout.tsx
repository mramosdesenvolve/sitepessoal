import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

// Newsreader, a mesma família do site de referência: serifa de texto, 400 a
// 700, com o itálico dos subtítulos e das citações.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Estudo como a literatura pode produzir novas formas de imaginar o mundo.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0eee6" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1e1d" },
  ],
};

// Aplica o modo escolhido antes da primeira pintura. Sem escolha, nada é
// gravado e vale o modo do sistema (ver globals.css).
const modeInitScript = `try{var m=localStorage.getItem("color-mode");if(m==="light"||m==="dark")document.documentElement.dataset.colorMode=m}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={newsreader.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
