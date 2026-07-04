"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ConceptNode, ContentObject, ObjectType } from "@/types";
import { BUILD_TYPES } from "@/types";
import { MetaChip } from "./TagSystem";

interface BuildArchiveProps {
  objects: ContentObject[];
  concepts: ConceptNode[];
  matchedObjectIds: Set<string> | null;
  selectedConceptId: string | null;
}

const TYPE_LABELS: Partial<Record<ObjectType, string>> = {
  ferramenta: "ferramentas",
  software: "software",
  curriculo: "currículos",
  metodologia: "metodologias",
  consultoria: "consultorias",
  projeto: "projetos",
  curso: "cursos",
};

/**
 * Modo Construir: arquivo do que é aplicado — ferramentas, software,
 * currículos, metodologias, consultorias, projetos e cursos, agrupados
 * por tipo. Mesmos dados, outra organização.
 */
export function BuildArchive({
  objects,
  concepts,
  matchedObjectIds,
  selectedConceptId,
}: BuildArchiveProps) {
  const conceptLabel = new Map(concepts.map((c) => [c.id, c.label]));

  const visible = objects
    .filter((o) => BUILD_TYPES.includes(o.type))
    .filter((o) => !matchedObjectIds || matchedObjectIds.has(o.id))
    .filter((o) => !selectedConceptId || o.concepts.includes(selectedConceptId));

  const groups = BUILD_TYPES.map((type) => ({
    type,
    items: visible
      .filter((o) => o.type === type)
      .sort((a, b) => b.year - a.year),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Nenhum objeto encontrado para esta busca.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.type}>
          <h2 className="text-xs uppercase tracking-widest text-muted border-b border-line pb-2">
            {TYPE_LABELS[group.type] ?? group.type}
          </h2>
          <ul>
            {group.items.map((o, i) => (
              <motion.li
                key={o.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="border-b border-line"
              >
                <Link
                  href={`/objeto/${o.id}`}
                  className="group grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-x-6 gap-y-1 py-4 items-baseline"
                >
                  <h3 className="font-serif text-lg leading-snug group-hover:text-accent transition-colors">
                    {o.title}
                    {o.featured && (
                      <span className="ml-2 text-xs text-accent align-middle">
                        ●
                      </span>
                    )}
                  </h3>
                  <p className="hidden md:block text-sm text-muted leading-relaxed">
                    {o.shortDescription}
                    <span className="block mt-0.5 text-xs text-accent/80">
                      {o.concepts
                        .map((cid) => conceptLabel.get(cid) ?? cid)
                        .join(" · ")}
                    </span>
                  </p>
                  <div className="flex items-baseline gap-2 justify-self-end">
                    <span className="text-xs text-muted">{o.year}</span>
                    <MetaChip>{o.status}</MetaChip>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
