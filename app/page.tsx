import { getConcepts, getObjects, getConceptLinks } from "@/lib/data";
import { HomeClient } from "@/components/HomeClient";

interface HomeProps {
  searchParams: { conceito?: string };
}

// Os objetos vêm do banco (podem mudar a qualquer momento via /admin) —
// renderização dinâmica, sem cache estático de página.
export const dynamic = "force-dynamic";

/**
 * Home: os dados são carregados uma única vez aqui (nível de página) e
 * distribuídos via props — nenhum componente lê o banco diretamente.
 */
export default async function Home({ searchParams }: HomeProps) {
  const [concepts, objects, links] = await Promise.all([
    getConcepts(),
    getObjects(),
    getConceptLinks(),
  ]);

  const initialConceptId = concepts.some((c) => c.id === searchParams.conceito)
    ? searchParams.conceito
    : undefined;

  return (
    <main>
      <HomeClient
        concepts={concepts}
        objects={objects}
        links={links}
        initialConceptId={initialConceptId}
      />
    </main>
  );
}
