"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ConceptNode, ContentObject } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface ConceptPanelProps {
  concepts: ConceptNode[];
  objects: ContentObject[];
}

/**
 * Painel lateral (não modal) do conceito selecionado no grafo — convive
 * com o grafo na tela, a exploração não é interrompida.
 */
export function ConceptPanel({ concepts, objects }: ConceptPanelProps) {
  const selectedConceptId = useAppStore((s) => s.selectedConceptId);
  const setSelectedConceptId = useAppStore((s) => s.setSelectedConceptId);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const concept = concepts.find((c) => c.id === selectedConceptId);
  const conceptObjects = concept
    ? objects.filter((o) => o.concepts.includes(concept.id)).sort((a, b) => b.year - a.year)
    : [];

  useEffect(() => {
    if (concept) headingRef.current?.focus();
  }, [concept?.id]);

  if (!concept) return null;

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className="h-full overflow-y-auto border-l border-line bg-paper px-6 py-6"
      aria-label={`Referências do conceito ${concept.label}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold m-0">
          {concept.label}
        </h2>
        <button
          type="button"
          onClick={() => setSelectedConceptId(null)}
          aria-label="Fechar painel"
          className="text-muted hover:text-ink text-lg leading-none shrink-0"
        >
          ×
        </button>
      </div>
      {concept.description && (
        <p className="mt-2 text-[13px] text-muted leading-relaxed">{concept.description}</p>
      )}

      <div className="mt-6">
        {conceptObjects.map((o, i) => (
          <div key={o.id} className={`py-3 ${i > 0 ? "border-t border-line" : ""}`}>
            <p className="text-[11px] text-muted-2 m-0 mb-1">
              {o.type} · {o.year}
            </p>
            <Link
              href={`/objeto/${o.id}`}
              className="text-[13.5px] text-ink hover:text-accent no-underline"
            >
              {o.title}
            </Link>
          </div>
        ))}
        {conceptObjects.length === 0 && (
          <p className="text-sm text-muted border-t border-line pt-3">
            Nenhum objeto deste conceito ainda.
          </p>
        )}
      </div>
    </aside>
  );
}
