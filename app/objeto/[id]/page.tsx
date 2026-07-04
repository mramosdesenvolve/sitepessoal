import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getConcepts, getObjectById, getObjects } from "@/lib/data";
import { ObjectDetailView } from "@/components/ObjectDetailView";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return getObjects().map((o) => ({ id: o.id }));
}

export function generateMetadata({ params }: PageProps) {
  const object = getObjectById(params.id);
  if (!object) return {};
  return {
    title: `${object.title} — Marcos Ramos`,
    description: object.shortDescription,
  };
}

/**
 * Corpo longo do objeto: se existir content/<id>.mdx, ele tem precedência
 * (textos longos vivem em MDX); senão, usamos o longDescription do JSON,
 * quebrado em parágrafos.
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

export default function ObjectPage({ params }: PageProps) {
  const object = getObjectById(params.id);
  if (!object) notFound();

  const concepts = getConcepts();
  const relatedObjects = object.relatedObjectIds
    .map((id) => getObjectById(id))
    .filter((o): o is NonNullable<typeof o> => o !== undefined);

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
