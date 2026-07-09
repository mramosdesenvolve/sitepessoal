"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ConceptNode, ContentObject } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface CubistConceptPanelProps {
  concepts: ConceptNode[];
  objects: ContentObject[];
}

/**
 * Painel lateral do rizoma (ato 3) — lista os objetos do conceito
 * selecionado no grafo. Mesma lógica do ObjectPreviewPanel da home antiga,
 * só que com a identidade visual cubista (ver CubistPortraitHome).
 */
export function CubistConceptPanel({
  concepts,
  objects,
}: CubistConceptPanelProps) {
  const selectedConceptId = useAppStore((s) => s.selectedConceptId);
  const setSelectedConceptId = useAppStore((s) => s.setSelectedConceptId);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const concept = concepts.find((c) => c.id === selectedConceptId);
  const conceptObjects = concept
    ? objects
        .filter((o) => o.concepts.includes(concept.id))
        .sort((a, b) => b.year - a.year)
    : [];

  useEffect(() => {
    if (concept) headingRef.current?.focus();
  }, [concept?.id]);

  if (!concept) return null;

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className="h-full overflow-y-auto border-l border-cubist-line pl-6 font-cubist-serif"
      aria-label={`Objetos do conceito ${concept.label}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="text-xl">
            {concept.label}
          </h2>
          {concept.description && (
            <p className="mt-1 text-xs text-cubist-muted leading-relaxed font-cubist-mono">
              {concept.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setSelectedConceptId(null)}
          aria-label="Fechar painel"
          className="text-cubist-muted hover:text-cubist-accent text-lg leading-none"
        >
          ×
        </button>
      </div>

      <ul className="mt-5 space-y-4">
        {conceptObjects.map((o) => (
          <li key={o.id} className="border-t border-cubist-line pt-4">
            <Link href={`/objeto/${o.id}`} className="group block">
              <div className="flex flex-wrap items-center gap-2 mb-1.5 font-cubist-mono text-[11px] uppercase tracking-wide text-cubist-muted">
                <span className="border border-cubist-line px-2 py-0.5">
                  {o.type}
                </span>
                <span>{o.year}</span>
              </div>
              <h3 className="text-base leading-snug group-hover:text-cubist-accent transition-colors">
                {o.title}
              </h3>
              <p className="mt-1 text-xs text-cubist-muted leading-relaxed">
                {o.shortDescription}
              </p>
            </Link>
          </li>
        ))}
        {conceptObjects.length === 0 && (
          <li className="border-t border-cubist-line pt-4 text-sm text-cubist-muted">
            Nenhum objeto deste conceito ainda.
          </li>
        )}
      </ul>
    </aside>
  );
}
