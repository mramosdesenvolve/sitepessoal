import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getConcepts, getObjects } from "@/lib/data";
import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";

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
    <div className="min-h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path="portfolio.sys" />
      <TermTabs active="sistemas" />

      <div className="flex-1 bg-term-inset px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-term-ink text-lg font-medium mb-2">
            Portfólio de Desenvolvimento
          </h1>
          <p className="text-term-muted text-xs mb-1">
            // {sistemas.length} sistemas em produção
          </p>
          <p className="text-term-muted-2 text-xs mb-8 max-w-[62ch]">
            Plataformas e aplicações web que desenvolvi do zero — arquitetura,
            banco de dados, deploy e operação contínua — para organizações
            educacionais reais. Não são protótipos: estão em uso diário.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sistemas.map((sistema) => {
              const objectConcepts = sistema.concepts
                .map((cid) => conceptLabel.get(cid) ?? cid)
                .slice(0, 3);
              const thumbnail = THUMBNAILS[sistema.id];

              return (
                <div
                  key={sistema.id}
                  className="group flex flex-col border border-term-line bg-term-bg hover:border-term-accent2-dim transition-colors"
                >
                  <Link href={`/objeto/${sistema.id}`} className="block">
                    {thumbnail && (
                      <div className="relative aspect-video border-b border-term-line overflow-hidden bg-term-elevated">
                        <Image
                          src={thumbnail}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex items-center gap-2 mb-2 text-[10.5px] uppercase tracking-wide text-term-muted">
                      <span className="inline-flex items-center gap-1.5 border border-term-accent-dim px-2 py-0.5 text-term-accent">
                        <span className="w-1.5 h-1.5 rounded-full bg-term-accent" />
                        em produção
                      </span>
                      <span>{sistema.year}</span>
                    </div>

                    <Link href={`/objeto/${sistema.id}`} className="no-underline">
                      <h2 className="text-base leading-snug text-term-ink group-hover:text-term-accent2 transition-colors">
                        {sistema.title}
                      </h2>
                    </Link>

                    <p className="mt-1.5 text-[13px] text-term-muted leading-relaxed">
                      {sistema.shortDescription}
                    </p>

                    {objectConcepts.length > 0 && (
                      <p className="mt-2 text-[11px] text-term-accent/80">
                        {objectConcepts.join(" · ")}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-dashed border-term-line text-[12px]">
                      <Link
                        href={`/objeto/${sistema.id}`}
                        className="text-term-ink hover:text-term-accent2 no-underline border-b border-term-muted-2 hover:border-term-accent2 transition-colors"
                      >
                        ver detalhes →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {sistemas.length === 0 && (
            <p className="text-sm text-term-muted">Nenhum sistema cadastrado ainda.</p>
          )}
        </div>
      </div>

      <TermStatusbar left="⎇ main" right={`${sistemas.length} sistemas`} />
    </div>
  );
}
