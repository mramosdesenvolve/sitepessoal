import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Lora } from "next/font/google";
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

// Identidade "terminal": fontes reais em vez de depender só da pilha de
// fontes do sistema (que varia entre SO/navegador) — self-hosted pelo
// próprio next/font, sem custo de CDN externo nem flash de fonte errada.
const termMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-term-mono",
  display: "swap",
});

const termSerif = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-term-serif",
  display: "swap",
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

// Layout raiz: só html/body, fontes e o script anti-flash de tema. O
// cabeçalho/rodapé do site (nome, nav sobre/acervo, toggle de tema) vive
// em app/(site)/layout.tsx — a home ("/") fica fora desse grupo de rotas
// de propósito: é uma peça de tela única, sem chrome do site (ver
// design_handoff_homepage_acervo/README.md).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${termMono.variable} ${termSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen font-sans text-ink bg-paper">
        {children}
      </body>
    </html>
  );
}
