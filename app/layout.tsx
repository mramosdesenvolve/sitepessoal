import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

// Serifada editorial para títulos e frases-âncora
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

// Sans neutra para corpo de texto e UI
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Marcos Ramos — interface de pensamento",
  description:
    "Investigo como cultura, tecnologia e aprendizagem produzem novas formas de imaginar o mundo.",
};

// Aplica a classe `dark` em <html> antes do primeiro paint, lendo a
// preferência salva ou o esquema de cores do sistema — evita o flash de
// tema errado que apareceria se essa decisão só rodasse depois do React
// hidratar. Roda sincronamente porque é um <script> comum (sem defer/async).
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var isDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen font-sans text-ink bg-paper">
        <header className="border-b border-line">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-4 flex items-center justify-between">
            <Link
              href="/sobre"
              className="font-serif text-lg tracking-tight hover:text-accent transition-colors"
            >
              Marcos Ramos
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted hidden sm:block">
                pesquisa · educação · cultura · tecnologia
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>
        {children}
        <footer className="border-t border-line mt-16">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-6 flex flex-wrap gap-x-8 gap-y-2 items-baseline justify-between text-xs text-muted">
            <span>© {new Date().getFullYear()} Marcos Ramos</span>
            <span>
              versão experimental — conteúdos placeholder, em substituição
              gradual
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
