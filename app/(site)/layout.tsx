import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Chrome do "site institucional" (sobre, acervo, objetos, admin) — a home
 * ("/") fica fora deste grupo de rotas e não usa este layout (ver
 * app/layout.tsx e design_handoff_homepage_acervo/README.md).
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
            <nav className="flex items-center gap-4 pl-4 ml-1 border-l border-line">
              <Link
                href="/sobre"
                className="text-xs text-muted hover:text-accent transition-colors"
              >
                sobre
              </Link>
              <Link
                href="/acervo"
                className="text-xs text-muted hover:text-accent transition-colors"
              >
                acervo
              </Link>
            </nav>
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
    </>
  );
}
