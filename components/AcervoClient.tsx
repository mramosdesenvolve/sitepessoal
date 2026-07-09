"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ConceptNode, ContentObject, ObjectType } from "@/types";

interface AcervoClientProps {
  objects: ContentObject[];
  concepts: ConceptNode[];
}

/**
 * Índice/lista de todo o acervo, com filtro por tipo — via alternativa ao
 * grafo de força para quem prefere (ou precisa, por acessibilidade) navegar
 * sem depender de canvas e drag. Ordenado por ano (mais recente primeiro),
 * igual à ordem que já vem de getObjects().
 */
export function AcervoClient({ objects, concepts }: AcervoClientProps) {
  const [activeType, setActiveType] = useState<ObjectType | "todos">("todos");
  const conceptLabel = new Map(concepts.map((c) => [c.id, c.label]));

  const countByType = useMemo(() => {
    const counts = new Map<ObjectType, number>();
    for (const o of objects) counts.set(o.type, (counts.get(o.type) ?? 0) + 1);
    return counts;
  }, [objects]);

  const typesPresent = useMemo(
    () =>
      Array.from(countByType.keys()).sort((a, b) =>
        (countByType.get(b) ?? 0) - (countByType.get(a) ?? 0)
      ),
    [countByType]
  );

  const filtered =
    activeType === "todos" ? objects : objects.filter((o) => o.type === activeType);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2 font-cubist-mono"
        role="group"
        aria-label="Filtrar por tipo de objeto"
      >
        <button
          type="button"
          onClick={() => setActiveType("todos")}
          className={`px-3 py-1 text-xs uppercase tracking-wide border transition-colors ${
            activeType === "todos"
              ? "border-cubist-accent bg-cubist-accent/10 text-cubist-accent"
              : "border-cubist-line text-cubist-muted hover:text-cubist-ink"
          }`}
        >
          todos <span className="opacity-60">({objects.length})</span>
        </button>
        {typesPresent.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveType(type)}
            className={`px-3 py-1 text-xs uppercase tracking-wide border transition-colors ${
              activeType === type
                ? "border-cubist-accent bg-cubist-accent/10 text-cubist-accent"
                : "border-cubist-line text-cubist-muted hover:text-cubist-ink"
            }`}
          >
            {type} <span className="opacity-60">({countByType.get(type)})</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs font-cubist-mono text-cubist-muted">
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-4 divide-y divide-cubist-line border-t border-cubist-line">
        {filtered.map((o) => (
          <li key={o.id} className="py-5">
            <Link href={`/objeto/${o.id}`} className="group block">
              <div className="flex flex-wrap items-center gap-2 mb-1.5 font-cubist-mono text-[11px] uppercase tracking-wide text-cubist-muted">
                <span className="border border-cubist-line px-2 py-0.5">
                  {o.type}
                </span>
                <span>{o.year}</span>
              </div>
              <h2 className="text-lg leading-snug group-hover:text-cubist-accent transition-colors">
                {o.title}
              </h2>
              <p className="mt-1 text-sm text-cubist-muted leading-relaxed max-w-prose">
                {o.shortDescription}
              </p>
              {o.concepts.length > 0 && (
                <p className="mt-1.5 text-[11px] font-cubist-mono text-cubist-accent/80">
                  {o.concepts.map((cid) => conceptLabel.get(cid) ?? cid).join(" · ")}
                </p>
              )}
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-5 text-sm text-cubist-muted">
            Nenhum objeto encontrado para este filtro.
          </li>
        )}
      </ul>
    </div>
  );
}
