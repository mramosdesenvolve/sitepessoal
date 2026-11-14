"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/brand/Arrow";

export interface PanoramaItem {
  id: string;
  title: string;
  type: string;
  year: number;
  concepts: string[];
}

export interface PanoramaConcept {
  id: string;
  label: string;
  description?: string;
  count: number;
}

interface PanoramaProps {
  items: PanoramaItem[];
  concepts: PanoramaConcept[];
}

/**
 * O acervo como instrumento: cada marca é um objeto, empilhado no ano em que
 * saiu; embaixo, o índice de conceitos em voz de cartaz, com o corpo
 * proporcional ao número de objetos. Os dois se cruzam — um conceito acende
 * as marcas dele, uma marca acende os conceitos dela. Uma cor só (tinta), o
 * vermelho fica para o que está sob o cursor.
 */
export function Panorama({ items, concepts }: PanoramaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [hoverConcept, setHoverConcept] = useState<string | null>(null);
  const [pinnedConcept, setPinnedConcept] = useState<string | null>(null);

  const years = useMemo(() => {
    const all = items.map((i) => i.year);
    const min = Math.min(...all);
    const max = Math.max(...all);
    return Array.from({ length: max - min + 1 }, (_, k) => min + k);
  }, [items]);

  const byYear = useMemo(() => {
    const map = new Map<number, PanoramaItem[]>();
    for (const item of items) {
      const list = map.get(item.year) ?? [];
      list.push(item);
      map.set(item.year, list);
    }
    return map;
  }, [items]);

  const tallest = Math.max(...years.map((y) => byYear.get(y)?.length ?? 0));
  const maxCount = Math.max(...concepts.map((c) => c.count), 1);
  const conceptById = useMemo(
    () => new Map(concepts.map((c) => [c.id, c])),
    [concepts]
  );
  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  const activeConceptId = hoverConcept ?? pinnedConcept;
  const activeConcept = activeConceptId ? conceptById.get(activeConceptId) : undefined;
  const activeItem = hoverItem ? itemById.get(hoverItem) : undefined;

  // as marcas sobem uma vez, quando o gráfico entra na tela
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // em telas de toque não há hover: o primeiro toque mostra, o segundo abre
  function handleMarkClick(e: React.MouseEvent, id: string) {
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover && hoverItem !== id) {
      e.preventDefault();
      setHoverItem(id);
    }
  }

  return (
    <div ref={rootRef} className="panorama" data-in={entered ? "true" : undefined}>
      {/* leitura: o que está sob o cursor (vazia até haver algo apontado) */}
      <div className="grid-12 min-h-[5.5rem] items-end gap-y-4 pb-6">
        <div className="col-span-12 md:col-span-8" aria-live="polite">
          {activeItem ? (
            <>
              <p className="data m-0 mb-2">
                {activeItem.type} · {activeItem.year}
              </p>
              <p className="m-0 line-clamp-2 text-step-2 leading-[1.12] tracking-[-0.02em]">
                <Link
                  href={`/objeto/${activeItem.id}`}
                  className="text-ink no-underline hover:text-ink"
                >
                  {activeItem.title}
                </Link>
              </p>
            </>
          ) : activeConcept ? (
            <>
              <p className="data m-0 mb-2">
                conceito · {activeConcept.count} objeto
                {activeConcept.count === 1 ? "" : "s"}
              </p>
              <p className="m-0 line-clamp-2 text-step-2 leading-[1.12] tracking-[-0.02em]">
                {activeConcept.description ?? activeConcept.label}
              </p>
            </>
          ) : null}
        </div>
        <div className="col-span-12 flex flex-wrap gap-2 md:col-span-4 md:justify-end">
          {pinnedConcept && activeConcept && !activeItem && (
            <Link href={`/database?conceito=${pinnedConcept}`} className="pill">
              ver no database
              <Arrow dir="right" />
            </Link>
          )}
        </div>
      </div>

      {/* cronologia: uma coluna por ano, uma marca por objeto */}
      <div
        role="group"
        aria-label={`Cronologia do acervo: ${items.length} objetos de ${years[0]} a ${years[years.length - 1]}`}
        className="grid items-end gap-x-[2px] border-b border-rule md:gap-x-1"
        style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}
        onMouseLeave={() => setHoverItem(null)}
      >
        {years.map((year, yi) => {
          const list = byYear.get(year) ?? [];
          return (
            <div
              key={year}
              className="flex flex-col-reverse gap-[3px] pb-[3px]"
              style={{ minHeight: `${tallest * 17}px` }}
            >
              {list.map((item, i) => {
                const dimmed =
                  activeConceptId !== null &&
                  activeConceptId !== undefined &&
                  !item.concepts.includes(activeConceptId);
                const hot = hoverItem === item.id;
                return (
                  <Link
                    key={item.id}
                    href={`/objeto/${item.id}`}
                    tabIndex={-1}
                    aria-label={`${item.title} — ${item.type}, ${item.year}`}
                    onMouseEnter={() => setHoverItem(item.id)}
                    onFocus={() => setHoverItem(item.id)}
                    onClick={(e) => handleMarkClick(e, item.id)}
                    className={`panorama-mark block h-[14px] transition-colors duration-quick ease-out ${
                      hot ? "bg-signal" : dimmed ? "bg-hair" : "bg-ink"
                    }`}
                    style={
                      {
                        "--d": `${yi * 40 + i * 22}ms`,
                        // corte à mão: cada marca sai um pouco fora do esquadro
                        marginLeft: `${((yi * 7 + i * 13) % 5) * 0.7}px`,
                        marginRight: `${((yi * 11 + i * 5) % 5) * 0.7}px`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* eixo: cada ano leva ao database filtrado */}
      <div
        className="grid gap-x-[2px] pt-2 md:gap-x-1"
        style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}
      >
        {years.map((year, yi) => {
          const has = (byYear.get(year)?.length ?? 0) > 0;
          const label = (
            <>
              <span className="hidden lg:inline">{year}</span>
              <span className={`lg:hidden ${yi % 2 === 0 ? "" : "invisible"}`}>
                {String(year).slice(2)}
              </span>
            </>
          );
          return has ? (
            <Link
              key={year}
              href={`/database?ano=${year}`}
              aria-label={`${year}: ${byYear.get(year)?.length} objetos`}
              className="data text-center text-ink-3 no-underline hover:text-action-text"
            >
              {label}
            </Link>
          ) : (
            <span key={year} className="data text-center text-hair" aria-hidden="true">
              {label}
            </span>
          );
        })}
      </div>

      {/* índice de conceitos: o corpo acompanha o número de objetos */}
      <ul
        className="m-0 mt-12 flex list-none flex-wrap items-baseline gap-x-6 gap-y-1 p-0 md:mt-16 md:gap-x-8"
        onMouseLeave={() => setHoverConcept(null)}
      >
        {concepts.map((c) => {
          const t = Math.sqrt(c.count / maxCount);
          const lit = activeItem ? activeItem.concepts.includes(c.id) : false;
          const selected = activeConceptId === c.id;
          const muted =
            (activeItem && !lit) || (activeConceptId != null && !selected && !activeItem);
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={pinnedConcept === c.id}
                onMouseEnter={() => setHoverConcept(c.id)}
                onFocus={() => setHoverConcept(c.id)}
                onBlur={() => setHoverConcept(null)}
                onClick={() =>
                  setPinnedConcept((current) => (current === c.id ? null : c.id))
                }
                className={`poster cursor-pointer border-0 bg-transparent p-0 text-left leading-[1.22] md:leading-[1.08] [--cmax:var(--text-3)] md:[--cmax:var(--text-5)] transition-colors duration-quick ease-out ${
                  lit || selected ? "text-signal" : muted ? "text-hair" : "text-ink"
                }`}
                style={{
                  fontSize: `calc(var(--text-1) + (var(--cmax) - var(--text-1)) * ${t.toFixed(3)})`,
                }}
              >
                <span
                  className={
                    pinnedConcept === c.id
                      ? "underline decoration-2 underline-offset-[0.14em]"
                      : undefined
                  }
                >
                  {c.label}
                </span>
                <sup className="ml-1 align-super font-mono text-step-0 font-normal tracking-normal">
                  {c.count}
                </sup>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
