import type { Metadata } from "next";
import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";

export const metadata: Metadata = {
  title: "Marcos Ramos — currículo e contato",
  description:
    "Nota biográfica, formação e contato de Marcos Ramos — professor, pesquisador e consultor em educação e tecnologia.",
};

/**
 * Página de currículo/contato completa — identidade "terminal": moldura
 * de editor + corpo em modo preview (prosa serifada, frontmatter no
 * topo). Texto real, validado com o próprio Marcos Ramos.
 */
export default function SobrePage() {
  return (
    <div className="h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path="sobre.md" badge="Preview" />
      <TermTabs active="sobre" />

      <div className="flex-1 overflow-y-auto bg-term-inset">
        <div className="max-w-[700px] mx-auto px-6 py-[6vh] pb-[10vh]">
          <div className="font-term-mono text-xs text-term-muted mb-[3.4vh] pb-[2.2vh] border-b border-dashed border-term-line">
            <div>{"{"}</div>
            <div className="pl-4">
              <span className="text-term-accent2-dim">papel</span>:{" "}
              <span className="text-term-accent">
                &quot;Professor, pesquisador&quot;
              </span>{" "}
              |{" "}
              <span className="text-term-accent">
                &quot;Consultor em Educação e Tecnologia&quot;
              </span>{" "}
              | <span className="text-term-accent">&quot;Desenvolvedor&quot;</span>,
            </div>
            <div className="pl-4">
              <span className="text-term-accent2-dim">formação</span>: [
              <span className="text-term-accent">
                &quot;Dr. em Letras (UFES)&quot;
              </span>
              ,{" "}
              <span className="text-term-accent">
                &quot;Estudos Afro-Latino-Americanos (Harvard)&quot;
              </span>
              ],
            </div>
            <div className="pl-4">
              <span className="text-term-accent2-dim">contato</span>: [
              <a
                href="mailto:marcosramos.email@gmail.com"
                className="text-term-accent hover:text-term-accent2"
              >
                &quot;marcosramos.email@gmail.com&quot;
              </a>
              ,{" "}
              <a
                href="https://orcid.org/0000-0003-3485-8462"
                target="_blank"
                rel="noopener noreferrer"
                className="text-term-accent hover:text-term-accent2"
              >
                &quot;ORCID↗&quot;
              </a>
              ,{" "}
              <a
                href="https://independent.academia.edu/MarcosRamos443"
                target="_blank"
                rel="noopener noreferrer"
                className="text-term-accent hover:text-term-accent2"
              >
                &quot;Academia.edu↗&quot;
              </a>
              ,{" "}
              <a
                href="http://lattes.cnpq.br/6494749060939079"
                target="_blank"
                rel="noopener noreferrer"
                className="text-term-accent hover:text-term-accent2"
              >
                &quot;Lattes↗&quot;
              </a>
              ]
            </div>
            <div>{"}"}</div>
          </div>

          <h1 className="font-term-serif italic font-normal text-[clamp(26px,4vw,38px)] leading-tight text-term-ink m-0 mb-[3vh] text-balance">
            Marcos Ramos
          </h1>

          <div className="font-term-serif text-[17px] leading-[1.75] text-term-ink max-w-[66ch]">
            <p className="mb-[1.5em]">
              Doutor em Letras, certificado em Estudos Afro-Latino-Americanos
              pela Universidade de Harvard, sou professor e pesquisador. Meus
              temas principais são literatura, educação e tecnologia. Atuo na
              pós-graduação com pesquisa e orientação de teses, e
              concomitantemente, no desenvolvimento de projetos e
              consultorias para instituições públicas, privadas e do
              terceiro setor.
            </p>

            <h2 className="font-term-mono font-semibold text-[13px] tracking-wide uppercase text-term-accent2 mt-[2.6em] mb-[1em] before:content-['##_'] before:text-term-muted-2">
              trajetória
            </h2>
            <p className="mb-[1.5em]">
              Minha formação atravessa os estudos literários e as ciências
              humanas e sociais. Minha tese de doutorado,{" "}
              <em>O Pacto na Mira do Ofá</em>, investiga os temas como
              pensamento social brasileiro, tradição radical negra,
              imaginação radical, música e literatura.
            </p>
            <p className="mb-[1.5em]">
              Fui professor visitante no Departamento de Literatura da
              Universidad Nacional de Colombia entre 2022 e 2025, e professor
              convidado em instituições como a Universidad de La Habana
              (Cuba), a Universidad Andina Simón Bolívar (Equador) e a
              Universidade Eduardo Mondlane (Moçambique). Organizo e curo o
              Ciclo Afro, iniciativa já em três edições — na Feira
              Internacional do Livro de Bogotá (FILBo), na Universidade
              Federal do Recôncavo da Bahia (UFRB) e em sua edição inicial —,
              articulando ministérios, prefeituras, universidades e
              instituições culturais em torno das artes e epistemologias das
              diásporas africanas.
            </p>
            <p className="mb-[1.5em]">
              Em paralelo a essa trajetória, atuo também na gestão, no
              desenho e no desenvolvimento de tecnologias para instituições
              de ensino e cultura: apoio processos de desenvolvimento
              institucional e o desenho de soluções — aplicações e softwares
              — voltadas a esse setor. São duas inscrições profundas e
              simultâneas: uma na pesquisa; outra na gestão e na tecnologia.
            </p>

            <h2 className="font-term-mono font-semibold text-[13px] tracking-wide uppercase text-term-accent2 mt-[2.6em] mb-[1em] before:content-['##_'] before:text-term-muted-2">
              livros publicados
            </h2>
            <ul className="mb-[1.5em] pl-5 space-y-1.5">
              <li>
                Teorias da Canção: Percursos, Fundamentos e Metodologias —
                uma introdução (2025)
              </li>
              <li>
                Dioses que danzan: cuentos tradicionales de los Orishas
                (2024)
              </li>
              <li>Balaio de Gato (2022)</li>
              <li>
                Anatomia da Elipse: Escritos sobre Nacionalismo, Raça e
                Patriarcado (2017)
              </li>
              <li>O piano à imagem do deserto (2014)</li>
              <li>Um corpo que se escreve Pedra (2012)</li>
            </ul>
          </div>
        </div>
      </div>

      <TermStatusbar left="⎇ main" right="UTF-8 · LF · Markdown" />
    </div>
  );
}
