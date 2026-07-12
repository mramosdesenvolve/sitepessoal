import type { Metadata } from "next";
import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";
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

            <div className="flex-1 min-w-0 pt-[6vh] px-[5vw] pb-[6vh]">
            <h1 className="text-[clamp(20px,2.6vw,32px)] font-bold leading-tight tracking-tight m-0 mb-1 text-balance">
              <span className="text-term-accent2"># </span>Marcos Ramos
            </h1>

            <p className="text-term-muted text-[clamp(13px,1.6vw,16px)] mt-0 mb-[3.4vh] max-w-[62ch]">
              <span className="text-term-muted-2">&gt;</span> Investigo como
              a educação e a tecnologia podem produzir{" "}
              <b className="text-term-ink font-medium">
                novas formas de imaginar o mundo
              </b>
              .
            </p>

            <p className="text-[clamp(12.5px,1.4vw,14.5px)] m-0 mb-[1.1vh] text-term-ink">
              <span className="text-term-accent2-dim">formação</span>
              <span className="text-term-muted-2">:</span>{" "}
              <span className="text-term-accent">
                &quot;Dr. em Letras (UFES)&quot;
              </span>{" "}
              <span className="text-term-muted-2">|</span>{" "}
              <span className="text-term-accent">
                &quot;Estudos Afro-Latino-Americanos (Harvard)&quot;
              </span>
            </p>
            <p className="text-[clamp(12.5px,1.4vw,14.5px)] m-0 mb-[1.1vh] text-term-ink">
              <span className="text-term-accent2-dim">papel</span>
              <span className="text-term-muted-2">:</span>{" "}
              <span className="text-term-accent">
                &quot;Professor, pesquisador&quot;
              </span>{" "}
              <span className="text-term-muted-2">|</span>{" "}
              <span className="text-term-accent">
                &quot;Consultor em Educação e Tecnologia&quot;
              </span>{" "}
              <span className="text-term-muted-2">|</span>{" "}
              <span className="text-term-accent">&quot;Desenvolvedor&quot;</span>
            </p>
            <div className="text-[clamp(12.5px,1.4vw,14.5px)] m-0 mb-[1.1vh] text-term-ink">
              <span className="text-term-accent2-dim">projetos_atuais</span>
              <span className="text-term-muted-2">:</span>
              <ul className="mt-0.5 pl-4 space-y-0.5">
                <li>
                  <span className="text-term-muted-2">- </span>
                  <span className="text-term-accent">
                    &quot;Implementação do ETIM - Senac RJ&quot;
                  </span>
                </li>
                <li>
                  <span className="text-term-muted-2">- </span>
                  <span className="text-term-accent">
                    &quot;Consultoria e Desenvolvimento na Rede Cruzada&quot;
                  </span>
                </li>
                <li>
                  <span className="text-term-muted-2">- </span>
                  <span className="text-term-accent">
                    &quot;Pesquisa e orientação de projetos na UNAL (Bogotá)&quot;
                  </span>
                </li>
                <li>
                  <span className="text-term-muted-2">- </span>
                  <span className="text-term-accent">
                    &quot;Mixagem e masterização do álbum Agô&quot;
                  </span>
                </li>
                <li>
                  <span className="text-term-muted-2">- </span>
                  <span className="text-term-accent">
                    &quot;Revisão e finalização do livro El Brasil no existe -
                    Clases en la Universidad Nacional de Colômbia
                    (2022-2025)&quot;
                  </span>
                </li>
              </ul>
            </div>

            {recent && (
              <div className="mt-[2.4vh] mb-[1.1vh]">
                <p className="text-[clamp(12.5px,1.4vw,14.5px)] m-0 text-term-ink">
                  <span className="text-term-accent2-dim">
                    última_publicação
                  </span>
                  <span className="text-term-muted-2">:</span>{" "}
                  <a
                    href={`/objeto/${recent.id}`}
                    className="text-term-accent hover:text-term-accent2 no-underline border-b border-term-accent-dim hover:border-term-accent2 transition-colors"
                  >
                    &quot;{recent.title}&quot;
                  </a>{" "}
                  <span className="text-term-muted">
                    // {recent.type} · {recent.year}
                  </span>
                </p>
                <p className="text-[clamp(11.5px,1.3vw,13px)] m-0 mt-0.5 text-term-muted max-w-[58ch]">
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
            )}

            <p className="hidden md:block text-[clamp(12px,1.3vw,13.5px)] text-term-muted mt-[3vh]">
              // clique numa aba acima, ou use o terminal abaixo ↓
            </p>
          </div>

          <div className="hidden lg:block shrink-0 w-14 border-l border-term-line pt-[6vh] px-[10px] opacity-45">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`h-[3px] mb-2 rounded-sm bg-term-muted-2 ${
                  i % 4 === 3 ? "w-4/5 bg-term-accent-dim opacity-70" : i % 3 === 2 ? "w-3/5" : "w-full"
                }`}
              />
            ))}
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
          </p>
        </div>

        <TermStatusbar left="⎇ main" right="UTF-8 · LF · Markdown" />
      </div>
    </div>
  );
}
