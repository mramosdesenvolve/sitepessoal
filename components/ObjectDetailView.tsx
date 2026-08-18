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
 * Página de detalhe de um objeto: metadados como tags, título grande,
 * prosa e objetos relacionados no fim.
 */
export function ObjectDetailView({
  object,
  concepts,
  relatedObjects,
  body,
}: ObjectDetailViewProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active="database" />

      <div className="flex-1 px-[6vw] py-[8vh]">
        <div className="max-w-[680px] mx-auto">
          <TagSystem object={object} concepts={concepts} />

          <h1 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.015em] leading-tight mt-5 mb-3 text-balance">
            {object.title}
          </h1>
          <p className="text-[14.5px] text-muted mb-6">
            {object.shortDescription}
            {object.sourceUrl && object.sourceName && (
              <>
                {" — publicado no "}
                <a
                  href={object.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent underline"
                >
                  {object.sourceName}↗
                </a>
              </>
            )}
          </p>

          <div className="mb-10">
            <ShareButton title={object.title} summary={object.shortDescription} />
          </div>

          <div className="text-[17px] leading-[1.75] text-ink max-w-[66ch] [&_p]:mb-[1.5em] [&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:tracking-wide [&_h2]:uppercase [&_h2]:text-muted [&_h2]:mt-[2.6em] [&_h2]:mb-[1em] [&_blockquote]:my-[1.8em] [&_blockquote]:pl-[1.1em] [&_blockquote]:border-l-2 [&_blockquote]:border-line [&_blockquote]:italic [&_blockquote]:text-muted [&_em]:text-ink [&_strong]:font-semibold [&_strong]:text-ink [&_a]:text-ink [&_a]:underline [&_a]:decoration-line hover:[&_a]:text-accent [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
            {body}
          </div>

          <RelatedObjects objects={relatedObjects} />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
