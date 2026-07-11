"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ConceptNode, ContentObject, ObjectType } from "@/types";

interface AcervoClientProps {
  objects: ContentObject[];
  concepts: ConceptNode[];
}

/**
 * Índice/lista de todo o acervo, com filtro por tipo — fallback de
 * `/acervo` para telas pequenas, onde o grafo de força não funciona bem
 * ao toque (ver page.tsx). Estilizado como uma listagem de diretório
 * (`ls -la`). Ordenado por ano, igual à ordem de getObjects().
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
    <div className="font-term-mono">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filtrar por tipo de objeto"
      >
        <button
          type="button"
          onClick={() => setActiveType("todos")}
          className={`px-3 py-1 text-xs uppercase tracking-wide border transition-colors ${
            activeType === "todos"
              ? "border-term-accent bg-term-accent/10 text-term-accent"
              : "border-term-line text-term-muted hover:text-term-ink"
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
                ? "border-term-accent bg-term-accent/10 text-term-accent"
                : "border-term-line text-term-muted hover:text-term-ink"
            }`}
          >
            {type} <span className="opacity-60">({countByType.get(type)})</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-term-muted">
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-4 divide-y divide-term-line border-t border-term-line">
        {filtered.map((o) => (
          <li key={o.id} className="py-5">
            <Link href={`/objeto/${o.id}`} className="group block">
              <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[11px] uppercase tracking-wide text-term-muted">
                <span className="border border-term-line px-2 py-0.5">
                  {o.type}
                </span>
                <span>{o.year}</span>
              </div>
              <h2 className="text-base leading-snug text-term-ink group-hover:text-term-accent2 transition-colors">
                {o.title}
              </h2>
              <p className="mt-1 text-sm text-term-muted leading-relaxed max-w-prose">
                {o.shortDescription}
              </p>
              {o.concepts.length > 0 && (
                <p className="mt-1.5 text-[11px] text-term-accent/80">
                  {o.concepts.map((cid) => conceptLabel.get(cid) ?? cid).join(" · ")}
                </p>
              )}
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-5 text-sm text-term-muted">
            Nenhum objeto encontrado para este filtro.
          </li>
        )}
      </ul>
    </div>
  );
}
