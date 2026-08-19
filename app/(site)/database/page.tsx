import type { Metadata } from "next";
import { getConcepts, getObjects } from "@/lib/data";
import { AcervoClient } from "@/components/AcervoClient";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Database — Marcos Ramos",
  description: "Lista completa dos objetos do site, com filtro por tipo.",
};

// objetos vêm do banco e podem ser criados a qualquer momento via /admin
export const dynamic = "force-dynamic";

export default async function DatabasePage() {
  const [objects, concepts] = await Promise.all([getObjects(), getConcepts()]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active="database" />

      <div className="flex-1 px-[6vw] py-[7vh]">
        <div className="max-w-[720px] mx-auto">
          <h1 className="text-[clamp(28px,3.6vw,42px)] font-semibold tracking-[-0.015em] mb-3">
            Database
          </h1>
          <p className="text-[13.5px] text-muted mb-8">
            {objects.length} objetos · {concepts.length} conceitos
          </p>
          <AcervoClient objects={objects} concepts={concepts} />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
