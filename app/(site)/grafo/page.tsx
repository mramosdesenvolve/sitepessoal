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

// Página guardada para uso futuro — funcional, mas fora da navegação.
export default async function GrafoPage() {
  const [objects, concepts, links] = await Promise.all([
    getObjects(),
    getConcepts(),
    getConceptLinks(),
  ]);

  return (
    <div className="h-screen flex flex-col">
      <SiteNav active="grafo" />

      <div className="wrap flex shrink-0 items-center gap-4 border-b border-hair py-3 text-ink-2">
        <span className="data">{concepts.length} conceitos</span>
        <span className="hidden sm:inline">passe o mouse para destacar</span>
        <Link href="/database" className="ml-auto text-ink hover:text-action-text">
          ver como lista
        </Link>
      </div>

      {/* mobile: o grafo de força não funciona bem ao toque (rótulos
          sobrepostos, nós pequenos demais para tocar) — em vez de
          renderizar o canvas quebrado, mostramos só o convite para a
          lista, que é a experiência real do /database em telas pequenas. */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center sm:hidden">
        <p className="m-0 max-w-[38ch] text-ink-2">
          O grafo funciona melhor com mouse — use a lista no celular.
        </p>
        <Link href="/database" className="pill">
          ver o database como lista
        </Link>
      </div>

      <div className="hidden min-h-0 flex-1 sm:flex">
        <AcervoGraph concepts={concepts} links={links} objects={objects} />
      </div>
    </div>
  );
}
