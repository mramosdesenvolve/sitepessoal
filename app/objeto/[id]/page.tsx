import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getConcepts, getObjectById } from "@/lib/data";
import { ObjectDetailView } from "@/components/ObjectDetailView";

interface PageProps {
  params: { id: string };
}

// Objetos vêm do banco e podem ser criados a qualquer momento via /admin —
// sem generateStaticParams: cada página é renderizada sob demanda, senão
// um objeto novo só apareceria depois de um rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const object = await getObjectById(params.id);
  if (!object) return {};
  return {
    title: `${object.title} — Marcos Ramos`,
    description: object.shortDescription,
  };
}

/**
 * Corpo longo do objeto: se existir content/<id>.mdx, ele tem precedência
 * (textos longos vivem em MDX); senão, usamos o longDescription gravado
 * no banco, quebrado em parágrafos.
 */
function getBody(id: string, longDescription: string): React.ReactNode {
  const mdxPath = path.join(process.cwd(), "content", `${id}.mdx`);
  if (fs.existsSync(mdxPath)) {
    const source = fs.readFileSync(mdxPath, "utf-8");
    return <MDXRemote source={source} />;
  }
  return longDescription
    .split("\n\n")
    .map((paragraph, i) => <p key={i}>{paragraph}</p>);
}

export default async function ObjectPage({ params }: PageProps) {
  const object = await getObjectById(params.id);
  if (!object) notFound();

  const concepts = await getConcepts();
  const relatedObjects = (
    await Promise.all(object.relatedObjectIds.map((id) => getObjectById(id)))
  ).filter((o): o is NonNullable<typeof o> => o !== undefined);

  return (
    <main>
      <ObjectDetailView
        object={object}
        concepts={concepts}
        relatedObjects={relatedObjects}
        body={getBody(object.id, object.longDescription)}
      />
    </main>
  );
}
