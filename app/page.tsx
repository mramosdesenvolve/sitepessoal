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
            primeiro="Marcos Ramos é professor e pesquisador, doutor em Letras, com estudos sobre literatura e pensamento social brasileiro"
            resto={
              <div className="texto-corpo">
                <p>
                  Sua tese de doutorado, <em>O Pacto na Mira do Ofá</em>,
                  investiga esse campo a partir da tradição radical negra, da
                  imaginação radical, da música e da literatura. Certificado em
                  Estudos Afro-Latino-Americanos pela Universidade de Harvard,
                  foi bolsista do Instituto Guimarães Rosa, do Ministério das
                  Relações Exteriores, e professor visitante no Departamento de
                  Literatura da Universidad Nacional de Colombia entre 2022 e
                  2025. Deu cursos e conferências como professor convidado na
                  Universidad de La Habana (Cuba), na Universidad Andina Simón
                  Bolívar (Equador), na Universidade Eduardo Mondlane
                  (Moçambique), entre outras. Organiza e cura o{" "}
                  <a
                    href="https://cicloafro.com.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ciclo Afro
                  </a>
                  .
                </p>
                <p>
                  Atualmente é Especialista em Educação da Cápsula de Inovação
                  do Senac Rio de Janeiro e consultor de instituições públicas,
                  privadas e do terceiro setor em temas como gestão, tecnologia,
                  cultura e educação.
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
