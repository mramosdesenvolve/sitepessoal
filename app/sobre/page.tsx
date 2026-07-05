import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marcos Ramos — currículo e contato",
  description:
    "Nota biográfica, formação e contato de Marcos Ramos — pesquisador, educador e designer de sistemas de aprendizagem.",
};

/**
 * Página de currículo/contato — destino do clique no nome no cabeçalho.
 * Texto placeholder, no mesmo espírito fictício-porém-plausível do resto
 * do site (ver README).
 */
export default function SobrePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16">
      <Link
        href="/"
        className="text-xs text-muted hover:text-accent transition-colors"
      >
        ← voltar ao grafo
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,2fr)]">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight max-w-2xl">
            Marcos Ramos
          </h1>
          <p className="mt-4 text-base text-muted leading-relaxed max-w-prose">
            Pesquisador, educador e designer de sistemas de aprendizagem.
            Trabalho na fronteira entre cultura, tecnologia e educação —
            construindo currículos, ferramentas, softwares e infraestruturas
            que tratam a aprendizagem como rede, não como linha.
          </p>

          <div className="mt-10 max-w-prose text-[15px] leading-relaxed space-y-5">
            <section>
              <h2 className="font-serif text-xl mb-2">Trajetória</h2>
              <p>
                Minha formação atravessa literatura, música e filosofia antes
                de chegar à educação — e é dessa travessia que vem o
                interesse por currículo como design de experiência, não como
                lista de conteúdos. Nos últimos anos, essa investigação tem
                se concentrado em três frentes que se cruzam: cultura
                brasileira e afro-diaspórica como campo de pesquisa;
                formação docente e desenho de sistemas de aprendizagem como
                prática; e inteligência artificial e desenvolvimento de
                software como material de trabalho.
              </p>
              <p className="mt-3">
                Tenho atuado como consultor e formador para redes de ensino,
                institutos culturais e equipes pedagógicas, sempre a partir
                da mesma pergunta: que infraestrutura — curricular, cultural
                ou técnica — sustenta esse aprendizado, e como redesenhá-la
                com quem já está dentro dela.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl mb-2">Formação</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Doutorado em Educação (placeholder)</li>
                <li>Mestrado em Filosofia (placeholder)</li>
                <li>Graduação em Letras (placeholder)</li>
              </ul>
            </section>
          </div>
        </div>

        <aside className="md:border-l md:border-line md:pl-8 h-fit space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted">
              Contato
            </h2>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href="mailto:contato@marcosramos.com.br"
                  className="text-sm text-accent underline underline-offset-4 hover:no-underline"
                >
                  contato@marcosramos.com.br
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted">
              Perfis
            </h2>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href="https://example.com/linkedin-placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent underline underline-offset-4 hover:no-underline"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a
                  href="https://example.com/lattes-placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent underline underline-offset-4 hover:no-underline"
                >
                  Currículo Lattes ↗
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
