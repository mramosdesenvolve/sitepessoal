import type { Metadata } from "next";
import { getConcepts, getObjects } from "@/lib/data";
import { AcervoClient } from "@/components/AcervoClient";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Database — Marcos Ramos",
  description: "Lista completa dos objetos do site, com busca e filtros por tipo, conceito e ano.",
};

// objetos vêm do banco e podem ser criados a qualquer momento via /admin
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { conceito?: string; ano?: string; tipo?: string; q?: string };
}

export default async function DatabasePage({ searchParams }: PageProps) {
  const [objects, concepts] = await Promise.all([getObjects(), getConcepts()]);
  const year = searchParams.ano ? Number(searchParams.ano) : NaN;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active="database" />

      <main className="flex-1 wrap pt-16 md:pt-24">
        <header className="grid-12 items-end gap-y-4 pb-12">
          <h1 className="title col-span-12 md:col-span-8 text-step-6 md:text-step-8">
            database
          </h1>
          <p className="data m-0 col-span-12 md:col-span-4 md:text-right">
            {objects.length} objetos ·{" "}
            {concepts.filter((c) => c.objectIds.length > 0).length} conceitos
          </p>
        </header>

        {/* filtros iniciais vêm da URL — é assim que o panorama da capa e a
            busca apontam para um recorte do acervo */}
        <AcervoClient
          key={[searchParams.conceito, searchParams.ano, searchParams.tipo, searchParams.q].join("|")}
          objects={objects}
          concepts={concepts}
          initialConcept={searchParams.conceito}
          initialYear={Number.isInteger(year) ? year : undefined}
          initialType={searchParams.tipo}
          initialQuery={searchParams.q}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
