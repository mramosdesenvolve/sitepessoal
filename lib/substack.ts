import type { SyncedObjectInput } from "@/lib/data";

/**
 * Sincronização com o Substack de Marcos — puxa só os posts da seção
 * "Artigos" (não a publicação inteira: posts soltos/notas ficam de fora
 * de propósito) via o endpoint público de arquivo do Substack, filtrado
 * por seção. Não existe API oficial documentada pra isso — o endpoint foi
 * encontrado inspecionando a própria página pública da seção
 * (https://marcosramos.substack.com/s/artigos/), que usa exatamente essa
 * chamada. Se o Substack mudar esse endpoint no futuro, a sincronização
 * simplesmente para de trazer nada novo (falha "silenciosa", sem quebrar
 * o resto do site — ver syncSubstackArtigos).
 */
const SUBSTACK_ARCHIVE_URL =
  "https://marcosramos.substack.com/api/v1/archive?sort=new&search=&section=424763";
const SOURCE_NAME = "Substack";

/** Descrições curtas escritas à mão, por slug do post — sobrepõem o
 * `description` autogerado do Substack quando presentes. Adicione aqui
 * conforme publicar; o que não tiver entrada aqui cai no autogerado. */
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "o-villa-lobos-de-erika-ribeira":
    "Uma audição crítica do álbum Villa-Lobos (2026) da pianista Erika Ribeiro",
};

interface SubstackArchiveItem {
  title: string;
  slug: string;
  post_date: string;
  canonical_url: string;
  description: string | null;
  truncated_body_text: string | null;
}

async function fetchSubstackArchive(): Promise<SubstackArchiveItem[]> {
  const res = await fetch(SUBSTACK_ARCHIVE_URL, {
    // sempre busca fresco — a sincronização só roda quando chamada (botão
    // do /admin), não faz sentido cachear
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Substack archive respondeu ${res.status}`);
  }
  return res.json();
}

function toSyncedObject(item: SubstackArchiveItem): SyncedObjectInput {
  const shortDescription =
    DESCRIPTION_OVERRIDES[item.slug] ??
    item.description ??
    item.truncated_body_text ??
    item.title;

  return {
    id: `substack-${item.slug}`,
    title: item.title,
    type: "artigo",
    year: new Date(item.post_date).getFullYear(),
    shortDescription,
    longDescription: item.truncated_body_text ?? shortDescription,
    links: [{ label: "Ler no Substack", url: item.canonical_url }],
    sourceUrl: item.canonical_url,
    sourceName: SOURCE_NAME,
  };
}

/** Busca a seção "Artigos" do Substack e devolve os objetos prontos pra
 * upsert — quem chama decide o que fazer (ver syncSubstackArtigos em
 * app/(terminal)/admin/actions.ts). */
export async function fetchSubstackArtigos(): Promise<SyncedObjectInput[]> {
  const items = await fetchSubstackArchive();
  return items.map(toSyncedObject);
}
