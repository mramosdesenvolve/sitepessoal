import type { Metadata } from "next";
import Link from "next/link";
import { getConcepts, getConceptLinks, getObjects } from "@/lib/data";
import { AcervoGraph } from "@/components/AcervoGraph";
import { SiteNav } from "@/components/site/SiteNav";

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
    <div className="h-screen flex flex-col">
      <SiteNav active="grafo" />

      <div className="flex items-center gap-2.5 py-2.5 px-[6vw] border-b border-line text-[12px] text-muted shrink-0">
        <span>{concepts.length} conceitos</span>
        <span className="text-muted-2">·</span>
        <span className="hidden sm:inline">hover para destacar</span>
        <Link
          href="/database"
          className="ml-auto text-ink hover:text-accent no-underline border-b border-line"
        >
          ← ver como lista
        </Link>
      </div>

      {/* mobile: o grafo de força não funciona bem ao toque (rótulos
          sobrepostos, nós pequenos demais para tocar) — em vez de
          renderizar o canvas quebrado, mostramos só o convite para a
          lista, que é a experiência real do /database em telas pequenas. */}
      <div className="sm:hidden flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="text-muted text-[13px] max-w-[38ch]">
          Grafo funciona melhor com mouse — use a lista no celular
        </p>
        <Link
          href="/database"
          className="border border-line px-5 py-2 text-sm no-underline text-ink hover:border-ink transition-colors"
        >
          Ver database como lista →
        </Link>
      </div>

      <div className="hidden sm:flex flex-1 min-h-0">
        <AcervoGraph concepts={concepts} links={links} objects={objects} />
      </div>
    </div>
  );
}
