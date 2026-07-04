"use client";

import { useEffect } from "react";
import type { ConceptNode, ContentObject } from "@/types";
import type { ConceptLink } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import { useSearch } from "@/lib/useSearch";
import { SearchSemanticMock } from "./SearchSemanticMock";
import { RhizomeGraph } from "./RhizomeGraph";
import { ObjectPreviewPanel } from "./ObjectPreviewPanel";
import { SearchResultsPanel } from "./SearchResultsPanel";
import { ConceptAccordion } from "./ConceptAccordion";
import { PortraitPhoto } from "./PortraitPhoto";

interface HomeClientProps {
  concepts: ConceptNode[];
  objects: ContentObject[];
  links: ConceptLink[];
  /** conceito pré-selecionado via ?conceito= (tags nas páginas de detalhe) */
  initialConceptId?: string;
}

/**
 * Home: apenas busca + grafo de conceitos. Os dados chegam prontos do
 * servidor (page.tsx) — nenhum componente faz fetch próprio.
 */
export function HomeClient({
  concepts,
  objects,
  links,
  initialConceptId,
}: HomeClientProps) {
  const selectedConceptId = useAppStore((s) => s.selectedConceptId);
  const setSelectedConceptId = useAppStore((s) => s.setSelectedConceptId);
  const { query, matchedObjectIds, rankedObjectIds } = useSearch(
    objects,
    concepts
  );

  // busca ativa sem conceito selecionado: sem um conceito para filtrar,
  // o grafo sozinho só esmaece nós — o painel de resultados é a única
  // forma de ver os objetos que bateram com a busca.
  const showSearchResults = !selectedConceptId && rankedObjectIds !== null;

  useEffect(() => {
    if (initialConceptId) setSelectedConceptId(initialConceptId);
  }, [initialConceptId, setSelectedConceptId]);

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 pt-10 pb-8">
      <div className="flex justify-end">
        <SearchSemanticMock />
      </div>

      <div className="mt-6">
        {/* desktop: retrato + grafo + painel lateral */}
        <div
          className={`hidden md:grid gap-6 ${
            selectedConceptId || showSearchResults
              ? "md:grid-cols-[auto_minmax(0,3fr)_minmax(0,2fr)]"
              : "md:grid-cols-[auto_minmax(0,1fr)]"
          }`}
        >
          <PortraitPhoto />
          <RhizomeGraph
            concepts={concepts}
            links={links}
            matchedObjectIds={matchedObjectIds}
          />
          {selectedConceptId ? (
            <div className="h-[560px]">
              <ObjectPreviewPanel
                concepts={concepts}
                objects={objects}
                matchedObjectIds={matchedObjectIds}
              />
            </div>
          ) : (
            showSearchResults && (
              <div className="h-[560px]">
                <SearchResultsPanel
                  query={query}
                  objects={objects}
                  concepts={concepts}
                  rankedObjectIds={rankedObjectIds ?? []}
                />
              </div>
            )
          )}
        </div>
        {/* mobile: o grafo de força não funciona bem para toque */}
        <div className="md:hidden">
          <ConceptAccordion
            concepts={concepts}
            objects={objects}
            query={query}
            matchedObjectIds={matchedObjectIds}
            rankedObjectIds={rankedObjectIds}
          />
        </div>
      </div>
    </section>
  );
}
