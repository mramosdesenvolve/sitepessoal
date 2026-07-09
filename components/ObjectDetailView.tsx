import type { ConceptNode, ContentObject } from "@/types";
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
  const objectConcepts = concepts.filter((c) => object.concepts.includes(c.id));

  return (
    <article className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
      {/* grid assimétrico: título ocupa mais que a coluna de meta */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,2fr)]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3 font-cubist-mono text-[11px] uppercase tracking-wide text-cubist-muted">
            <span className="border border-cubist-line px-2 py-0.5">
              {object.type}
            </span>
            <span>{object.year}</span>
          </div>
          <h1 className="text-3xl md:text-4xl leading-tight max-w-2xl">
            {object.title}
          </h1>
          <p className="mt-4 text-base text-cubist-muted leading-relaxed max-w-prose">
            {object.shortDescription}
          </p>

          <div className="mt-8 max-w-prose text-[15px] leading-relaxed space-y-4 [&_h2]:text-xl [&_h2]:mt-8 [&_blockquote]:border-l-2 [&_blockquote]:border-cubist-accent/50 [&_blockquote]:pl-4 [&_blockquote]:text-cubist-muted [&_a]:text-cubist-accent [&_a]:underline [&_a]:underline-offset-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
            {body}
          </div>
        </div>

        <aside className="md:border-l md:border-cubist-line md:pl-8 h-fit space-y-6 font-cubist-mono">
          {objectConcepts.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-cubist-muted">
                Conceitos
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {objectConcepts.map((c) => (
                  <span
                    key={c.id}
                    title={c.description}
                    className="inline-block px-2 py-0.5 text-[11px] tracking-wide border border-cubist-accent/40 text-cubist-accent"
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          {object.links && object.links.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-cubist-muted">
                Links
              </h2>
              <ul className="mt-2 space-y-1">
                {object.links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cubist-accent underline underline-offset-4 hover:no-underline"
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
