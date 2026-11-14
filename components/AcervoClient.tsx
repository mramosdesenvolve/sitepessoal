"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ConceptNode, ContentObject, ObjectType } from "@/types";

interface AcervoClientProps {
  objects: ContentObject[];
  concepts: ConceptNode[];
}

/**
 * Índice de todo o acervo, com busca e filtro por tipo. Linhas separadas por
 * fio cinza, sem cartões; tipo e ano em IBM Plex Mono (são dados). Ordenado
 * por ano, igual à ordem de getObjects().
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
      Array.from(countByType.keys()).sort(
        (a, b) => (countByType.get(b) ?? 0) - (countByType.get(a) ?? 0)
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
      <div className="grid-12 gap-y-6 border-t border-rule pt-6 pb-6">
        <div className="col-span-12 md:col-span-4">
          <label htmlFor="busca" className="strong mb-2 block">
            buscar
          </label>
          <input
            id="busca"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="termo, autor, conceito"
            className="field"
          />
        </div>

        <div
          className="col-span-12 md:col-span-8 flex flex-wrap content-end gap-2"
          role="group"
          aria-label="Filtrar por tipo de objeto"
        >
          <button
            type="button"
            onClick={() => setActiveType("todos")}
            aria-pressed={activeType === "todos"}
            className="pill"
          >
            todos <span className="font-mono font-normal">{objects.length}</span>
          </button>
          {typesPresent.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              aria-pressed={activeType === type}
              className="pill"
            >
              {type}{" "}
              <span className="font-mono font-normal">{countByType.get(type)}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="data m-0 border-t border-rule py-4" aria-live="polite">
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </p>

      <ul className="m-0 list-none p-0">
        {filtered.map((o) => (
          <li key={o.id} className="border-t border-hair">
            <Link
              href={`/objeto/${o.id}`}
              className="group grid-12 gap-y-2 py-8 text-ink no-underline hover:text-ink"
            >
              <p className="data m-0 col-span-12 md:col-span-2">
                {o.type}
                <br />
                {o.year}
              </p>
              <div className="col-span-12 md:col-span-7">
                <h2 className="m-0 mb-2 text-step-2 font-normal leading-[1.15] tracking-[-0.02em] group-hover:text-action-text group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                  {o.title}
                </h2>
                <p className="m-0 max-w-[62ch] text-ink-2">
                  {o.shortDescription}
                  {o.sourceName && (
                    <span className="text-ink-3"> — publicado no {o.sourceName}</span>
                  )}
                </p>
              </div>
              {o.concepts.length > 0 && (
                <p className="m-0 col-span-12 text-ink-3 md:col-span-3">
                  {o.concepts.map((cid) => conceptLabel.get(cid) ?? cid).join(" / ")}
                </p>
              )}
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="border-t border-hair py-8 text-ink-2">
            Nenhum objeto encontrado para este filtro.
          </li>
        )}
      </ul>
    </div>
  );
}
