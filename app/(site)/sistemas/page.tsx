import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

/** Primeira captura de tela de cada sistema, usada como thumbnail do card
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

      <div className="flex-1 px-[6vw] py-[7vh]">
        <div className="max-w-[900px] mx-auto">
          <h1 className="text-[clamp(28px,3.6vw,42px)] font-semibold tracking-[-0.015em] mb-3">
            Portfólio de Desenvolvimento
          </h1>
          <p className="text-[14.5px] text-muted max-w-[64ch] mb-12">
            Plataformas e aplicações web que desenvolvi do zero — arquitetura,
            banco de dados, deploy e operação contínua — para organizações
            educacionais reais. Não são protótipos: estão em uso diário.
          </p>

          {sistemas.map((sistema, i) => {
            const objectConcepts = sistema.concepts
              .map((cid) => conceptLabel.get(cid) ?? cid)
              .slice(0, 3);
            const thumbnail = THUMBNAILS[sistema.id];

            return (
              <div
                key={sistema.id}
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center py-12 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                {thumbnail && (
                  <Link
                    href={`/objeto/${sistema.id}`}
                    className={`block relative aspect-video overflow-hidden bg-paper border border-line ${
                      i % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    <Image
                      src={thumbnail}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover object-top"
                    />
                  </Link>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3 text-[11px] uppercase tracking-wide text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e9e5b]" />
                      em produção
                    </span>
                    <span className="text-muted-2">·</span>
                    <span>{sistema.year}</span>
                  </div>

                  <Link href={`/objeto/${sistema.id}`} className="no-underline">
                    <h2 className="text-[24px] font-semibold leading-snug text-ink hover:text-accent transition-colors mb-2">
                      {sistema.title}
                    </h2>
                  </Link>

                  <p className="text-[14px] text-muted leading-relaxed mb-3">
                    {sistema.shortDescription}
                  </p>

                  {objectConcepts.length > 0 && (
                    <p className="text-[12px] text-accent mb-4">
                      {objectConcepts.join(" · ")}
                    </p>
                  )}

                  <Link
                    href={`/objeto/${sistema.id}`}
                    className="text-[13px] text-ink hover:text-accent no-underline border-b border-line"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            );
          })}

          {sistemas.length === 0 && (
            <p className="text-sm text-muted">Nenhum sistema cadastrado ainda.</p>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
