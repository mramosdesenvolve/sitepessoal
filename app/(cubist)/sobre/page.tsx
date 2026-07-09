import type { Metadata } from "next";
import { CubistCornerNav } from "@/components/CubistCornerNav";

export const metadata: Metadata = {
  title: "Marcos Ramos — currículo e contato",
  description:
    "Nota biográfica, formação e contato de Marcos Ramos — escritor, crítico literário e musical, e consultor em desenvolvimento institucional e tecnológico.",
};

/**
 * Página de currículo/contato — destino do clique no nome (e na foto) no
 * cabeçalho. Texto real, revisado e validado com o próprio Marcos Ramos
 * a partir do acervo publicado no site (ver conversa de origem).
 */
export default function SobrePage() {
  return (
    <>
      <CubistCornerNav />

      <main className="mx-auto max-w-3xl px-6 md:px-8 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,2fr)]">
          <div>
            <h1 className="text-3xl md:text-4xl leading-tight max-w-2xl">
              Marcos Ramos
            </h1>
            <p className="mt-4 text-base text-cubist-muted leading-relaxed max-w-prose">
              Escritor, pesquisador e crítico literário e musical — e, em
              paralelo, consultor em desenvolvimento institucional e
              tecnológico para instituições de ensino e cultura. Transito
              entre a pesquisa sobre literatura, música popular brasileira e
              culturas afro-diaspóricas, e o desenho de processos e soluções
              tecnológicas que sustentam essas mesmas instituições.
            </p>

            <div className="mt-10 max-w-prose text-[15px] leading-relaxed space-y-5">
              <section>
                <h2 className="text-xl mb-2">Trajetória</h2>
                <p>
                  Minha formação atravessa a crítica literária e os estudos de
                  música popular brasileira, com foco em autores como Machado
                  de Assis, Guimarães Rosa e Gilberto Freyre, e em
                  compositores que vão do Recôncavo baiano ao Rio de Janeiro.
                  Minha tese de doutorado, <em>O Pacto na Mira do Ofá</em>,
                  investiga como a canção popular brasileira sustentou — e
                  como uma estética radical negra expôs os limites de — o
                  pacto conciliador do país.
                </p>
                <p className="mt-3">
                  Fui professor visitante no Departamento de Literatura da
                  Universidad Nacional de Colombia entre 2022 e 2025, e
                  professor convidado em instituições como a Universidad de
                  La Habana, a Universidad Andina Simón Bolívar e a
                  Universidade Eduardo Mondlane (Moçambique). Organizo e curo
                  o Ciclo Afro, iniciativa já em três edições — na Feira
                  Internacional do Livro de Bogotá (FILBo), na Universidade
                  Federal do Recôncavo da Bahia (UFRB) e em sua edição
                  inicial —, articulando ministérios, prefeituras,
                  universidades e instituições culturais em torno da
                  literatura, da música e da espiritualidade das diásporas
                  africanas.
                </p>
                <p className="mt-3">
                  Como colaborador, publico crítica literária e musical em
                  veículos como o Jornal A Gazeta, a Folha de São Paulo e a
                  Revista Quatrocincoum, e apresento podcasts para a Rádio
                  Batuta (Instituto Moreira Salles) sobre música popular
                  brasileira.
                </p>
                <p className="mt-3">
                  Em paralelo a essa trajetória, atuo também na gestão, no
                  desenho e no desenvolvimento de tecnologias para
                  instituições de ensino e cultura: apoio processos de
                  desenvolvimento institucional e o desenho de soluções —
                  aplicações e softwares — voltadas a esse setor. São duas
                  inscrições profundas e simultâneas: uma na pesquisa
                  cultural, literária e educacional; outra na gestão e na
                  tecnologia a serviço do desenvolvimento institucional.
                </p>
              </section>

              <section>
                <h2 className="text-xl mb-2">Formação</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Certificado em Estudos Afro-Latino-Americanos —
                    Universidade de Harvard
                  </li>
                  <li>Doutorado em Estudos Literários — UFES (2024)</li>
                  <li>Mestrado em Letras — UFES (2016)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl mb-2">Livros publicados</h2>
                <ul className="list-disc pl-5 space-y-1">
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
              </section>
            </div>
          </div>

          <aside className="md:border-l md:border-cubist-line md:pl-8 h-fit space-y-6 font-cubist-mono">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-cubist-muted">
                Contato
              </h2>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="mailto:marcosramosjunior@gmail.com"
                    className="text-sm text-cubist-accent underline underline-offset-4 hover:no-underline"
                  >
                    marcosramosjunior@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-widest text-cubist-muted">
                Perfis
              </h2>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="https://orcid.org/0000-0003-3485-8462"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cubist-accent underline underline-offset-4 hover:no-underline"
                  >
                    ORCID ↗
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
