import Link from "next/link";

export type SiteSection =
  | "database"
  | "sistemas"
  | "grafo"
  | "sobre"
  | "contato"
  | null;

// "grafo" fica de fora da navegação por ora (guardado para uso futuro —
// ver app/(site)/grafo/, ainda funcional, só não linkado daqui).
const LINKS: { key: SiteSection; label: string; href: string }[] = [
  { key: "database", label: "database", href: "/database" },
  { key: "sistemas", label: "portfólio", href: "/sistemas" },
  { key: "sobre", label: "sobre", href: "/sobre" },
  { key: "contato", label: "contato", href: "/contato" },
];

/**
 * Cabeçalho compartilhado — nome em voz de cartaz, rótulos em caixa-baixa e um
 * fio preto de 1px por baixo. Substitui a barra anterior em todas as
 * páginas.
 */
export function SiteNav({ active }: { active: SiteSection }) {
  return (
    <header className="border-b border-rule">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
        <Link
          href="/"
          aria-label="marcos ramos — início"
          className="poster text-step-2 text-ink no-underline hover:text-ink"
        >
          marcos ramos
        </Link>

        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2" aria-label="Navegação principal">
          {LINKS.map((link) => {
            const current = active === link.key;
            return (
              <Link
                key={link.key}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`text-step-0 no-underline transition-colors duration-quick ${
                  current
                    ? "strong text-ink underline underline-offset-[0.35em]"
                    : "text-ink-2 hover:text-action-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
