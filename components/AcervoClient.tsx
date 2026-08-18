"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ConceptNode, ContentObject, ObjectType } from "@/types";

interface AcervoClientProps {
  objects: ContentObject[];
  concepts: ConceptNode[];
}

/**
 * Índice/lista de todo o acervo, com busca e filtro por tipo — fallback
 * de `/database` para telas pequenas, onde o grafo de força não funciona
 * bem ao toque (ver page.tsx). Ordenado por ano, igual à ordem de
 * getObjects().
 */
export function AcervoClient({ objects, concepts }: AcervoClientProps) {
  const [activeType, setActiveType] = useState<ObjectType | "todos">("todos");
  const [query, setQuery] = useState("");
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

  const byType =
    activeType === "todos" ? objects : objects.filter((o) => o.type === activeType);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered =
    normalizedQuery === ""
      ? byType
      : byType.filter((o) => {
          const haystack = [
            o.title,
            o.shortDescription,
            ...o.concepts.map((cid) => conceptLabel.get(cid) ?? cid),
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalizedQuery);
        });

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por termo, autor, conceito..."
        aria-label="Buscar no database"
        className="w-full border-b border-line bg-transparent py-2.5 text-[15px] text-ink placeholder:text-muted-2 focus:outline-none focus:border-ink mb-5"
      />

      <div
        className="flex flex-wrap gap-x-5 gap-y-2 pb-6 mb-2 border-b border-line"
        role="group"
        aria-label="Filtrar por tipo de objeto"
      >
        <button
          type="button"
          onClick={() => setActiveType("todos")}
          className={`text-[13px] transition-colors ${
            activeType === "todos" ? "text-ink font-medium" : "text-muted hover:text-ink"
          }`}
        >
          Todos <span className="text-muted-2">({objects.length})</span>
        </button>
        {typesPresent.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveType(type)}
            className={`text-[13px] transition-colors ${
              activeType === type ? "text-ink font-medium" : "text-muted hover:text-ink"
            }`}
          >
            {type} <span className="text-muted-2">({countByType.get(type)})</span>
          </button>
        ))}
      </div>

      <p className="text-[12.5px] text-muted-2 mb-2">
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </p>

      <ul className="divide-y divide-line">
        {filtered.map((o) => (
          <li key={o.id} className="py-6">
            <Link href={`/objeto/${o.id}`} className="group block">
              <div className="flex flex-wrap items-center gap-3 mb-2 text-[12px] text-muted">
                <span>{o.type}</span>
                <span className="text-muted-2">·</span>
                <span>{o.year}</span>
              </div>
              <h2 className="text-[19px] font-semibold leading-snug text-ink group-hover:text-accent transition-colors mb-1.5">
                {o.title}
              </h2>
              <p className="text-[14px] text-muted leading-relaxed max-w-[640px]">
                {o.shortDescription}
                {o.sourceName && (
                  <span className="text-muted-2"> — publicado no {o.sourceName}</span>
                )}
              </p>
              {o.concepts.length > 0 && (
                <p className="mt-2 text-[12px] text-accent">
                  {o.concepts.map((cid) => conceptLabel.get(cid) ?? cid).join(" · ")}
                </p>
              )}
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-6 text-sm text-muted">
            Nenhum objeto encontrado para este filtro.
          </li>
        )}
      </ul>
    </div>
  );
}
