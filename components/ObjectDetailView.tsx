import Link from "next/link";
import type { ConceptNode, ContentObject } from "@/types";
import { TagSystem } from "./TagSystem";
import { RelatedObjects } from "./RelatedObjects";

interface ObjectDetailViewProps {
  object: ContentObject;
  concepts: ConceptNode[];
  relatedObjects: ContentObject[];
  /** corpo longo já renderizado (MDX quando existe content/<id>.mdx) */
  body: React.ReactNode;
}

/**
 * Página de detalhe de um objeto. O corpo chega renderizado de fora
 * (MDX ou parágrafos do JSON) — o componente só cuida da moldura.
 */
export function ObjectDetailView({
  object,
  concepts,
  relatedObjects,
  body,
}: ObjectDetailViewProps) {
  return (
    <article className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16">
      <Link
        href="/"
        className="text-xs text-muted hover:text-accent transition-colors"
      >
        ← voltar ao grafo
      </Link>

      {/* grid assimétrico: título ocupa mais que a coluna de meta */}
      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,2fr)]">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight max-w-2xl">
            {object.title}
          </h1>
          <p className="mt-4 text-base text-muted leading-relaxed max-w-prose">
            {object.shortDescription}
          </p>

          <div className="mt-8 max-w-prose text-[15px] leading-relaxed space-y-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:mt-8 [&_blockquote]:border-l-2 [&_blockquote]:border-accent/50 [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_em]:font-serif">
            {body}
          </div>
        </div>

        <aside className="md:border-l md:border-line md:pl-8 h-fit space-y-6">
          <TagSystem object={object} concepts={concepts} />
          {object.links && object.links.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted">
                Links
              </h2>
              <ul className="mt-2 space-y-1">
                {object.links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent underline underline-offset-4 hover:no-underline"
                    >
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <RelatedObjects objects={relatedObjects} />
    </article>
  );
}
