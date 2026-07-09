import { garamond, plexMono } from "@/lib/fonts";

/**
 * Chrome compartilhado das páginas de conteúdo com a identidade "cubista"
 * (retrato → xadrez → rizoma, ver design_handoff_homepage_acervo/README.md):
 * acervo, sobre, objeto. Sem header/footer do site — cada página traz seu
 * próprio <CubistCornerNav>. A home ("/") fica fora deste grupo porque tem
 * estrutura própria (palco de tela cheia, não uma página rolável comum).
 */
export default function CubistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${garamond.variable} ${plexMono.variable} min-h-screen bg-cubist-bg text-cubist-ink font-cubist-serif`}
    >
      {children}
    </div>
  );
}
