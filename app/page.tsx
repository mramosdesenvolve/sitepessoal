import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LiveClock } from "@/components/site/LiveClock";
import { getObjects, getConcepts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Investigo como a educação e a tecnologia podem produzir novas formas de imaginar o mundo.",
};

// as contagens vêm do banco — mudam a qualquer momento via /admin
export const dynamic = "force-dynamic";

interface LogItemProps {
  href: string;
  title: string;
  description: React.ReactNode;
  tag: string;
  detail: string;
}

function LogItem({ href, title, description, tag, detail }: LogItemProps) {
  return (
    <div className="py-[6vh] border-t border-line last:border-b">
      <Link href={href} className="inline-block text-[clamp(26px,3.4vw,40px)] font-semibold tracking-[-0.015em] text-ink no-underline hover:text-accent transition-colors mb-[18px]">
        {title}
      </Link>
      <p className="text-[14.5px] leading-[1.7] text-muted max-w-[640px] mb-[22px]">
        {description}
      </p>
      <div className="flex items-center gap-4 text-[12.5px]">
        <span className="px-[11px] py-[5px] border border-line rounded-full text-ink font-medium">
          {tag}
        </span>
        <span className="text-muted">{detail}</span>
        <span className="ml-auto text-muted-2">→</span>
      </div>
    </div>
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

      <div className="flex-1">
        <div className="max-w-[1180px] mx-auto px-[6vw] pt-[9vh] pb-[4vh]">
          <p className="text-[clamp(28px,4vw,60px)] font-semibold leading-[1.18] tracking-[-0.018em] max-w-[820px] mb-8 text-balance">
            Sou Marcos Ramos, professor, pesquisador e desenvolvedor.
            Investigo como a educação e a tecnologia podem produzir{" "}
            <span className="text-accent">
              novas formas de imaginar o mundo
            </span>
            .
          </p>

          <LiveClock />

          <Link
            href="/sobre"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink no-underline pb-3.5 border-b border-line w-full max-w-[490px] mb-4 transition-colors"
          >
            Ler biografia completa
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>

          <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 text-[13px] text-muted py-4 border-b border-line mb-[8vh]">
            <span>
              <b className="text-ink font-semibold">Formação:</b> Dr. em Letras (UFES) · Estudos Afro-Latino-Americanos (Harvard)
            </span>
            <span>
              <b className="text-ink font-semibold">Papel:</b> também Consultor em Educação e Tecnologia
            </span>
          </div>

          <LogItem
            href="/database"
            title="Database"
            description="Artigos, papers, ensaios, palestras, podcasts e livros sobre literatura, cultura afro-brasileira, educação e tecnologia — publicados ao longo de mais de uma década, agora reunidos num só lugar."
            tag={`${objects.length} objetos`}
            detail={`${artigos.length} artigos · ${palestras.length} palestras · ${concepts.length} conceitos`}
          />

          <LogItem
            href="/sistemas"
            title="Portfólio de Desenvolvimento"
            description="Plataformas web que desenvolvi do zero — arquitetura, banco de dados, deploy e operação contínua — para organizações educacionais reais. Não são protótipos: estão em uso diário."
            tag={`${sistemas.length} sistemas`}
            detail="em produção real"
          />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
