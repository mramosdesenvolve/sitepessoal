"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ConceptNode, ContentObject } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { MetaChip } from "./TagSystem";

interface ObjectPreviewPanelProps {
  concepts: ConceptNode[];
  objects: ContentObject[];
  matchedObjectIds: Set<string> | null;
}

/**
 * Painel lateral (não modal) que lista os objetos do conceito selecionado
 * no grafo. Convive com o grafo na tela — a exploração não é interrompida.
 */
export function ObjectPreviewPanel({
  concepts,
  objects,
  matchedObjectIds,
}: ObjectPreviewPanelProps) {
  const selectedConceptId = useAppStore((s) => s.selectedConceptId);
  const setSelectedConceptId = useAppStore((s) => s.setSelectedConceptId);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const concept = concepts.find((c) => c.id === selectedConceptId);
  const conceptObjects = concept
    ? objects
        .filter((o) => o.concepts.includes(concept.id))
        .filter((o) => !matchedObjectIds || matchedObjectIds.has(o.id))
        .sort((a, b) => b.year - a.year)
    : [];

  // Move o foco para o painel assim que um conceito é selecionado — sem
  // isso, quem navega por teclado (via os botões ocultos do grafo) teria
  // que tabular por todos os outros conceitos antes de alcançar o painel
  // que acabou de abrir.
  useEffect(() => {
    if (concept) headingRef.current?.focus();
  }, [concept?.id]);

  return (
    <AnimatePresence>
      {concept && (
        <motion.aside
          key={concept.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="border border-line rounded-md p-5 bg-paper h-full overflow-y-auto"
          aria-label={`Objetos do conceito ${concept.label}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="font-serif text-xl"
              >
                {concept.label}
              </h2>
              {concept.description && (
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  {concept.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedConceptId(null)}
              aria-label="Fechar painel"
              className="text-muted hover:text-accent text-lg leading-none"
            >
              ×
            </button>
          </div>

          <ul className="mt-5 space-y-4">
            {conceptObjects.map((o) => (
              <li key={o.id} className="border-t border-line pt-4">
                <Link href={`/objeto/${o.id}`} className="group block">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <MetaChip>{o.type}</MetaChip>
                    <span className="text-[11px] text-muted">{o.year}</span>
                    {o.featured && (
                      <span className="text-[11px] text-accent">
                        ● destaque
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base leading-snug group-hover:text-accent transition-colors">
                    {o.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    {o.shortDescription}
                  </p>
                </Link>
              </li>
            ))}
            {conceptObjects.length === 0 && (
              <li className="border-t border-line pt-4 text-sm text-muted">
                Nenhum objeto deste conceito corresponde à busca atual.
              </li>
            )}
          </ul>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
