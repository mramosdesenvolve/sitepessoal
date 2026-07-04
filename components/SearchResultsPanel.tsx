"use client";

import Link from "next/link";
import type { ConceptNode, ContentObject } from "@/types";
import { MetaChip } from "./TagSystem";

interface SearchResultsPanelProps {
  query: string;
  objects: ContentObject[];
  concepts: ConceptNode[];
  /** ids em ordem de relevância — ver lib/useSearch.ts */
  rankedObjectIds: string[];
  /**
   * true (padrão): preenche a altura do contêiner pai com rolagem própria
   * — usado no desktop, dentro de uma coluna de altura fixa ao lado do
   * grafo. false: altura natural do conteúdo — usado no acordeão mobile,
   * que não tem um contêiner de altura fixa e já rola a página inteira.
   */
  constrainHeight?: boolean;
}

/**
 * Lista os objetos que casam com a busca quando nenhum conceito está
 * selecionado no grafo. Sem isso, a busca só esmaecia nós no grafo — ver
 * um resultado exigia primeiro clicar num nó não-esmaecido.
 */
export function SearchResultsPanel({
  query,
  objects,
  concepts,
  rankedObjectIds,
  constrainHeight = true,
}: SearchResultsPanelProps) {
  const conceptLabel = new Map(concepts.map((c) => [c.id, c.label]));
  const byId = new Map(objects.map((o) => [o.id, o]));
  const results = rankedObjectIds
    .map((id) => byId.get(id))
    .filter((o): o is ContentObject => !!o);

  return (
    <aside
      className={`border border-line rounded-md p-5 bg-paper ${
        constrainHeight ? "h-full overflow-y-auto" : ""
      }`}
      aria-label={`Resultados da busca por ${query}`}
    >
      <h2 className="font-serif text-xl">
        {results.length} resultado{results.length === 1 ? "" : "s"} para “
        {query}”
      </h2>

      <ul className="mt-5 space-y-4">
        {results.map((o) => (
          <li key={o.id} className="border-t border-line pt-4">
            <Link href={`/objeto/${o.id}`} className="group block">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <MetaChip>{o.type}</MetaChip>
                <span className="text-[11px] text-muted">{o.year}</span>
              </div>
              <h3 className="font-serif text-base leading-snug group-hover:text-accent transition-colors">
                {o.title}
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                {o.shortDescription}
              </p>
              <p className="mt-1 text-[11px] text-accent/80">
                {o.concepts
                  .map((cid) => conceptLabel.get(cid) ?? cid)
                  .join(" · ")}
              </p>
            </Link>
          </li>
        ))}
        {results.length === 0 && (
          <li className="border-t border-line pt-4 text-sm text-muted">
            Nenhum objeto encontrado para esta busca.
          </li>
        )}
      </ul>
    </aside>
  );
}
