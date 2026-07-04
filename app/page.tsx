import { getConcepts, getObjects, getConceptLinks } from "@/lib/data";
import { HomeClient } from "@/components/HomeClient";

interface HomeProps {
  searchParams: { conceito?: string };
}

/**
 * Home: os dados são carregados uma única vez aqui (nível de página) e
 * distribuídos via props — nenhum componente lê os JSON diretamente.
 */
export default function Home({ searchParams }: HomeProps) {
  const concepts = getConcepts();
  const objects = getObjects();
  const links = getConceptLinks();

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
