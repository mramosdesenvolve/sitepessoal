"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import type { ConceptNode, ContentObject } from "@/types";
import { useAppStore } from "@/store/useAppStore";

/**
 * Busca "semântica" simulada com Fuse.js (fuzzy search) sobre
 * título + descrição curta + rótulos dos conceitos de cada objeto,
 * com peso maior para os conceitos.
 *
 * >>> PONTO DE EXTENSÃO FUTURO <<<
 * Quando houver busca real, é aqui que entra a chamada a um serviço de
 * embeddings / busca vetorial (ex.: gerar embedding da query e comparar
 * com embeddings pré-computados dos objetos). A interface do hook não
 * precisa mudar: continua recebendo a query e devolvendo ids ordenados
 * por relevância — só a implementação interna é substituída.
 */
export function useSearch(objects: ContentObject[], concepts: ConceptNode[]) {
  const query = useAppStore((s) => s.searchQuery);

  const fuse = useMemo(() => {
    const conceptLabel = new Map(concepts.map((c) => [c.id, c.label]));
    const docs = objects.map((o) => ({
      id: o.id,
      title: o.title,
      shortDescription: o.shortDescription,
      conceptLabels: o.concepts.map((cid) => conceptLabel.get(cid) ?? cid),
    }));
    return new Fuse(docs, {
      keys: [
        { name: "conceptLabels", weight: 2 }, // conceitos pesam mais
        { name: "title", weight: 1.2 },
        { name: "shortDescription", weight: 0.8 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [objects, concepts]);

  /** null = sem busca ativa; array = ids em ordem de relevância (Fuse.js) */
  const rankedObjectIds = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return null;
    return fuse.search(q).map((r) => r.item.id);
  }, [fuse, query]);

  /** mesma informação que rankedObjectIds, como Set — filtragem O(1) */
  const matchedObjectIds = useMemo(
    () => (rankedObjectIds ? new Set(rankedObjectIds) : null),
    [rankedObjectIds]
  );

  return { query, matchedObjectIds, rankedObjectIds };
}
