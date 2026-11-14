import { Arrow } from "@/components/brand/Arrow";
import { ThemeToggle } from "@/components/site/ThemeToggle";

/** Rodapé compartilhado: fio, crédito, alternador de tema e o PDF do currículo. */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule mt-24">
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-8">
        <span className="data">
          Desenvolvido por Marcos Ramos em 2026 na Base 73
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />
          <a href="/api/curriculo" className="pill">
            currículo em pdf
            <Arrow dir="down" />
          </a>
        </div>
      </div>
    </footer>
  );
}
