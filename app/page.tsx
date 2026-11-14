import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/brand/Arrow";
import { LiveClock } from "@/components/site/LiveClock";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { getConcepts, getObjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Investigo como a educação e a tecnologia podem produzir novas formas de imaginar o mundo.",
};

// as contagens vêm do banco — mudam a qualquer momento via /admin
export const dynamic = "force-dynamic";

interface RowProps {
  href: string;
  title: string;
  description: string;
  tag: string;
  detail: string;
}

/** Linha de seção: fio preto em cima, hover inverte (preto ↔ papel). */
function SectionRow({ href, title, description, tag, detail }: RowProps) {
  return (
    <li className="border-t border-rule last:border-b">
      <Link
        href={href}
        className="group block text-ink no-underline transition-colors duration-quick ease-out hover:bg-inverse hover:text-on-inverse"
      >
        <div className="wrap grid-12 items-start gap-y-6 py-10">
          <div className="col-span-12 md:col-span-6">
            <h2 className="title title-ink text-step-5">{title}</h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-8">
            <p className="m-0 mb-4 max-w-[44ch] text-ink-2 group-hover:text-on-inverse">
              {description}
            </p>
            <p className="data m-0 flex flex-wrap items-center gap-x-4 gap-y-2 group-hover:text-on-inverse">
              <span className="tag group-hover:border-current group-hover:text-on-inverse">
                {tag}
              </span>
              <span>{detail}</span>
            </p>
          </div>
          <div className="hidden md:col-span-1 md:col-start-12 md:flex justify-end pt-3">
            <Arrow dir="right" className="h-8 w-8" />
          </div>
        </div>
      </Link>
    </li>
  );
}

export default async function Home() {
  const [objects, concepts] = await Promise.all([getObjects(), getConcepts()]);

  const sistemas = objects.filter((o) => o.type === "sistema");
  const artigos = objects.filter((o) => o.type === "artigo");
  const palestras = objects.filter((o) => o.type === "palestra");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active={null} />

      <main className="flex-1">
        <section className="wrap pt-12 pb-16 md:pt-16 md:pb-20">
          <h1 className="poster max-w-[1100px] text-balance leading-[0.98] [font-size:clamp(2.5rem,6vw,var(--text-7))]">
            investigo como a educação e a tecnologia podem produzir novas
            formas de <span className="text-signal">imaginar o mundo</span>
          </h1>

          <div className="mt-12 md:mt-16">
            <LiveClock />
          </div>
        </section>

        <section className="wrap pb-20">
          <dl className="m-0">
            <div className="grid-12 gap-y-2 border-t border-rule py-6">
              <dt className="strong col-span-12 md:col-span-3">formação</dt>
              <dd className="m-0 col-span-12 md:col-span-9 max-w-[62ch]">
                Dr. em Letras (UFES) · Estudos Afro-Latino-Americanos (Harvard)
              </dd>
            </div>
            <div className="grid-12 gap-y-2 border-t border-rule py-6">
              <dt className="strong col-span-12 md:col-span-3">papel</dt>
              <dd className="m-0 col-span-12 md:col-span-9 max-w-[62ch]">
                Professor, pesquisador, consultor em educação e tecnologia e
                desenvolvedor
              </dd>
            </div>
          </dl>
          <div className="border-t border-rule pt-6">
            <Link href="/sobre" className="pill">
              ler biografia
              <Arrow dir="right" />
            </Link>
          </div>
        </section>


        <ul className="m-0 list-none p-0">
          <SectionRow
            href="/database"
            title="database"
            description="Artigos, papers, ensaios, palestras, podcasts e livros sobre literatura, cultura afro-brasileira, educação e tecnologia — publicados ao longo de mais de uma década, agora reunidos num só lugar."
            tag={`${objects.length} objetos`}
            detail={`${artigos.length} artigos · ${palestras.length} palestras · ${concepts.length} conceitos`}
          />
          <SectionRow
            href="/sistemas"
            title="portfólio de desenvolvimento"
            description="Plataformas web que desenvolvi do zero — arquitetura, banco de dados, deploy e operação contínua — para organizações educacionais reais. Não são protótipos: estão em uso diário."
            tag={`${sistemas.length} sistemas`}
            detail="em produção real"
          />
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
