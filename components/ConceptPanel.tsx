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
      className="h-full overflow-y-auto border-l border-rule bg-surface px-6 py-6"
      aria-label={`Referências do conceito ${concept.label}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 ref={headingRef} tabIndex={-1} className="title m-0 text-step-3">
          {concept.label}
        </h2>
        <button
          type="button"
          onClick={() => setSelectedConceptId(null)}
          className="pill shrink-0"
        >
          fechar
        </button>
      </div>
      {concept.description && (
        <p className="mb-0 mt-3 text-ink-2">{concept.description}</p>
      )}

      <div className="mt-6">
        {conceptObjects.map((o) => (
          <div key={o.id} className="border-t border-hair py-3">
            <p className="data m-0 mb-1">
              {o.type} · {o.year}
            </p>
            <Link href={`/objeto/${o.id}`} className="text-ink no-underline hover:text-action-text">
              {o.title}
            </Link>
          </div>
        ))}
        {conceptObjects.length === 0 && (
          <p className="border-t border-hair pt-3 text-ink-2">
            Nenhum objeto deste conceito ainda.
          </p>
        )}
      </div>
    </aside>
  );
}
