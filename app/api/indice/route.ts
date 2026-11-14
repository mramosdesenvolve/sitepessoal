import { NextResponse } from "next/server";
import { getConcepts, getObjects } from "@/lib/data";

// o índice acompanha o banco — objetos novos entram na busca sem rebuild
export const dynamic = "force-dynamic";

/** Índice enxuto do site, carregado pela busca (⌘K) na primeira abertura. */
export async function GET() {
  const [objects, concepts] = await Promise.all([getObjects(), getConcepts()]);

  return NextResponse.json(
    {
      objects: objects.map((o) => ({
        id: o.id,
        title: o.title,
        type: o.type,
        year: o.year,
        shortDescription: o.shortDescription,
        concepts: o.concepts,
      })),
      concepts: concepts
        .filter((c) => c.objectIds.length > 0)
        .map((c) => ({ id: c.id, label: c.label, count: c.objectIds.length })),
    },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } }
  );
}
