import { Rings } from "@/components/brand/Motifs";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active={null} />

      <main className="flex-1 wrap grid-12 items-center gap-y-12 py-16 md:py-24">
        <div className="col-span-12 md:col-span-6">
          <h1 className="title mb-6 text-step-5 md:text-step-6">
            Este objeto ainda não existe.
          </h1>
          <p className="m-0 mb-8 max-w-[44ch] text-step-1 leading-[1.35] text-ink-2">
            O item que você procura não está no database — ou ainda não foi
            publicado.
          </p>
          <a href="/database" className="pill">
            voltar ao database
          </a>
        </div>
        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <Rings className="w-full max-w-[420px] text-ink" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
