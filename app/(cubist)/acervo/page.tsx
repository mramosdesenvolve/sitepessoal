import type { Metadata } from "next";
import { getConcepts, getObjects } from "@/lib/data";
import { AcervoClient } from "@/components/AcervoClient";
import { CubistCornerNav } from "@/components/CubistCornerNav";

export const metadata: Metadata = {
  title: "Acervo — Marcos Ramos",
  description: "Lista completa dos objetos do site, com filtro por tipo.",
};

// objetos vêm do banco e podem ser criados a qualquer momento via /admin
export const dynamic = "force-dynamic";

export default async function AcervoPage() {
  const [objects, concepts] = await Promise.all([getObjects(), getConcepts()]);

  return (
    <>
      <CubistCornerNav />

      <main className="mx-auto max-w-3xl px-6 md:px-8 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl leading-tight">Acervo</h1>
        <p className="mt-3 text-base text-cubist-muted leading-relaxed max-w-prose">
          Todos os objetos do site em lista, para quem prefere filtrar por
          tipo em vez de navegar pelo rizoma.
        </p>

        <div className="mt-10">
          <AcervoClient objects={objects} concepts={concepts} />
        </div>
      </main>
    </>
  );
}
