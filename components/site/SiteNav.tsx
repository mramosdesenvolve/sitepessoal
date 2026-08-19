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
  { key: "database", label: "Database", href: "/database" },
  { key: "sistemas", label: "Portfólio", href: "/sistemas" },
  { key: "sobre", label: "Sobre", href: "/sobre" },
  { key: "contato", label: "Contato", href: "/contato" },
];

/**
 * Barra de navegação compartilhada — nome + seções, separados por
 * divisória fina. Substitui a antiga moldura "terminal" (titlebar/abas/
 * status bar) em todas as páginas.
 */
export function SiteNav({ active }: { active: SiteSection }) {
  return (
    <div className="flex items-center gap-7 py-4 px-[6vw] border-b border-line flex-wrap">
      <Link href="/" className="text-[13px] font-semibold text-ink no-underline shrink-0">
        Marcos Ramos
      </Link>
      <nav className="flex items-center gap-6 flex-wrap" aria-label="Navegação principal">
        {LINKS.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            aria-current={active === link.key ? "page" : undefined}
            className={`text-[13px] no-underline transition-colors ${
              active === link.key
                ? "text-ink font-medium"
                : "text-muted hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
