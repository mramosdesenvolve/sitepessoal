import type { Metadata } from "next";
import { CubistPortraitHome } from "@/components/homepage/CubistPortraitHome";
import { getConcepts, getConceptLinks, getObjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Investigo como cultura, tecnologia e aprendizagem produzem novas formas de imaginar o mundo.",
};

// objetos vêm do banco e podem ser criados a qualquer momento via /admin —
// o rizoma do ato 3 usa os mesmos dados de /acervo
export const dynamic = "force-dynamic";

// Peça de tela única (ver design_handoff_homepage_acervo/README.md, opção
// 7a) — sem header/footer do site, por isso fica fora do grupo de rotas
// (site).
export default async function Home() {
  const [concepts, links, objects] = await Promise.all([
    getConcepts(),
    getConceptLinks(),
    getObjects(),
  ]);
  return (
    <CubistPortraitHome concepts={concepts} links={links} objects={objects} />
  );
}
