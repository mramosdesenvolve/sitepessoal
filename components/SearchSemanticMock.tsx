"use client";

import { useAppStore } from "@/store/useAppStore";

/**
 * Campo de busca simulada. A lógica de matching vive em lib/useSearch.ts;
 * este componente só escreve a query no estado global — grafo e listas
 * reagem a ela em tempo real.
 */
export function SearchSemanticMock() {
  const query = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  return (
    <div className="relative w-full sm:w-72">
      <label htmlFor="busca" className="sr-only">
        Buscar no ecossistema
      </label>
      <input
        id="busca"
        type="search"
        value={query}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="buscar conceitos, textos, projetos…"
        className="w-full border border-line rounded-full bg-transparent px-4 py-1.5 text-sm placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
      />
      {query && (
        <button
          onClick={() => setSearchQuery("")}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent text-sm"
        >
          ×
        </button>
      )}
    </div>
  );
}
