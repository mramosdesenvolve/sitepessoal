"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ConceptNode, ContentObject } from "@/types";
import { READ_TYPES } from "@/types";
import { MetaChip } from "./TagSystem";

interface EditorialListProps {
  objects: ContentObject[];
  concepts: ConceptNode[];
  matchedObjectIds: Set<string> | null;
  selectedConceptId: string | null;
}

/**
 * Modo Ler: lista editorial de artigos, ensaios, papers, livros e palestras.
 * Mesmos dados do grafo, reorganizados para leitura — tipografia em primeiro
 * plano, ordenação cronológica inversa.
 */
export function EditorialList({
  objects,
  concepts,
  matchedObjectIds,
  selectedConceptId,
}: EditorialListProps) {
  const conceptLabel = new Map(concepts.map((c) => [c.id, c.label]));

  const items = objects
    .filter((o) => READ_TYPES.includes(o.type))
    .filter((o) => !matchedObjectIds || matchedObjectIds.has(o.id))
    .filter((o) => !selectedConceptId || o.concepts.includes(selectedConceptId))
    .sort((a, b) => b.year - a.year);

  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Nenhum texto encontrado para esta busca.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      {items.map((o, i) => (
        <motion.article
          key={o.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="border-t border-line py-6 first:border-t-0"
        >
          <Link href={`/objeto/${o.id}`} className="group block">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <MetaChip>{o.type}</MetaChip>
              <span className="text-xs text-muted">{o.year}</span>
              {o.featured && (
                <span className="text-xs text-accent">● destaque</span>
              )}
            </div>
            <h2 className="mt-2 font-serif text-xl md:text-2xl leading-snug group-hover:text-accent transition-colors">
              {o.title}
            </h2>
            <p className="mt-2 text-sm text-muted leading-relaxed max-w-prose">
              {o.shortDescription}
            </p>
            <p className="mt-2 text-xs text-accent/80">
              {o.concepts
                .map((cid) => conceptLabel.get(cid) ?? cid)
                .join(" · ")}
            </p>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
