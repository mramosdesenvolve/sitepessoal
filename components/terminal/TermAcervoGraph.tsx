"use client";

import { useAppStore } from "@/store/useAppStore";
import { RhizomeGraph } from "@/components/RhizomeGraph";
import { TermConceptPanel } from "./TermConceptPanel";
import type { GraphPalette } from "@/components/ConceptNode";
import type { ConceptNode, ContentObject } from "@/types";
import type { ConceptLink } from "@/lib/data";

const TERM_MONO =
  'ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", "Fira Code", Menlo, Consolas, "Liberation Mono", monospace';

const termPalette: GraphPalette = {
  paper: "#10121a",
  ink: "#dfe2e8",
  accent: "#6fd3b8",
  muted: "rgba(223, 226, 232, 0.5)",
  line: "#3d4351",
  lineDim: "rgba(61, 67, 81, 0.35)",
  nodeFont: TERM_MONO,
};

/**
 * Grafo de conceitos do acervo — identidade "terminal" (import graph).
 * Reusa o RhizomeGraph real (mesma física/dados de sempre), só troca a
 * paleta e o painel lateral pelo "peek definition" novo.
 */
export function TermAcervoGraph({
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
    <div className="flex-1 flex min-h-0 bg-term-inset">
      <div className="flex-1 min-w-0">
        <RhizomeGraph
          concepts={concepts}
          links={links}
          matchedObjectIds={null}
          palette={termPalette}
          centerOffsetX={0}
          zoomPadding={40}
          chargeStrength={-900}
          linkDistance={130}
        />
      </div>
      {selectedConceptId && (
        <div className="w-[340px] shrink-0">
          <TermConceptPanel concepts={concepts} objects={objects} />
        </div>
      )}
    </div>
  );
}
