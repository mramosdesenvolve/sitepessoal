import Link from "next/link";
import type { ConceptNode, ContentObject } from "@/types";

/** Rótulo de tipo/status — linha fina, sem preenchimento. */
export function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-line rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-muted">
      {children}
    </span>
  );
}

interface TagSystemProps {
  object: ContentObject;
  concepts: ConceptNode[];
  /** quando true, tags de conceito viram links para a home filtrada */
  linkConcepts?: boolean;
}

/**
 * Sistema de tags de um objeto: tipo, ano, status e conceitos relacionados.
 * As tags de conceito levam de volta ao grafo com o conceito pré-selecionado.
 */
export function TagSystem({ object, concepts, linkConcepts = true }: TagSystemProps) {
  const objectConcepts = concepts.filter((c) => object.concepts.includes(c.id));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MetaChip>{object.type}</MetaChip>
      <MetaChip>{object.year}</MetaChip>
      <MetaChip>{object.status}</MetaChip>
      {objectConcepts.map((c) =>
        linkConcepts ? (
          <Link
            key={c.id}
            href={`/?conceito=${c.id}`}
            title={c.description}
            className="inline-block rounded-full px-2.5 py-0.5 text-[11px] tracking-wide border border-accent/40 text-accent hover:bg-accent-soft transition-colors"
          >
            {c.label}
          </Link>
        ) : (
          <span
            key={c.id}
            title={c.description}
            className="inline-block rounded-full px-2.5 py-0.5 text-[11px] tracking-wide border border-accent/40 text-accent"
          >
            {c.label}
          </span>
        )
      )}
    </div>
  );
}
