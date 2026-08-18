import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active={null} />

      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold m-0 mb-3">
            Este objeto ainda não existe.
          </h1>
          <p className="text-muted text-[14px] max-w-[46ch] mx-auto mb-6">
            O item que você procura não está no database — ou ainda não foi
            publicado.
          </p>
          <a
            href="/database"
            className="text-ink hover:text-accent border-b border-line no-underline text-[13px]"
          >
            ← voltar ao database
          </a>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
