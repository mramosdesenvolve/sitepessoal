import type { ConceptNode, ContentObject } from "@/types";

/** Rótulo de tipo/ano/status — pílula de fio, IBM Plex Mono, não clicável. */
export function MetaChip({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}

interface TagSystemProps {
  object: ContentObject;
  concepts: ConceptNode[];
  /** tempo estimado de leitura — só para textos longos */
  readingMinutes?: number;
}

/**
 * Sistema de tags de um objeto: tipo, ano e status em pílulas; os conceitos
 * relacionados viram texto corrido, separados por barra — são só rótulos
 * (a página /grafo segue existindo, guardada para uso futuro, mas fora da
 * navegação).
 */
export function TagSystem({ object, concepts, readingMinutes }: TagSystemProps) {
  const objectConcepts = concepts.filter((c) => object.concepts.includes(c.id));

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      <MetaChip>{object.type}</MetaChip>
      <MetaChip>{object.year}</MetaChip>
      <MetaChip>{object.status}</MetaChip>
      {readingMinutes !== undefined && (
        <MetaChip>leitura de {readingMinutes} min</MetaChip>
      )}
      {objectConcepts.length > 0 && (
        <span className="ml-2 text-ink-3">
          {objectConcepts.map((c) => c.label).join(" / ")}
        </span>
      )}
    </div>
  );
}
