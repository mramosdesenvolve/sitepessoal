import type { ContentObject } from "@/types";
import { Cabecalho } from "./site/Cabecalho";
import { Rodape } from "./site/Rodape";

interface ObjectDetailViewProps {
  object: ContentObject;
  /** corpo longo já renderizado (MDX quando existe content/<id>.mdx) */
  body: React.ReactNode;
}

/**
 * Página de um texto, no formato do site de referência: título grande em
 * negrito, subtítulo em itálico, data em cinza e o corpo em coluna estreita.
 * No fim, os links para a publicação original e o "voltar ao topo".
 */
export function ObjectDetailView({ object, body }: ObjectDetailViewProps) {
  return (
    <div className="page">
      <Cabecalho />

      <main>
        <article className="coluna">
          <h1 className="texto-titulo">{object.title}</h1>
          <p className="texto-subtitulo">{object.shortDescription}</p>
          <p className="texto-data">
            {object.year}
            {object.sourceUrl && object.sourceName && (
              <>
                {" · "}
                <a href={object.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {object.sourceName}
                </a>
              </>
            )}
          </p>

          <div className="texto-corpo">{body}</div>

          {object.links && object.links.length > 0 && (
            <section className="secao">
              <h2>Links</h2>
              <ul className="lista-links">
                {object.links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="voltar-ao-topo">
            <div>
              <a href="#">Voltar ao topo</a>
            </div>
          </div>
        </article>
      </main>

      <Rodape />
    </div>
  );
}
