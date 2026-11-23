import type { Metadata } from "next";
import Link from "next/link";
import { Cabecalho } from "@/components/site/Cabecalho";
import { IntroBio } from "@/components/site/IntroBio";
import { Rodape } from "@/components/site/Rodape";
import { getObjects } from "@/lib/data";
import type { ObjectType } from "@/types";

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Estudo como a literatura pode produzir novas formas de imaginar o mundo.",
};

// os objetos vêm do banco e mudam a qualquer momento via /admin
export const dynamic = "force-dynamic";

/** Seções da página, na ordem em que aparecem. Só entram as que tiverem
 * pelo menos um objeto. */
const SECOES: { tipos: ObjectType[]; titulo: string }[] = [
  { tipos: ["livro"], titulo: "Livros" },
  // ensaios também são artigos: uma seção só
  { tipos: ["artigo", "ensaio"], titulo: "Artigos" },
  { tipos: ["paper"], titulo: "Papers" },
  { tipos: ["metodologia"], titulo: "Metodologias" },
  { tipos: ["palestra"], titulo: "Palestras" },
  { tipos: ["podcast"], titulo: "Podcasts" },
  { tipos: ["projeto"], titulo: "Projetos" },
];

const EMAIL = "marcosramos.email@gmail.com";

const EXTERNOS: { titulo: string; links: { rotulo: string; href: string }[] }[] = [
  {
    titulo: "Pesquisa",
    links: [
      { rotulo: "Lattes", href: "http://lattes.cnpq.br/6494749060939079" },
      { rotulo: "ORCID", href: "https://orcid.org/0000-0003-3485-8462" },
      { rotulo: "Academia.edu", href: "https://independent.academia.edu/MarcosRamos443" },
      { rotulo: "Currículo em PDF", href: "/api/curriculo" },
    ],
  },
  {
    titulo: "Contato",
    links: [
      { rotulo: "E-mail", href: `mailto:${EMAIL}` },
      { rotulo: "WhatsApp", href: "https://wa.me/551194730005" },
    ],
  },
];

export default async function Home() {
  const objetos = await getObjects();

  return (
    <div className="page">
      <Cabecalho />

      <main>
        <div className="coluna">
          <h1 className="sr-only">Marcos Ramos</h1>

          <IntroBio
            primeiro="Doutor em Letras, certificado em Estudos Afro-Latino-Americanos pela Universidade de Harvard, sou professor e pesquisador"
            resto={
              <div className="texto-corpo">
                <p>
                  Meus temas principais são literatura, educação e tecnologia.
                  Atuo na pós-graduação com pesquisa e orientação de teses, e
                  concomitantemente, no desenvolvimento de projetos e
                  consultorias para instituições públicas, privadas e do
                  terceiro setor.
                </p>
                <p>
                  Minha formação atravessa os estudos literários e as ciências
                  humanas e sociais. Minha tese de doutorado,{" "}
                  <em>O Pacto na Mira do Ofá</em>, investiga os temas como
                  pensamento social brasileiro, tradição radical negra,
                  imaginação radical, música e literatura.
                </p>
                <p>
                  Fui professor visitante no Departamento de Literatura da
                  Universidad Nacional de Colombia entre 2022 e 2025, e
                  professor convidado em instituições como a Universidad de La
                  Habana (Cuba), a Universidad Andina Simón Bolívar (Equador) e
                  a Universidade Eduardo Mondlane (Moçambique). Organizo e curo
                  o Ciclo Afro, iniciativa já em três edições — na Feira
                  Internacional do Livro de Bogotá (FILBo), na Universidade
                  Federal do Recôncavo da Bahia (UFRB) e em sua edição inicial
                  —, articulando ministérios, prefeituras, universidades e
                  instituições culturais em torno das artes e epistemologias das
                  diásporas africanas.
                </p>
              </div>
            }
          />

          {SECOES.map(({ tipos, titulo }) => {
            const itens = objetos.filter((o) => tipos.includes(o.type));
            if (itens.length === 0) return null;
            return (
              <section key={titulo} className="secao">
                <h2>{titulo}</h2>
                <ul className="lista-links">
                  {itens.map((o) => (
                    <li key={o.id}>
                      <Link href={`/objeto/${o.id}`}>{o.title}</Link>
                      <span>({o.year})</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {EXTERNOS.map(({ titulo, links }) => (
            <section key={titulo} className="secao">
              <h2>{titulo}</h2>
              <ul className="lista-links">
                {links.map((l) => (
                  <li key={l.rotulo}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {l.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <Rodape />
    </div>
  );
}
