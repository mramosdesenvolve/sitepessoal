import type { Metadata } from "next";
import { Arrow } from "@/components/brand/Arrow";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";

export const metadata: Metadata = {
  title: "Contato — Marcos Ramos",
  description: "Fale com Marcos Ramos por e-mail ou WhatsApp.",
};

const EMAIL = "marcosramos.email@gmail.com";
const WHATSAPP_DISPLAY = "+55 11 94730005";
const WHATSAPP_HREF = "https://wa.me/551194730005";

const CANAIS = [
  { rotulo: "e-mail", valor: EMAIL, href: `mailto:${EMAIL}`, externo: false },
  { rotulo: "whatsapp", valor: WHATSAPP_DISPLAY, href: WHATSAPP_HREF, externo: true },
];

export default function ContatoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active="contato" />

      <main className="flex-1">
        <header className="wrap grid-12 gap-y-6 pt-16 pb-16 md:pt-24">
          <h1 className="title col-span-12 md:col-span-8 text-step-6 md:text-step-8">
            contato
          </h1>
          <p className="m-0 col-span-12 md:col-span-4 md:self-end text-step-1 leading-[1.35] text-ink-2">
            Dois canais diretos. Respondo em até 2 dias úteis.
          </p>
        </header>

        <ul className="m-0 list-none p-0">
          {CANAIS.map((canal) => (
            <li key={canal.rotulo} className="border-t border-rule last:border-b">
              <a
                href={canal.href}
                {...(canal.externo
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group block text-ink no-underline transition-colors duration-quick ease-out hover:bg-inverse hover:text-on-inverse"
              >
                <div className="wrap grid-12 items-center gap-y-2 py-10">
                  <span className="strong col-span-12 md:col-span-3 group-hover:text-on-inverse">
                    {canal.rotulo}
                  </span>
                  <span className="col-span-10 md:col-span-8 break-words text-step-3 leading-[1.1] tracking-[-0.02em] md:text-step-4">
                    {canal.valor}
                  </span>
                  <span className="col-span-2 md:col-span-1 flex justify-end">
                    <Arrow dir="right" className="h-8 w-8" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
