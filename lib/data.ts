import conceptsJson from "@/data/concepts.json";
import objectsJson from "@/data/objects.json";
import type { ConceptNode, ContentObject } from "@/types";

/**
 * Camada única de acesso aos dados. Os componentes nunca importam os JSON
 * diretamente — recebem tudo via props a partir daqui (carregado no nível
 * da página/layout).
 */

export function getObjects(): ContentObject[] {
  return objectsJson as ContentObject[];
}

export function getConcepts(): ConceptNode[] {
  const objects = getObjects();
  // A fonte de verdade das conexões é o campo `concepts` de cada objeto.
  // Recomputamos `objectIds` aqui para que os dois arquivos JSON nunca
  // fiquem dessincronizados quando alguém editar só um deles.
  return (conceptsJson as ConceptNode[]).map((concept) => ({
    ...concept,
    objectIds: objects
      .filter((o) => o.concepts.includes(concept.id))
      .map((o) => o.id),
  }));
}

export function getObjectById(id: string): ContentObject | undefined {
  return getObjects().find((o) => o.id === id);
}

export interface ConceptLink {
  source: string;
  target: string;
  /** quantos objetos os dois conceitos compartilham — usado na espessura da aresta */
  weight: number;
}

/**
 * Deriva as arestas do grafo: dois conceitos se conectam quando compartilham
 * ao menos um objeto. O peso é o número de objetos em comum.
 */
export function getConceptLinks(): ConceptLink[] {
  const concepts = getConcepts();
  const links: ConceptLink[] = [];
  for (let i = 0; i < concepts.length; i++) {
    for (let j = i + 1; j < concepts.length; j++) {
      const shared = concepts[i].objectIds.filter((id) =>
        concepts[j].objectIds.includes(id)
      );
      if (shared.length > 0) {
        links.push({
          source: concepts[i].id,
          target: concepts[j].id,
          weight: shared.length,
        });
      }
    }
  }
  return links;
}
