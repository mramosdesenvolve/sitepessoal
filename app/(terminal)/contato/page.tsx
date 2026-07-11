import type { Metadata } from "next";
import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";

export const metadata: Metadata = {
  title: "Contato — Marcos Ramos",
  description: "Fale com Marcos Ramos por e-mail ou WhatsApp.",
};

const EMAIL = "marcosramos.email@gmail.com";
const WHATSAPP_DISPLAY = "+55 11 94730005";
const WHATSAPP_HREF = "https://wa.me/551194730005";

/**
 * Página de contato — identidade "terminal": um script bash falso (variáveis
 * + comandos "open") que dobra de conteúdo real e de UI, no mesmo molde da
 * home (gutter de linhas + prompt $ clicável).
 */
export default function ContatoPage() {
  return (
    <div className="h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path="contato.sh" />
      <TermTabs active="contato" />

      <div className="flex-1 flex min-h-0 bg-term-inset overflow-y-auto">
        <div className="hidden md:block shrink-0 pt-[6vh] pl-[22px] pr-[14px] text-right text-[12.5px] text-term-muted-2 border-r border-term-line select-none">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="h-[3.4vh] min-h-[24px]">
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0 pt-[6vh] px-[6vw] md:px-[5vw] pb-[6vh]">
          <p className="text-[clamp(13px,1.6vw,16px)] m-0 mb-1">
            <span className="text-term-muted-2">#!/bin/bash</span>
          </p>
          <p className="text-term-muted text-[clamp(12px,1.3vw,13.5px)] m-0 mb-[3.4vh]">
            <span className="text-term-muted-2">#</span> dois canais diretos — escolha um comando abaixo
          </p>

          <a
            href={`mailto:${EMAIL}`}
            className="group block mb-3 no-underline"
          >
            <span className="text-term-muted-2">$</span>{" "}
            <span className="text-term-ink group-hover:text-term-accent2 transition-colors">
              open
            </span>{" "}
            <span className="text-term-accent group-hover:text-term-accent2 transition-colors">
              &quot;{EMAIL}&quot;
            </span>
          </a>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline"
          >
            <span className="text-term-muted-2">$</span>{" "}
            <span className="text-term-ink group-hover:text-term-accent2 transition-colors">
              open
            </span>{" "}
            <span className="text-term-accent group-hover:text-term-accent2 transition-colors">
              &quot;{WHATSAPP_DISPLAY}&quot;
            </span>
            <span className="term-cursor inline-block w-[7px] h-[15px] bg-term-accent2 align-[-3px] ml-1" />
          </a>

          <p className="text-term-muted text-[clamp(12px,1.3vw,13.5px)] mt-[4vh] mb-0">
            <span className="text-term-muted-2">#</span> respondo em até 2 dias úteis
          </p>
        </div>
      </div>

      <TermStatusbar left="⎇ main" right="bash" />
    </div>
  );
}
