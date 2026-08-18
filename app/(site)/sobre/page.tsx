import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Marcos Ramos — currículo e contato",
  description:
    "Nota biográfica, formação e contato de Marcos Ramos — professor, pesquisador e consultor em educação e tecnologia.",
};

/**
 * Página de currículo/contato completa — texto real, validado com o
 * próprio Marcos Ramos.
 */
export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active="sobre" />

      <div className="flex-1 px-[6vw] py-[7vh]">
        <div className="max-w-[680px] mx-auto">
          <h1 className="text-[clamp(28px,3.6vw,42px)] font-semibold tracking-[-0.015em] mb-6">
            Marcos Ramos
          </h1>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-muted py-4 border-y border-line mb-10">
            <span>
              <b className="text-ink font-semibold">Papel:</b> Professor, pesquisador · Consultor em Educação e Tecnologia · Desenvolvedor
            </span>
            <span>
              <b className="text-ink font-semibold">Formação:</b> Dr. em Letras (UFES) · Estudos Afro-Latino-Americanos (Harvard)
            </span>
            <span>
              <b className="text-ink font-semibold">Contato:</b>{" "}
              <a href="mailto:marcosramos.email@gmail.com" className="text-ink hover:text-accent">
                e-mail
              </a>
              {" · "}
              <a href="https://orcid.org/0000-0003-3485-8462" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent">
                ORCID
              </a>
              {" · "}
              <a href="https://independent.academia.edu/MarcosRamos443" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent">
                Academia.edu
              </a>
              {" · "}
              <a href="http://lattes.cnpq.br/6494749060939079" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent">
                Lattes
              </a>
            </span>
          </div>

          <div className="text-[16px] leading-[1.75] text-ink">
            <p className="mb-[1.5em]">
              Doutor em Letras, certificado em Estudos Afro-Latino-Americanos
              pela Universidade de Harvard, sou professor e pesquisador. Meus
              temas principais são literatura, educação e tecnologia. Atuo na
              pós-graduação com pesquisa e orientação de teses, e
              concomitantemente, no desenvolvimento de projetos e
              consultorias para instituições públicas, privadas e do
              terceiro setor.
            </p>

            <h2 className="text-[13px] font-semibold tracking-wide uppercase text-muted mt-[2.6em] mb-[1em]">
              Trajetória
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

            <h2 className="text-[13px] font-semibold tracking-wide uppercase text-muted mt-[2.6em] mb-[1em]">
              Livros publicados
            </h2>
            <ul className="mb-[1.5em] pl-5 list-disc space-y-1.5">
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

      <SiteFooter />
    </div>
  );
}
