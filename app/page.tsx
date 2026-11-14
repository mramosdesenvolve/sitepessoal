import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/brand/Arrow";
import { Panorama } from "@/components/Panorama";
import { RetratoLinhas } from "@/components/RetratoLinhas";
import { LiveClock } from "@/components/site/LiveClock";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { getConcepts, getObjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Estudo como a literatura pode produzir novas formas de imaginar o mundo.",
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
    <li className="reveal border-t border-rule last:border-b">
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
            <Arrow
              dir="right"
              className="h-8 w-8 transition-transform duration-base ease-out group-hover:translate-x-2"
            />
          </div>
        </div>
      </Link>
    </li>
  );
}

const HERO_LEAD =
  "estudo como a literatura pode produzir novas formas de";
const HERO_KEY = "imaginar o mundo";

// mapas de tom das poses (cinza + recorte), gerados das fotos originais
const RETRATO_POSES = [1, 2, 3, 4, 5, 6].map((n) => `/retrato/pose-${n}.png`);

/** Palavras da frase da capa, cada uma atrás da sua máscara (ver .hero-w). */
function HeroWords({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="hero-w" style={{ "--i": offset + i } as React.CSSProperties}>
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export default async function Home() {
  const [objects, concepts] = await Promise.all([getObjects(), getConcepts()]);

  const artigos = objects.filter((o) => o.type === "artigo");
  const palestras = objects.filter((o) => o.type === "palestra");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active={null} />

      <main className="flex-1">
        {/* frase à esquerda; à direita o retrato em traço, em pé sobre o fio
            que abre o panorama */}
        <section className="wrap pt-12 md:pt-16">
          <div className="grid-12 items-end gap-y-10">
            <div className="col-span-12 pb-4 md:col-span-7 md:pb-20">
              <h1 className="poster text-balance leading-[0.98] [font-size:clamp(2.5rem,5.4vw,var(--text-7))]">
                <HeroWords text={HERO_LEAD} />{" "}
                <span className="text-signal">
                  <HeroWords text={HERO_KEY} offset={HERO_LEAD.split(" ").length} />
                </span>
              </h1>

              <div className="mt-12 md:mt-16">
                <LiveClock />
              </div>
            </div>

            <div className="col-span-11 col-start-2 sm:col-span-7 sm:col-start-6 md:col-span-5 md:col-start-8">
              <RetratoLinhas
                poses={RETRATO_POSES}
                alt="Retrato de Marcos Ramos desenhado em linhas horizontais; uma sequência de poses que se alternam"
                className="ml-auto block aspect-[4/5] w-full cursor-crosshair md:w-[95%]"
              />
            </div>
          </div>
        </section>

        <section className="wrap pb-20 md:pb-28" aria-label="Panorama do acervo">
          <div className="border-t border-rule pt-8">
          <Panorama
            items={objects.map((o) => ({
              id: o.id,
              title: o.title,
              type: o.type,
              year: o.year,
              concepts: o.concepts,
            }))}
            concepts={concepts
              .filter((c) => c.objectIds.length > 0)
              .map((c) => ({
                id: c.id,
                label: c.label,
                description: c.description,
                count: c.objectIds.length,
              }))
              .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))}
          />
          </div>
        </section>

        <section className="reveal wrap pb-20">
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
                Professor, pesquisador e consultor em educação e tecnologia
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
            detail={`${artigos.length} artigos · ${palestras.length} palestras · ${concepts.filter((c) => c.objectIds.length > 0).length} conceitos`}
          />
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
