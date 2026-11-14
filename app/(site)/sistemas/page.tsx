import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/brand/Arrow";
import { getConcepts, getObjects } from "@/lib/data";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Portfólio de Desenvolvimento — Marcos Ramos",
  description:
    "Plataformas e aplicações web desenvolvidas do zero, em produção real.",
};

// objetos vêm do banco e podem ser criados a qualquer momento via /admin
export const dynamic = "force-dynamic";

/** Primeira captura de tela de cada sistema, usada como imagem da linha
 * — os arquivos vivem em public/sistemas/<id>/ mas o nome de cada arquivo
 * é específico do conteúdo (ver content/<id>.mdx para a galeria completa). */
const THUMBNAILS: Record<string, string> = {
  "painel-pmo": "/sistemas/painel-pmo/01-dashboard.png",
  "matriz-curricular": "/sistemas/matriz-curricular/01-mapa-fases.png",
  "rede-cruzada-evidenciacao": "/sistemas/rede-cruzada-evidenciacao/01-dashboard.png",
  "elo-nucleo-pulsante": "/sistemas/elo-nucleo-pulsante/01-painel-nucleo.png",
};

export default async function SistemasPage() {
  const [allObjects, concepts] = await Promise.all([getObjects(), getConcepts()]);
  const sistemas = allObjects.filter((o) => o.type === "sistema");
  const conceptLabel = new Map(concepts.map((c) => [c.id, c.label]));

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active="sistemas" />

      <main className="flex-1 wrap pt-16 md:pt-24">
        <header className="grid-12 gap-y-8 pb-16">
          <h1 className="title col-span-12 md:col-span-10 text-step-5 md:text-step-7">
            portfólio de desenvolvimento
          </h1>
          <p className="m-0 col-span-12 md:col-span-5 text-step-1 leading-[1.35] text-ink-2">
            Plataformas e aplicações web que desenvolvi do zero — arquitetura,
            banco de dados, deploy e operação contínua — para organizações
            educacionais reais. Não são protótipos: estão em uso diário.
          </p>
        </header>

        <ul className="m-0 list-none p-0">
          {sistemas.map((sistema) => {
            const objectConcepts = sistema.concepts
              .map((cid) => conceptLabel.get(cid) ?? cid)
              .slice(0, 3);
            const thumbnail = THUMBNAILS[sistema.id];

            return (
              <li
                key={sistema.id}
                className="grid-12 items-start gap-y-8 border-t border-rule py-12"
              >
                <div className="col-span-12 md:col-span-4">
                  <p className="data m-0 mb-4">
                    {sistema.year} · em produção
                  </p>
                  <Link href={`/objeto/${sistema.id}`} className="text-ink no-underline hover:text-action-text">
                    <h2 className="m-0 mb-4 text-step-3 font-normal leading-[1.1] tracking-[-0.025em]">
                      {sistema.title}
                    </h2>
                  </Link>
                  <p className="m-0 mb-4 text-ink-2">{sistema.shortDescription}</p>
                  {objectConcepts.length > 0 && (
                    <p className="m-0 mb-8 text-ink-3">
                      {objectConcepts.join(" / ")}
                    </p>
                  )}
                  <Link href={`/objeto/${sistema.id}`} className="pill">
                    ver detalhes
                    <Arrow dir="right" />
                  </Link>
                </div>

                {thumbnail && (
                  <Link
                    href={`/objeto/${sistema.id}`}
                    aria-label={`Capturas de tela de ${sistema.title}`}
                    className="relative col-span-12 md:col-span-7 md:col-start-6 block aspect-video overflow-hidden border border-hair bg-surface"
                  >
                    <Image
                      src={thumbnail}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 58vw, 100vw"
                      className="img-bw object-cover object-top"
                    />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {sistemas.length === 0 && (
          <p className="text-ink-2">Nenhum sistema cadastrado ainda.</p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
