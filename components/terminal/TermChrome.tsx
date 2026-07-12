import Link from "next/link";

/**
 * Peças de moldura compartilhadas da identidade "terminal" (editor de
 * código) — usadas em toda página que adota essa identidade (home,
 * acervo, sobre, objeto). Ver conversa de origem / mockups para o
 * conceito completo: barra de título + abas de arquivo + status bar.
 */

export function TermTitlebar({
  path,
  badge,
}: {
  path: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-[9px] bg-term-elevated border-b border-term-line shrink-0">
      <div className="flex gap-[7px] shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-term-muted-2" />
        <span className="w-2.5 h-2.5 rounded-full bg-term-muted-2" />
        <span className="w-2.5 h-2.5 rounded-full bg-term-muted-2" />
      </div>
      <div className="flex-1 text-center text-xs text-term-muted truncate">
        <Link href="/" className="text-term-ink font-medium no-underline hover:text-term-accent2">
          marcos
        </Link>{" "}
        — {path}
      </div>
      <div className="w-[70px] shrink-0 flex justify-end">
        {badge && (
          <span className="text-[10.5px] text-term-accent2 border border-term-accent2-dim rounded px-1.5 py-px tracking-wide">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export type TermTabKey = "sobre" | "database" | "grafo" | "contato";

const TABS: { key: TermTabKey; label: string; ext: string; href: string }[] = [
  { key: "sobre", label: "sobre", ext: ".md", href: "/sobre" },
  { key: "database", label: "database", ext: ".ts", href: "/database" },
  { key: "grafo", label: "grafo", ext: ".ts", href: "/grafo" },
  { key: "contato", label: "contato", ext: ".sh", href: "/contato" },
];

export function TermTabs({ active }: { active: TermTabKey | null }) {
  return (
    <div className="flex bg-term-elevated border-b border-term-line shrink-0 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const className = `flex items-center gap-2 px-[18px] py-2.5 text-[12.5px] border-r border-term-line whitespace-nowrap select-none no-underline transition-colors ${
          isActive
            ? "text-term-ink bg-term-inset shadow-[inset_0_-2px_0_var(--tw-shadow-color)] shadow-term-accent2"
            : "text-term-muted hover:text-term-ink"
        }`;
        return (
          <Link key={tab.key} href={tab.href} className={className}>
            {tab.label}
            <span className="text-term-muted-2">{tab.ext}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function TermStatusbar({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div className="flex justify-between px-4 py-[5px] bg-term-accent2-dim text-term-bg text-[10.5px] tracking-wide shrink-0">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

export function TermBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <div className="flex items-center gap-[7px] px-[22px] py-2 bg-term-inset border-b border-term-line text-[11.5px] text-term-muted shrink-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-[7px]">
          {i > 0 && <span className="text-term-muted-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-term-muted hover:text-term-accent2 no-underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-term-ink">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
