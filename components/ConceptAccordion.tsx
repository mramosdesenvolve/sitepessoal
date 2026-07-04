"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { ConceptNode, ContentObject } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { MetaChip } from "./TagSystem";

interface ConceptAccordionProps {
  concepts: ConceptNode[];
  objects: ContentObject[];
  matchedObjectIds: Set<string> | null;
}

/**
 * Substituto do grafo abaixo do breakpoint `md`: o grafo de força não
 * funciona bem para toque. Chips de conceito roláveis horizontalmente +
 * lista dos objetos do conceito selecionado — mesma lógica de filtro,
 * outra forma.
 */
export function ConceptAccordion({
  concepts,
  objects,
  matchedObjectIds,
}: ConceptAccordionProps) {
  const selectedConceptId = useAppStore((s) => s.selectedConceptId);
  const setSelectedConceptId = useAppStore((s) => s.setSelectedConceptId);

  // com busca ativa, esmaece conceitos sem objetos correspondentes
  const isConceptActive = (c: ConceptNode) =>
    !matchedObjectIds || c.objectIds.some((id) => matchedObjectIds.has(id));

  const selected = concepts.find((c) => c.id === selectedConceptId);
  const selectedObjects = selected
    ? objects
        .filter((o) => o.concepts.includes(selected.id))
        .filter((o) => !matchedObjectIds || matchedObjectIds.has(o.id))
        .sort((a, b) => b.year - a.year)
    : [];

  return (
    <div>
      <div
        className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5"
        role="listbox"
        aria-label="Conceitos"
      >
        {concepts
          .slice()
          .sort((a, b) => b.objectIds.length - a.objectIds.length)
          .map((c) => {
            const active = selectedConceptId === c.id;
            return (
              <button
                key={c.id}
                role="option"
                aria-selected={active}
                onClick={() => setSelectedConceptId(active ? null : c.id)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-accent bg-accent text-paper"
                    : isConceptActive(c)
                    ? "border-line text-ink hover:border-accent hover:text-accent"
                    : "border-line text-muted opacity-40"
                }`}
              >
                {c.label}
                <span className="ml-1.5 text-[10px] opacity-70">
                  {c.objectIds.length}
                </span>
              </button>
            );
          })}
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.ul
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4"
          >
            {selected.description && (
              <li className="text-xs text-muted leading-relaxed">
                {selected.description}
              </li>
            )}
            {selectedObjects.map((o) => (
              <li key={o.id} className="border-t border-line pt-4">
                <Link href={`/objeto/${o.id}`} className="group block">
                  <div className="flex items-center gap-2 mb-1">
                    <MetaChip>{o.type}</MetaChip>
                    <span className="text-[11px] text-muted">{o.year}</span>
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
            {selectedObjects.length === 0 && (
              <li className="border-t border-line pt-4 text-sm text-muted">
                Nenhum objeto deste conceito corresponde à busca atual.
              </li>
            )}
          </motion.ul>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-muted"
          >
            Toque em um conceito para ver os objetos conectados a ele.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
