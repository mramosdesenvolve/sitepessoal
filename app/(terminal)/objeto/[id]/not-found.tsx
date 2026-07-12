import { TermTitlebar, TermTabs, TermStatusbar } from "@/components/terminal/TermChrome";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path="404.md" />
      <TermTabs active={null} />

      <div className="flex-1 flex items-center justify-center bg-term-inset px-6 text-center">
        <div>
          <p className="text-term-accent2 text-xs mb-3">// Error: ENOENT</p>
          <h1 className="text-2xl font-term-serif italic font-normal m-0 mb-3">
            Este objeto ainda não existe.
          </h1>
          <p className="text-term-muted text-[13px] max-w-[46ch] mx-auto mb-6">
            O item que você procura não está no database — ou ainda não foi
            publicado.
          </p>
          <a
            href="/database"
            className="text-term-accent hover:text-term-accent2 border-b border-term-accent-dim hover:border-term-accent2 no-underline text-[13px]"
          >
            ← voltar ao database
          </a>
        </div>
      </div>

      <TermStatusbar left="⎇ main" right="404" />
    </div>
  );
}
