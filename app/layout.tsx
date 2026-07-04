import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

// "Neue Augenblick" é uma fonte paga/licenciada, sem alternativa gratuita
// exata — Space Grotesk é a grotesca geométrica gratuita mais próxima do
// mesmo espírito contemporâneo. Duas instâncias, cada uma travada num
// único peso: assim as classes font-serif/font-sans (usadas em todo o
// código) continuam funcionando sem precisar de font-bold em cada uso —
// o peso 700 é a única face registrada nessa variável, então é o único
// que o navegador pode escolher.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-display",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
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
      className={`${display.variable} ${body.variable}`}
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
