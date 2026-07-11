import type { ConceptNode, ContentObject } from "@/types";
import { RelatedObjects } from "./RelatedObjects";
import { TermTitlebar, TermTabs, TermBreadcrumb, TermStatusbar } from "./terminal/TermChrome";

interface ObjectDetailViewProps {
  object: ContentObject;
  concepts: ConceptNode[];
  relatedObjects: ContentObject[];
  /** corpo longo já renderizado (MDX quando existe content/<id>.mdx) */
  body: React.ReactNode;
  wordCount: number;
}

/**
 * Página de detalhe de um objeto — identidade "terminal", modo preview:
 * breadcrumb de caminho, frontmatter com os metadados, título serifado,
 * prosa em fonte de leitura (não monoespaçada) e objetos relacionados
 * como "imports" no fim do arquivo.
 */
export function ObjectDetailView({
  object,
  concepts,
  relatedObjects,
  body,
  wordCount,
}: ObjectDetailViewProps) {
  const objectConcepts = concepts.filter((c) => object.concepts.includes(c.id));

  return (
    <div className="h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path={`${object.id}.md`} badge="Preview" />
      <TermTabs active={null} />
      <TermBreadcrumb
        items={[
          { label: "acervo", href: "/acervo" },
          { label: object.type },
          { label: `${object.id}.md` },
        ]}
      />

      <div className="flex-1 overflow-y-auto bg-term-inset">
        <div className="max-w-[700px] mx-auto px-6 py-[6vh] pb-[10vh]">
          <div className="font-term-mono text-xs text-term-muted mb-[3.4vh] pb-[2.2vh] border-b border-dashed border-term-line">
            <div>{"{"}</div>
            <div className="pl-4">
              <span className="text-term-accent2-dim">tipo</span>:{" "}
              <span className="text-term-accent">&quot;{object.type}&quot;</span>,
            </div>
            <div className="pl-4">
              <span className="text-term-accent2-dim">ano</span>:{" "}
              <span className="text-term-accent">{object.year}</span>
              {objectConcepts.length > 0 && ","}
            </div>
            {objectConcepts.length > 0 && (
              <div className="pl-4">
                <span className="text-term-accent2-dim">conceitos</span>: [
                {objectConcepts.map((c, i) => (
                  <span key={c.id}>
                    <span className="text-term-accent">&quot;{c.label}&quot;</span>
                    {i < objectConcepts.length - 1 && ", "}
                  </span>
                ))}
                ]
              </div>
            )}
            {object.links && object.links.length > 0 && (
              <div className="pl-4">
                <span className="text-term-accent2-dim">links</span>: [
                {object.links.map((l, i) => (
                  <span key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-term-accent hover:text-term-accent2"
                    >
                      &quot;{l.label}↗&quot;
                    </a>
                    {i < object.links!.length - 1 && ", "}
                  </span>
                ))}
                ]
              </div>
            )}
            <div>{"}"}</div>
          </div>

          <h1 className="font-term-serif italic font-normal text-[clamp(26px,4vw,38px)] leading-tight text-term-ink m-0 mb-[3vh] text-balance">
            {object.title}
          </h1>
          <p className="font-term-mono text-[12.5px] text-term-muted m-0 mb-[4vh]">
            // {object.shortDescription}
          </p>

          <div className="font-term-serif text-[17px] leading-[1.75] text-term-ink max-w-[66ch] [&_p]:mb-[1.5em] [&_h2]:font-term-mono [&_h2]:font-semibold [&_h2]:text-[13px] [&_h2]:tracking-wide [&_h2]:uppercase [&_h2]:text-term-accent2 [&_h2]:mt-[2.6em] [&_h2]:mb-[1em] [&_blockquote]:my-[1.8em] [&_blockquote]:pl-[1.1em] [&_blockquote]:border-l-2 [&_blockquote]:border-term-accent-dim [&_blockquote]:italic [&_blockquote]:text-term-muted [&_em]:text-term-ink [&_strong]:font-bold [&_strong]:text-term-ink [&_a]:text-term-accent [&_a]:decoration-term-accent-dim [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
            {body}
          </div>

          <RelatedObjects objects={relatedObjects} />
        </div>
      </div>

      <TermStatusbar left="⎇ main" right={`${wordCount.toLocaleString("pt-BR")} palavras · UTF-8 · Markdown`} />
    </div>
  );
}
