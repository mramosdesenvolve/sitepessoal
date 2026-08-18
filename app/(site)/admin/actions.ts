"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import conceptsJson from "@/data/concepts.json";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { createObject, getObjects, upsertSyncedObject } from "@/lib/data";
import { slugify } from "@/lib/slug";
import { fetchSubstackArtigos } from "@/lib/substack";
import { OBJECT_STATUSES, OBJECT_TYPES, type ConceptNode } from "@/types";

export async function logout() {
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

/** Formato aceito na textarea de links: uma linha por link, "Rótulo | https://url". */
function parseLinks(raw: string): { label: string; url: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((s) => s.trim());
      return { label: label || line, url: url ?? "" };
    })
    .filter((l) => l.url.length > 0);
}

export async function createObjectAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const year = Number(formData.get("year"));
  const status = String(formData.get("status") ?? "");
  const featured = formData.get("featured") === "on";
  const shortDescription = String(
    formData.get("shortDescription") ?? ""
  ).trim();
  const longDescription = String(formData.get("longDescription") ?? "").trim();
  const conceptIds = formData.getAll("concepts").map(String);
  const relatedObjectIds = formData.getAll("relatedObjectIds").map(String);
  const links = parseLinks(String(formData.get("links") ?? ""));

  const validConceptIds = new Set(
    (conceptsJson as ConceptNode[]).map((c) => c.id)
  );
  const existingObjects = await getObjects();
  const existingIds = new Set(existingObjects.map((o) => o.id));

  const errors: string[] = [];
  if (!title) errors.push("título é obrigatório");
  if (!shortDescription) errors.push("descrição curta é obrigatória");
  if (!longDescription) errors.push("texto longo é obrigatório");
  if (!Number.isInteger(year) || year < 1900 || year > 2100)
    errors.push("ano inválido");
  if (!OBJECT_TYPES.includes(type as (typeof OBJECT_TYPES)[number]))
    errors.push("tipo inválido");
  if (!OBJECT_STATUSES.includes(status as (typeof OBJECT_STATUSES)[number]))
    errors.push("status inválido");
  if (conceptIds.length === 0) errors.push("selecione ao menos um conceito");
  if (conceptIds.some((id) => !validConceptIds.has(id)))
    errors.push("conceito inválido");

  if (errors.length > 0) {
    redirect(`/admin?error=${encodeURIComponent(errors.join(", "))}`);
  }

  // id legível a partir do título, com sufixo numérico se colidir
  const base = slugify(title) || "objeto";
  let id = base;
  let suffix = 2;
  while (existingIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  await createObject({
    id,
    title,
    type,
    year,
    shortDescription,
    longDescription,
    concepts: conceptIds,
    relatedObjectIds: relatedObjectIds.filter((rid) => existingIds.has(rid)),
    links,
    status,
    featured,
  });

  revalidatePath("/");
  redirect(`/objeto/${id}`);
}

/** Puxa a seção "Artigos" do Substack e grava/atualiza cada post como
 * objeto do database — ver lib/substack.ts. Erro de rede/parsing não
 * deve travar o /admin: mostra a mensagem e segue a vida. */
export async function syncSubstackAction() {
  let count = 0;
  try {
    const artigos = await fetchSubstackArtigos();
    for (const artigo of artigos) {
      await upsertSyncedObject(artigo);
      count += 1;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "erro desconhecido";
    redirect(`/admin?error=${encodeURIComponent(`sync do Substack falhou: ${message}`)}`);
  }

  revalidatePath("/");
  revalidatePath("/database");
  redirect(`/admin?synced=${count}`);
}
