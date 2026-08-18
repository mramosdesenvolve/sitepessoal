"use client";

import { useAppStore } from "@/store/useAppStore";
import { RhizomeGraph } from "@/components/RhizomeGraph";
import { ConceptPanel } from "./ConceptPanel";
import type { ConceptNode, ContentObject } from "@/types";
import type { ConceptLink } from "@/lib/data";

/**
 * Grafo de conceitos do database — física/dados de sempre (RhizomeGraph),
 * com o painel lateral de "objetos deste conceito" ao lado.
 */
export function AcervoGraph({
  concepts,
  links,
  objects,
}: {
  concepts: ConceptNode[];
  links: ConceptLink[];
  objects: ContentObject[];
}) {
  const selectedConceptId = useAppStore((s) => s.selectedConceptId);

  return (
    <div className="flex-1 flex min-h-0 bg-paper">
      <div className="flex-1 min-w-0">
        <RhizomeGraph
          concepts={concepts}
          links={links}
          matchedObjectIds={null}
          centerOffsetX={0}
          zoomPadding={48}
          chargeStrength={-260}
          linkDistance={90}
        />
      </div>
      {selectedConceptId && (
        <div className="w-[340px] shrink-0">
          <ConceptPanel concepts={concepts} objects={objects} />
        </div>
      )}
    </div>
  );
}
