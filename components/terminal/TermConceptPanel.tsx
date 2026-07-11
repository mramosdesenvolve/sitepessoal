"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ConceptNode, ContentObject } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface TermConceptPanelProps {
  concepts: ConceptNode[];
  objects: ContentObject[];
}

/**
 * Painel "peek definition" do grafo de conceitos — mesma lógica do
 * ObjectPreviewPanel/CubistConceptPanel (concept selecionado no store),
 * estilizado como o popup de "ir para definição" de um editor de código.
 */
export function TermConceptPanel({ concepts, objects }: TermConceptPanelProps) {
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
      className="h-full overflow-y-auto border-l border-term-line bg-term-elevated px-[22px] py-5 font-term-mono"
      aria-label={`Referências do conceito ${concept.label}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] text-term-muted mb-1">// definition</p>
          <h2 ref={headingRef} tabIndex={-1} className="text-lg font-bold text-term-accent2 m-0">
            {concept.label}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setSelectedConceptId(null)}
          aria-label="Fechar painel"
          className="text-term-muted hover:text-term-accent text-lg leading-none shrink-0"
        >
          ×
        </button>
      </div>
      {concept.description && (
        <p className="mt-2 text-xs text-term-muted leading-relaxed">{concept.description}</p>
      )}

      <div className="mt-5">
        {conceptObjects.map((o, i) => (
          <div key={o.id} className={`py-3 ${i > 0 ? "border-t border-term-line" : ""}`}>
            <p className="text-[10.5px] text-term-muted-2 m-0 mb-1">
              <span className="text-term-accent-dim">{o.type}</span> · {o.year}
            </p>
            <Link
              href={`/objeto/${o.id}`}
              className="text-[13px] text-term-ink hover:text-term-accent2 no-underline"
            >
              {o.title}
            </Link>
          </div>
        ))}
        {conceptObjects.length === 0 && (
          <p className="text-sm text-term-muted border-t border-term-line pt-3">
            Nenhum objeto deste conceito ainda.
          </p>
        )}
      </div>
    </aside>
  );
}
