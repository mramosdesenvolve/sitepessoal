import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Contato — Marcos Ramos",
  description: "Fale com Marcos Ramos por e-mail ou WhatsApp.",
};

const EMAIL = "marcosramos.email@gmail.com";
const WHATSAPP_DISPLAY = "+55 11 94730005";
const WHATSAPP_HREF = "https://wa.me/551194730005";

export default function ContatoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active="contato" />

      <div className="flex-1 px-[6vw] py-[9vh]">
        <div className="max-w-[560px] mx-auto">
          <h1 className="text-[clamp(28px,3.6vw,42px)] font-semibold tracking-[-0.015em] mb-3">
            Contato
          </h1>
          <p className="text-[14.5px] text-muted mb-10">
            Dois canais diretos — escolha um.
          </p>

          <a
            href={`mailto:${EMAIL}`}
            className="group flex items-center justify-between py-5 border-t border-line no-underline"
          >
            <span>
              <span className="block text-[12px] uppercase tracking-wide text-muted mb-1">
                E-mail
              </span>
              <span className="text-[19px] font-medium text-ink group-hover:text-accent transition-colors">
                {EMAIL}
              </span>
            </span>
            <span className="text-muted-2 group-hover:text-accent transition-colors">→</span>
          </a>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-5 border-t border-b border-line no-underline"
          >
            <span>
              <span className="block text-[12px] uppercase tracking-wide text-muted mb-1">
                WhatsApp
              </span>
              <span className="text-[19px] font-medium text-ink group-hover:text-accent transition-colors">
                {WHATSAPP_DISPLAY}
              </span>
            </span>
            <span className="text-muted-2 group-hover:text-accent transition-colors">→</span>
          </a>

          <p className="text-[13px] text-muted mt-8">
            Respondo em até 2 dias úteis.
          </p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
