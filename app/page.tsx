import type { Metadata } from "next";
import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";
import { AmbientGraph } from "@/components/AmbientGraph";
import { getMostRecentObject } from "@/lib/data";

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Investigo como a educação e a tecnologia podem produzir novas formas de imaginar o mundo.",
};

// última_publicação puxa do banco — pode mudar a qualquer momento via /admin
export const dynamic = "force-dynamic";

const BOOT_LINES = [
  "$ ssh marcos.dev",
  "Connecting to marcos.dev... ok",
  "Authenticating session... ok",
  "Mounting /database /sobre /contato... ok",
  "Loading database... ok",
  "Welcome back.",
];

/**
 * Home — identidade "terminal" (editor de código): sequência de boot em
 * CSS puro (sem JS, respeita prefers-reduced-motion via globals.css) que
 * assenta na tela final, um editor de código de tela cheia com a bio como
 * "arquivo" sobre.md. Sem header/footer do site — só a moldura terminal.
 */
export default async function Home() {
  const recent = await getMostRecentObject();

  return (
    <div className="relative h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <div
        className="term-boot-hide absolute inset-0 z-50 bg-term-bg px-[8vw] py-[10vh] text-[13px] text-term-muted"
        aria-hidden="true"
      >
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className="term-boot-line whitespace-pre"
            style={{ animationDelay: `${0.05 + i * 0.15}s` }}
          >
            {line.endsWith("ok") ? (
              <>
                {line.slice(0, -2)}
                <span className="text-term-accent2">ok</span>
              </>
            ) : (
              line
            )}
          </div>
        ))}
      </div>

      <div className="term-fade-in h-full flex flex-col">
        <TermTitlebar path="sobre.md" />
        <TermTabs active="sobre" />

        {/* única região com scroll — mesmo padrão de /sobre, /grafo etc.:
            cabeçalho/abas/status bar ficam fixos, só o conteúdo rola */}
        <div className="flex-1 overflow-y-auto bg-term-inset">
          <div className="flex min-h-full">
            <div className="hidden md:block shrink-0 pt-[6vh] pl-[22px] pr-[14px] text-right text-[12.5px] text-term-muted-2 border-r border-term-line select-none">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="h-[3.4vh] min-h-[24px]">
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="flex-1 min-w-0 lg:flex-[1.35] pt-[6vh] px-[5vw] pb-[6vh]">
            <p className="flex items-center gap-2 text-[clamp(11px,1.2vw,12px)] text-term-muted mb-[3vh]">
              <span className="w-4 h-px bg-term-accent2-dim shrink-0" aria-hidden="true" />
              professor · pesquisador · desenvolvedor
            </p>

            <h1 className="font-term-serif italic font-normal text-[clamp(32px,5vw,58px)] leading-[1.05] tracking-[-0.01em] m-0 mb-[2.2vh] text-balance">
              Marcos <span className="text-term-accent2">Ramos</span>
            </h1>

            <p className="font-term-serif text-[clamp(15px,1.6vw,18px)] leading-[1.6] text-term-muted max-w-[46ch] mt-0 mb-[4.6vh]">
              Investigo como a educação e a tecnologia podem produzir{" "}
              <span className="text-term-ink italic font-normal">
                novas formas de imaginar o mundo
              </span>
              .
            </p>

            <div className="flex flex-col gap-[13px] text-[clamp(12px,1.3vw,13px)]">
              <div className="grid grid-cols-[86px_1fr] gap-[18px] items-baseline border-t border-term-line pt-[13px]">
                <span className="text-term-accent2-dim tracking-wide lowercase">formação</span>
                <span className="text-term-ink">
                  Dr. em Letras <span className="text-term-muted-2">·</span> UFES{" "}
                  <span className="text-term-muted-2">/</span> Estudos Afro-Latino-Americanos{" "}
                  <span className="text-term-muted-2">·</span> Harvard
                </span>
              </div>

              <div className="grid grid-cols-[86px_1fr] gap-[18px] items-baseline border-t border-term-line pt-[13px]">
                <span className="text-term-accent2-dim tracking-wide lowercase">projetos</span>
                <ul className="flex flex-col gap-[6px] list-none m-0 p-0">
                  <li className="text-term-accent text-[12.5px]">
                    <span className="text-term-muted-2 mr-2">—</span>Implementação do ETIM · Senac RJ
                  </li>
                  <li className="text-term-accent text-[12.5px]">
                    <span className="text-term-muted-2 mr-2">—</span>Consultoria e Desenvolvimento · Rede Cruzada
                  </li>
                  <li className="text-term-accent text-[12.5px]">
                    <span className="text-term-muted-2 mr-2">—</span>Pesquisa e orientação · UNAL, Bogotá
                  </li>
                  <li className="text-term-accent text-[12.5px]">
                    <span className="text-term-muted-2 mr-2">—</span>Mixagem e masterização do álbum Agô
                  </li>
                  <li className="text-term-accent text-[12.5px]">
                    <span className="text-term-muted-2 mr-2">—</span>Revisão do livro El Brasil no existe (Universidad Nacional de Colombia, 2022–2025)
                  </li>
                </ul>
              </div>

              {recent && (
                <div className="grid grid-cols-[86px_1fr] gap-[18px] items-start border-t border-term-line pt-[13px]">
                  <span className="text-term-accent2-dim tracking-wide lowercase pt-[2px]">última_pub.</span>
                  <div className="border border-term-line bg-gradient-to-b from-term-accent2/5 to-transparent px-4 py-3.5">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-term-muted mb-1.5">
                      {recent.type} · {recent.year}
                    </div>
                    <a
                      href={`/objeto/${recent.id}`}
                      className="text-term-ink no-underline border-b border-term-accent-dim hover:text-term-accent2 hover:border-term-accent2 transition-colors"
                    >
                      &quot;{recent.title}&quot;
                    </a>
                    <p className="text-term-muted text-[11.5px] leading-relaxed mt-1 mb-0">
                      {recent.shortDescription}
                      {recent.sourceUrl && recent.sourceName && (
                        <>
                          {" — publicado no "}
                          <a
                            href={recent.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-term-muted hover:text-term-accent2 underline decoration-term-line"
                          >
                            {recent.sourceName}↗
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <p className="hidden md:block text-[clamp(12px,1.3vw,13.5px)] text-term-muted mt-[3.6vh]">
              // clique numa aba acima, ou use o terminal abaixo ↓
            </p>
          </div>

          <div className="hidden lg:block lg:flex-1 relative border-l border-term-line overflow-hidden">
            <AmbientGraph />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, transparent 0%, rgb(var(--term-inset)) 92%)",
              }}
            />
            <p className="absolute left-6 bottom-6 text-[10.5px] tracking-wide text-term-muted-2">
              // 22 conceitos · rede em repouso
            </p>
          </div>
        </div>
        </div>

        <div className="hidden md:block border-t border-term-line bg-term-elevated px-[18px] py-3 shrink-0">
          <p className="text-[13px] m-0">
            <span className="text-term-accent2">marcos@ramos</span>
            <span className="text-term-muted">:</span>
            <span className="text-term-accent">~</span>
            <span className="text-term-muted">$</span> open
            <span className="term-cursor inline-block w-[7px] h-[15px] bg-term-accent2 align-[-3px] ml-1" />
          </p>
          <p className="text-[13px] m-0 mt-2 flex flex-wrap gap-x-[22px] gap-y-1">
            <a
              href="/database"
              className="text-term-ink no-underline border-b border-term-muted-2 hover:text-term-accent2 hover:border-term-accent2 transition-colors"
            >
              <span className="text-term-muted-2">#</span>database
            </a>
            <a
              href="/sistemas"
              className="text-term-ink no-underline border-b border-term-muted-2 hover:text-term-accent2 hover:border-term-accent2 transition-colors"
            >
              <span className="text-term-muted-2">#</span>portfólio
            </a>
            <a
              href="/grafo"
              className="text-term-ink no-underline border-b border-term-muted-2 hover:text-term-accent2 hover:border-term-accent2 transition-colors"
            >
              <span className="text-term-muted-2">#</span>grafo
            </a>
            <a
              href="/sobre"
              className="text-term-ink no-underline border-b border-term-muted-2 hover:text-term-accent2 hover:border-term-accent2 transition-colors"
            >
              <span className="text-term-muted-2">#</span>sobre
            </a>
            <a
              href="/contato"
              className="text-term-ink no-underline border-b border-term-muted-2 hover:text-term-accent2 hover:border-term-accent2 transition-colors"
            >
              <span className="text-term-muted-2">#</span>contato
            </a>
            <a
              href="https://marcosramos.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-term-ink no-underline border-b border-term-muted-2 hover:text-term-accent2 hover:border-term-accent2 transition-colors"
            >
              <span className="text-term-muted-2">#</span>substack↗
            </a>
            <a
              href="/api/curriculo"
              className="text-term-ink no-underline border-b border-term-muted-2 hover:text-term-accent2 hover:border-term-accent2 transition-colors"
            >
              <span className="text-term-muted-2">#</span>curriculo
            </a>
          </p>
        </div>

        <TermStatusbar left="⎇ main" right="UTF-8 · LF · Markdown" />
      </div>
    </div>
  );
}
