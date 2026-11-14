import type { Metadata } from "next";
import { Arrow } from "@/components/brand/Arrow";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";

export const metadata: Metadata = {
  title: "Marcos Ramos — currículo e contato",
  description:
    "Nota biográfica, formação e contato de Marcos Ramos — professor, pesquisador e consultor em educação e tecnologia.",
};

const LINKS = [
  { label: "e-mail", href: "mailto:marcosramos.email@gmail.com", external: false },
  { label: "orcid", href: "https://orcid.org/0000-0003-3485-8462", external: true },
  { label: "academia.edu", href: "https://independent.academia.edu/MarcosRamos443", external: true },
  { label: "lattes", href: "http://lattes.cnpq.br/6494749060939079", external: true },
];

const LIVROS = [
  "Teorias da Canção: Percursos, Fundamentos e Metodologias — uma introdução (2025)",
  "Dioses que danzan: cuentos tradicionales de los Orishas (2024)",
  "Balaio de Gato (2022)",
  "Anatomia da Elipse: Escritos sobre Nacionalismo, Raça e Patriarcado (2017)",
  "O piano à imagem do deserto (2014)",
  "Um corpo que se escreve Pedra (2012)",
];

/**
 * Página de currículo/contato completa — texto real, validado com o
 * próprio Marcos Ramos.
 */
export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active="sobre" />

      <main className="flex-1 wrap pt-16 md:pt-24">
        <h1 className="title pb-12 text-step-6 md:text-step-8">sobre</h1>

        <div className="grid-12 gap-y-12 border-t border-rule pt-8">
          <aside className="col-span-12 md:col-span-4">
            <dl className="m-0 flex flex-col gap-8">
              <div>
                <dt className="strong mb-1">papel</dt>
                <dd className="m-0 text-ink-2">
                  Professor, pesquisador · Consultor em Educação e Tecnologia ·
                  Desenvolvedor
                </dd>
              </div>
              <div>
                <dt className="strong mb-1">formação</dt>
                <dd className="m-0 text-ink-2">
                  Dr. em Letras (UFES) · Estudos Afro-Latino-Americanos
                  (Harvard)
                </dd>
              </div>
              <div>
                <dt className="strong mb-2">contato</dt>
                <dd className="m-0">
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {LINKS.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          {...(l.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="inline-flex items-center gap-2"
                        >
                          {l.label}
                          {l.external && <Arrow dir="up-right" className="h-4 w-4" />}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </aside>

          <article className="col-span-12 md:col-span-7 md:col-start-6 text-step-1 leading-[1.55]">
            <p className="m-0 mb-[1.4em] text-step-2 leading-[1.35] tracking-[-0.01em]">
              Doutor em Letras, certificado em Estudos Afro-Latino-Americanos
              pela Universidade de Harvard, sou professor e pesquisador. Meus
              temas principais são literatura, educação e tecnologia. Atuo na
              pós-graduação com pesquisa e orientação de teses, e
              concomitantemente, no desenvolvimento de projetos e
              consultorias para instituições públicas, privadas e do
              terceiro setor.
            </p>

            <h2 className="strong m-0 mb-5 mt-14 border-t border-hair pt-4 text-step-2 tracking-[-0.015em]">
              trajetória
            </h2>
            <div className="max-w-measure">
              <p className="m-0 mb-[1.4em]">
                Minha formação atravessa os estudos literários e as ciências
                humanas e sociais. Minha tese de doutorado,{" "}
                <em>O Pacto na Mira do Ofá</em>, investiga os temas como
                pensamento social brasileiro, tradição radical negra,
                imaginação radical, música e literatura.
              </p>
              <p className="m-0 mb-[1.4em]">
                Fui professor visitante no Departamento de Literatura da
                Universidad Nacional de Colombia entre 2022 e 2025, e
                professor convidado em instituições como a Universidad de La
                Habana (Cuba), a Universidad Andina Simón Bolívar (Equador) e
                a Universidade Eduardo Mondlane (Moçambique). Organizo e curo
                o Ciclo Afro, iniciativa já em três edições — na Feira
                Internacional do Livro de Bogotá (FILBo), na Universidade
                Federal do Recôncavo da Bahia (UFRB) e em sua edição inicial
                —, articulando ministérios, prefeituras, universidades e
                instituições culturais em torno das artes e epistemologias
                das diásporas africanas.
              </p>
              <p className="m-0 mb-[1.4em]">
                Em paralelo a essa trajetória, atuo também na gestão, no
                desenho e no desenvolvimento de tecnologias para instituições
                de ensino e cultura: apoio processos de desenvolvimento
                institucional e o desenho de soluções — aplicações e
                softwares — voltadas a esse setor. São duas inscrições
                profundas e simultâneas: uma na pesquisa; outra na gestão e
                na tecnologia.
              </p>
            </div>

            <h2 className="strong m-0 mb-5 mt-14 border-t border-hair pt-4 text-step-2 tracking-[-0.015em]">
              livros publicados
            </h2>
            <ul className="m-0 max-w-measure list-none p-0">
              {LIVROS.map((livro) => (
                <li key={livro} className="border-t border-hair py-3 first:border-t-0 first:pt-0">
                  {livro}
                </li>
              ))}
            </ul>

          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
