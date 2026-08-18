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
    // compartilhamento deliberadamente sem imagem — só título, resumo
    // e autor (ver ShareButton, que monta o mesmo texto pro Web Share API)
    openGraph: {
      title: object.title,
      description: object.shortDescription,
      type: "article",
      authors: ["Marcos Ramos"],
      images: [],
    },
    twitter: {
      card: "summary",
      title: object.title,
      description: object.shortDescription,
    },
  };
}

/**
 * Corpo longo do objeto: se existir content/<id>.mdx, ele tem precedência
 * (textos longos vivem em MDX, passam pelo parser); senão, usamos o
 * longDescription gravado no banco, quebrado em parágrafos direto (texto
 * livre do admin não é MDX válido garantido, não passa pelo parser).
 */
function readRawBody(id: string, longDescription: string): { raw: string; isMdx: boolean } {
  const mdxPath = path.join(process.cwd(), "content", `${id}.mdx`);
  if (fs.existsSync(mdxPath)) {
    return { raw: fs.readFileSync(mdxPath, "utf-8"), isMdx: true };
  }
  return { raw: longDescription, isMdx: false };
}

function getBody(raw: string, isMdx: boolean): React.ReactNode {
  if (isMdx) return <MDXRemote source={raw} />;
  return raw.split("\n\n").map((paragraph, i) => <p key={i}>{paragraph}</p>);
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default async function ObjectPage({ params }: PageProps) {
  const object = await getObjectById(params.id);
  if (!object) notFound();

  const concepts = await getConcepts();
  const relatedObjects = (
    await Promise.all(object.relatedObjectIds.map((id) => getObjectById(id)))
  ).filter((o): o is NonNullable<typeof o> => o !== undefined);

  const { raw, isMdx } = readRawBody(object.id, object.longDescription);

  return (
    <ObjectDetailView
      object={object}
      concepts={concepts}
      relatedObjects={relatedObjects}
      body={getBody(raw, isMdx)}
      wordCount={countWords(raw)}
    />
  );
}
