import type { Metadata } from "next";
import { getConcepts, getConceptLinks, getObjects } from "@/lib/data";
import { TermAcervoGraph } from "@/components/terminal/TermAcervoGraph";
import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";

export const metadata: Metadata = {
  title: "Grafo — Marcos Ramos",
  description: "Grafo de conceitos do database — relações entre temas, textos e projetos.",
};

// objetos vêm do banco e podem ser criados a qualquer momento via /admin
export const dynamic = "force-dynamic";

export default async function GrafoPage() {
  const [objects, concepts, links] = await Promise.all([
    getObjects(),
    getConcepts(),
    getConceptLinks(),
  ]);

  return (
    <div className="h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path="grafo.ts" />
      <TermTabs active="grafo" />

      <div className="flex items-center gap-2.5 px-[18px] py-[7px] bg-term-inset border-b border-term-line text-[11.5px] text-term-muted shrink-0">
        <span>import graph</span>
        <span className="text-term-muted-2">·</span>
        <span>{concepts.length} concepts</span>
        <span className="text-term-muted-2">·</span>
        <span className="hidden sm:inline">hover para destacar</span>
        <span className="ml-auto">
          <a
            href="/database"
            className="text-term-accent2 hover:text-term-accent no-underline border-b border-term-accent2-dim"
          >
            ← ver como lista
          </a>
        </span>
      </div>

      {/* mobile: o grafo de força não funciona bem ao toque (rótulos
          sobrepostos, nós pequenos demais para tocar) — em vez de
          renderizar o canvas quebrado, mostramos só o convite para a
          lista, que é a experiência real do /database em telas pequenas. */}
      <div className="sm:hidden flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="text-term-muted text-[13px] max-w-[38ch]">
          // grafo funciona melhor com mouse — use a lista no celular
        </p>
        <a
          href="/database"
          className="border border-term-accent2-dim bg-term-accent2/10 text-term-accent2 px-5 py-2 text-sm no-underline hover:bg-term-accent2/20 transition-colors"
        >
          ver database como lista →
        </a>
      </div>

      <div className="hidden sm:flex flex-1 min-h-0">
        <TermAcervoGraph concepts={concepts} links={links} objects={objects} />
      </div>

      <div className="hidden md:block border-t border-term-line bg-term-elevated px-[18px] py-3 shrink-0">
        <p className="text-[13px] m-0">
          <span className="text-term-accent2">marcos@ramos</span>
          <span className="text-term-muted">:</span>
          <span className="text-term-accent">grafo</span>
          <span className="text-term-muted">$</span> grep -rl{" "}
          <span className="text-term-accent">&quot;*&quot;</span> .
          <span className="term-cursor inline-block w-[7px] h-[15px] bg-term-accent2 align-[-3px] ml-1" />
        </p>
      </div>

      <TermStatusbar left="⎇ main" right="TypeScript · force-directed" />
    </div>
  );
}
