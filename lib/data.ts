import conceptsJson from "@/data/concepts.json";
import { prisma } from "@/lib/prisma";
import type { ConceptNode, ContentObject } from "@/types";

/**
 * Camada única de acesso aos dados. Os componentes nunca consultam o
 * Prisma diretamente — recebem tudo via props a partir daqui (carregado
 * no nível da página/layout).
 *
 * Os objetos (artigos, projetos, softwares...) vivem no banco de dados
 * (tabela ContentObject) — é lá que o admin grava novos objetos em
 * /admin. Os conceitos continuam num vocabulário fixo em
 * data/concepts.json: este projeto não expõe edição de conceitos ainda.
 */

function toContentObject(row: {
  id: string;
  title: string;
  type: string;
  year: number;
  shortDescription: string;
  longDescription: string;
  concepts: unknown;
  relatedObjectIds: unknown;
  links: unknown;
  status: string;
  featured: boolean;
  createdAt: Date;
}): ContentObject {
  return {
    id: row.id,
    title: row.title,
    type: row.type as ContentObject["type"],
    year: row.year,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    concepts: (row.concepts as string[]) ?? [],
    relatedObjectIds: (row.relatedObjectIds as string[]) ?? [],
    links: (row.links as ContentObject["links"]) ?? undefined,
    status: row.status as ContentObject["status"],
    featured: row.featured,
    createdAt: row.createdAt,
  };
}

export async function getObjects(): Promise<ContentObject[]> {
  const rows = await prisma.contentObject.findMany({
    orderBy: { year: "desc" },
  });
  return rows.map(toContentObject);
}

/** Objeto publicado mais recente — usado na home. Ordena por `year` primeiro
 * (dado real de cada texto) e `createdAt` só como desempate — os 49 artigos
 * da migração em lote têm todos o mesmo createdAt (hora da migração), então
 * usar só createdAt escolheria um item essencialmente aleatório do lote. */
export async function getMostRecentObject(): Promise<ContentObject | undefined> {
  const row = await prisma.contentObject.findFirst({
    where: { status: "publicado" },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  return row ? toContentObject(row) : undefined;
}

export async function getConcepts(): Promise<ConceptNode[]> {
  const objects = await getObjects();
  // A fonte de verdade das conexões é o campo `concepts` de cada objeto.
  // Recomputamos `objectIds` aqui para o vocabulário de conceitos nunca
  // ficar dessincronizado do que está gravado no banco.
  return (conceptsJson as ConceptNode[]).map((concept) => ({
    ...concept,
    objectIds: objects
      .filter((o) => o.concepts.includes(concept.id))
      .map((o) => o.id),
  }));
}

export async function getObjectById(
  id: string
): Promise<ContentObject | undefined> {
  const row = await prisma.contentObject.findUnique({ where: { id } });
  return row ? toContentObject(row) : undefined;
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
export async function getConceptLinks(): Promise<ConceptLink[]> {
  const concepts = await getConcepts();
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

export interface NewContentObjectInput {
  id: string;
  title: string;
  type: string;
  year: number;
  shortDescription: string;
  longDescription: string;
  concepts: string[];
  relatedObjectIds: string[];
  links: { label: string; url: string }[];
  status: string;
  featured: boolean;
}

/** Usado pela server action de /admin — cria um objeto novo no banco. */
export async function createObject(
  input: NewContentObjectInput
): Promise<void> {
  await prisma.contentObject.create({
    data: {
      id: input.id,
      title: input.title,
      type: input.type,
      year: input.year,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription,
      concepts: input.concepts,
      relatedObjectIds: input.relatedObjectIds,
      links: input.links.length > 0 ? input.links : undefined,
      status: input.status,
      featured: input.featured,
    },
  });
}
