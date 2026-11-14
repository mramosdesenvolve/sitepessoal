import type { ConceptNode, ContentObject } from "@/types";
import { RelatedObjects } from "./RelatedObjects";
import { ShareButton } from "./ShareButton";
import { TagSystem } from "./TagSystem";
import { SiteNav } from "./site/SiteNav";
import { SiteFooter } from "./site/SiteFooter";

interface ObjectDetailViewProps {
  object: ContentObject;
  concepts: ConceptNode[];
  relatedObjects: ContentObject[];
  /** corpo longo já renderizado (MDX quando existe content/<id>.mdx) */
  body: React.ReactNode;
  wordCount: number;
}

/**
 * Página de detalhe de um objeto: ficha em IBM Plex Mono, título editorial
 * em vermelho, texto em coluna estreita e objetos relacionados no fim.
 */
export function ObjectDetailView({
  object,
  concepts,
  relatedObjects,
  body,
}: ObjectDetailViewProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active={object.type === "sistema" ? "sistemas" : "database"} />

      <main className="flex-1 wrap pt-16 md:pt-24">
        <header className="grid-12 gap-y-6 pb-12">
          <div className="col-span-12">
            <TagSystem object={object} concepts={concepts} />
          </div>
          <h1 className="title col-span-12 md:col-span-10 text-step-5 md:text-step-6">
            {object.title}
          </h1>
          <p className="strong m-0 col-span-12 md:col-span-7 text-step-1 leading-[1.35]">
            {object.shortDescription}
            {object.sourceUrl && object.sourceName && (
              <>
                {" — publicado no "}
                <a href={object.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {object.sourceName}
                </a>
              </>
            )}
          </p>
          <div className="col-span-12">
            <ShareButton title={object.title} summary={object.shortDescription} />
          </div>
        </header>

        <div className="grid-12 border-t border-rule pt-10">
          <div className="prose-id col-span-12 md:col-span-9 md:col-start-3">{body}</div>
        </div>

        <RelatedObjects objects={relatedObjects} />
      </main>

      <SiteFooter />
    </div>
  );
}
