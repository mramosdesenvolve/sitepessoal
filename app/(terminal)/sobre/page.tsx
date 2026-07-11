import type { Metadata } from "next";
import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";

export const metadata: Metadata = {
  title: "Marcos Ramos — currículo e contato",
  description:
    "Nota biográfica, formação e contato de Marcos Ramos — escritor, crítico literário e musical, e consultor em desenvolvimento institucional e tecnológico.",
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
                &quot;crítico literário e musical&quot;
              </span>{" "}
              | <span className="text-term-accent">&quot;consultor institucional e tecnológico&quot;</span>,
            </div>
            <div className="pl-4">
              <span className="text-term-accent2-dim">formação</span>: [
              <span className="text-term-accent">&quot;Harvard&quot;</span>,{" "}
              <span className="text-term-accent">&quot;Dr. UFES 2024&quot;</span>,{" "}
              <span className="text-term-accent">&quot;Msc. UFES 2016&quot;</span>],
            </div>
            <div className="pl-4">
              <span className="text-term-accent2-dim">contato</span>:{" "}
              <a
                href="mailto:marcosramosjunior@gmail.com"
                className="text-term-accent hover:text-term-accent2"
              >
                &quot;marcosramosjunior@gmail.com&quot;
              </a>
              ,
            </div>
            <div className="pl-4">
              <span className="text-term-accent2-dim">perfis</span>: [
              <a
                href="https://orcid.org/0000-0003-3485-8462"
                target="_blank"
                rel="noopener noreferrer"
                className="text-term-accent hover:text-term-accent2"
              >
                &quot;ORCID↗&quot;
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
              Escritor, pesquisador e crítico literário e musical — e, em
              paralelo, consultor em desenvolvimento institucional e
              tecnológico para instituições de ensino e cultura. Transito
              entre a pesquisa sobre literatura, música popular brasileira e
              culturas afro-diaspóricas, e o desenho de processos e soluções
              tecnológicas que sustentam essas mesmas instituições.
            </p>

            <h2 className="font-term-mono font-semibold text-[13px] tracking-wide uppercase text-term-accent2 mt-[2.6em] mb-[1em] before:content-['##_'] before:text-term-muted-2">
              trajetória
            </h2>
            <p className="mb-[1.5em]">
              Minha formação atravessa a crítica literária e os estudos de
              música popular brasileira, com foco em autores como Machado de
              Assis, Guimarães Rosa e Gilberto Freyre, e em compositores que
              vão do Recôncavo baiano ao Rio de Janeiro. Minha tese de
              doutorado, <em>O Pacto na Mira do Ofá</em>, investiga como a
              canção popular brasileira sustentou — e como uma estética
              radical negra expôs os limites de — o pacto conciliador do
              país.
            </p>
            <p className="mb-[1.5em]">
              Fui professor visitante no Departamento de Literatura da
              Universidad Nacional de Colombia entre 2022 e 2025, e professor
              convidado em instituições como a Universidad de La Habana, a
              Universidad Andina Simón Bolívar e a Universidade Eduardo
              Mondlane (Moçambique). Organizo e curo o Ciclo Afro, iniciativa
              já em três edições — na Feira Internacional do Livro de Bogotá
              (FILBo), na Universidade Federal do Recôncavo da Bahia (UFRB) e
              em sua edição inicial —, articulando ministérios, prefeituras,
              universidades e instituições culturais em torno da literatura,
              da música e da espiritualidade das diásporas africanas.
            </p>
            <p className="mb-[1.5em]">
              Como colaborador, publico crítica literária e musical em
              veículos como o Jornal A Gazeta, a Folha de São Paulo e a
              Revista Quatrocincoum, e apresento podcasts para a Rádio Batuta
              (Instituto Moreira Salles) sobre música popular brasileira.
            </p>
            <p className="mb-[1.5em]">
              Em paralelo a essa trajetória, atuo também na gestão, no
              desenho e no desenvolvimento de tecnologias para instituições
              de ensino e cultura: apoio processos de desenvolvimento
              institucional e o desenho de soluções — aplicações e softwares
              — voltadas a esse setor. São duas inscrições profundas e
              simultâneas: uma na pesquisa cultural, literária e
              educacional; outra na gestão e na tecnologia a serviço do
              desenvolvimento institucional.
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
