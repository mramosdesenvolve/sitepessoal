import type { Metadata } from "next";
import { getConcepts, getObjects } from "@/lib/data";
import { AcervoClient } from "@/components/AcervoClient";
import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";

export const metadata: Metadata = {
  title: "Acervo — Marcos Ramos",
  description: "Lista completa dos objetos do site, com filtro por tipo.",
};

// objetos vêm do banco e podem ser criados a qualquer momento via /admin
export const dynamic = "force-dynamic";

export default async function AcervoPage() {
  const [objects, concepts] = await Promise.all([getObjects(), getConcepts()]);

  return (
    <div className="min-h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path="acervo.ts" />
      <TermTabs active="acervo" />

      <div className="flex-1 bg-term-inset px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-term-muted text-xs mb-1">
            // {objects.length} objetos · {concepts.length} conceitos
          </p>
          <p className="text-term-muted-2 text-xs mb-8">
            prefere navegar pelas conexões?{" "}
            <a
              href="/grafo"
              className="text-term-accent2 hover:text-term-accent no-underline border-b border-term-accent2-dim"
            >
              ver como grafo →
            </a>
          </p>
          <AcervoClient objects={objects} concepts={concepts} />
        </div>
      </div>

      <TermStatusbar left="⎇ main" right={`${objects.length} rows`} />
    </div>
  );
}
