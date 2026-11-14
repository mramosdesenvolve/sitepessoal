"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface IndexObject {
  id: string;
  title: string;
  type: string;
  year: number;
  shortDescription: string;
  concepts: string[];
}

interface IndexConcept {
  id: string;
  label: string;
  count: number;
}

interface SiteIndex {
  objects: IndexObject[];
  concepts: IndexConcept[];
}

interface Result {
  key: string;
  href: string;
  kind: string; // rótulo em mono, à esquerda
  title: string;
  /** ação especial em vez de navegar para href */
  random?: boolean;
}

const PAGES: Result[] = [
  { key: "p-database", href: "/database", kind: "página", title: "database" },
  { key: "p-sobre", href: "/sobre", kind: "página", title: "sobre" },
  { key: "p-contato", href: "/contato", kind: "página", title: "contato" },
];

const RANDOM: Result = {
  key: "acaso",
  href: "#",
  kind: "ação",
  title: "abrir um objeto ao acaso",
  random: true,
};

export const OPEN_SEARCH_EVENT = "busca:abrir";

/** tira acentos e caixa — "musica" encontra "música" */
function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

let cachedIndex: SiteIndex | null = null;

/**
 * Busca universal em tela cheia (⌘K, ctrl K ou "/"): a página vira papel em
 * branco e o que se digita aparece em voz de cartaz. Procura em títulos,
 * resumos e conceitos; setas escolhem, enter abre. Sem sombra nem cartão —
 * a profundidade é a troca de tela inteira.
 */
export function Busca() {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState<SiteIndex | null>(cachedIndex);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setCursor(0);
    dialog.showModal();
    inputRef.current?.focus();
    if (!cachedIndex) {
      fetch("/api/indice")
        .then((r) => (r.ok ? r.json() : null))
        .then((data: SiteIndex | null) => {
          if (data) {
            cachedIndex = data;
            setIndex(data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      } else if (e.key === "/" && !typing && !dialogRef.current?.open) {
        e.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, open);
    };
  }, [open, close]);

  // navegou: fecha
  useEffect(() => {
    close();
  }, [pathname, close]);

  const results = useMemo<Result[]>(() => {
    const q = fold(query.trim());
    if (q === "") return [RANDOM, ...PAGES];
    const out: { r: Result; score: number }[] = [];

    for (const p of PAGES) {
      if (fold(p.title).includes(q)) out.push({ r: p, score: 1 });
    }
    if (index) {
      const labelById = new Map(index.concepts.map((c) => [c.id, c.label]));
      for (const c of index.concepts) {
        if (fold(c.label).includes(q)) {
          out.push({
            r: {
              key: `c-${c.id}`,
              href: `/database?conceito=${c.id}`,
              kind: `conceito · ${c.count}`,
              title: c.label,
            },
            score: fold(c.label).startsWith(q) ? 0 : 2,
          });
        }
      }
      for (const o of index.objects) {
        const title = fold(o.title);
        let score = -1;
        if (title.startsWith(q)) score = 3;
        else if (title.includes(q)) score = 4;
        else if (fold(o.shortDescription).includes(q)) score = 5;
        else if (o.concepts.some((id) => fold(labelById.get(id) ?? "").includes(q)))
          score = 6;
        if (score >= 0) {
          out.push({
            r: {
              key: `o-${o.id}`,
              href: `/objeto/${o.id}`,
              kind: `${o.type} · ${o.year}`,
              title: o.title,
            },
            score,
          });
        }
      }
    }
    return out
      .sort((a, b) => a.score - b.score)
      .slice(0, 14)
      .map((x) => x.r);
  }, [query, index]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-i="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  function go(result: Result | undefined) {
    if (!result) return;
    if (result.random) {
      const pool = index?.objects ?? [];
      if (pool.length === 0) return;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      router.push(`/objeto/${pick.id}`);
    } else {
      router.push(result.href);
    }
    close();
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[cursor]);
    }
  }

  const searching = query.trim() !== "";

  return (
    <dialog ref={dialogRef} className="busca" aria-label="Buscar no site">
      <div className="wrap flex h-full flex-col pt-4">
        <div className="flex items-center justify-between gap-4 border-b border-rule pb-4">
          <span className="data">buscar</span>
          <button type="button" onClick={close} className="pill">
            fechar <span className="font-mono font-normal">esc</span>
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder="o que você procura?"
          aria-label="Termo de busca"
          aria-controls="busca-resultados"
          autoComplete="off"
          spellCheck={false}
          className="busca-campo poster mt-8 w-full md:mt-12"
        />

        <p className="data m-0 border-b border-rule py-4" aria-live="polite">
          {searching
            ? index
              ? `${results.length} resultado${results.length === 1 ? "" : "s"}`
              : "carregando o índice…"
            : "títulos, resumos e conceitos · ↑ ↓ para escolher · enter para abrir"}
        </p>

        <ul
          ref={listRef}
          id="busca-resultados"
          className="m-0 flex-1 list-none overflow-y-auto p-0 pb-10"
        >
          {results.map((r, i) => (
            <li key={r.key} className="border-b border-hair">
              <a
                href={r.href}
                data-i={i}
                aria-current={i === cursor ? "true" : undefined}
                onMouseMove={() => setCursor(i)}
                onClick={(e) => {
                  e.preventDefault();
                  go(r);
                }}
                className={`grid-12 items-baseline gap-y-1 px-3 py-4 no-underline transition-colors duration-instant ${
                  i === cursor
                    ? "bg-inverse text-on-inverse hover:text-on-inverse"
                    : "text-ink hover:text-ink"
                }`}
              >
                <span
                  className={`col-span-12 font-mono md:col-span-3 ${
                    i === cursor ? "" : "text-ink-3"
                  }`}
                >
                  {r.kind}
                </span>
                <span className="col-span-12 text-step-2 leading-[1.15] tracking-[-0.02em] md:col-span-9">
                  {r.title}
                </span>
              </a>
            </li>
          ))}
          {searching && index && results.length === 0 && (
            <li className="py-8 text-ink-2">Nada encontrado para “{query.trim()}”.</li>
          )}
        </ul>
      </div>
    </dialog>
  );
}

/** Botão da navegação que abre a busca (o atalho aparece só em telas largas). */
export function BuscaTrigger() {
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("ctrl K");
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
      aria-keyshortcuts="Meta+K Control+K"
      className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-step-0 text-ink-2 transition-colors duration-quick hover:text-action-text"
    >
      buscar
      <kbd className="hidden border border-hair px-1.5 font-mono text-step-0 font-normal text-ink-3 md:inline">
        {shortcut}
      </kbd>
    </button>
  );
}
