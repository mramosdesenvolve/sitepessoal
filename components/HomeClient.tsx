"use client";

import { useEffect } from "react";
import type { ConceptNode, ContentObject } from "@/types";
import type { ConceptLink } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import { useSearch } from "@/lib/useSearch";
import { SearchSemanticMock } from "./SearchSemanticMock";
import { RhizomeGraph } from "./RhizomeGraph";
import { ObjectPreviewPanel } from "./ObjectPreviewPanel";
import { ConceptAccordion } from "./ConceptAccordion";

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
  const { matchedObjectIds } = useSearch(objects, concepts);

  useEffect(() => {
    if (initialConceptId) setSelectedConceptId(initialConceptId);
  }, [initialConceptId, setSelectedConceptId]);

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 pt-10 pb-8">
      <div className="flex justify-end">
        <SearchSemanticMock />
      </div>

      <div className="mt-6">
        {/* desktop: grafo + painel lateral */}
        <div
          className={`hidden md:grid gap-6 ${
            selectedConceptId
              ? "md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
              : "md:grid-cols-1"
          }`}
        >
          <RhizomeGraph
            concepts={concepts}
            links={links}
            matchedObjectIds={matchedObjectIds}
          />
          {selectedConceptId && (
            <div className="h-[560px]">
              <ObjectPreviewPanel
                concepts={concepts}
                objects={objects}
                matchedObjectIds={matchedObjectIds}
              />
            </div>
          )}
        </div>
        {/* mobile: o grafo de força não funciona bem para toque */}
        <div className="md:hidden">
          <ConceptAccordion
            concepts={concepts}
            objects={objects}
            matchedObjectIds={matchedObjectIds}
          />
        </div>
      </div>
    </section>
  );
}
