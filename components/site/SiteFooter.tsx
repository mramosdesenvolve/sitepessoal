/**
 * Rodapé compartilhado — substitui a antiga status bar "terminal" em
 * todas as páginas.
 */
export function SiteFooter() {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-[6vw] border-t border-line text-[12px] text-muted-2">
      <span>© {new Date().getFullYear()} Marcos Ramos</span>
      <a href="/api/curriculo" className="text-muted-2 hover:text-ink no-underline">
        Currículo em PDF ↓
      </a>
    </div>
  );
}
