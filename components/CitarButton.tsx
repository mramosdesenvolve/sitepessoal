"use client";

import { useState } from "react";

interface CitarButtonProps {
  id: string;
  title: string;
  year: number;
}

const MESES = [
  "jan.", "fev.", "mar.", "abr.", "maio", "jun.",
  "jul.", "ago.", "set.", "out.", "nov.", "dez.",
];

/**
 * "Citar": monta a referência do objeto em ABNT e em BibTeX, com o endereço
 * da página e a data de acesso de hoje, prontas para copiar. Referência de
 * documento on-line — quando o texto saiu antes em revista ou livro, a
 * publicação original (nos links do objeto) é a fonte a citar.
 */
export function CitarButton({ id, title, year }: CitarButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"abnt" | "bibtex" | null>(null);
  const [ref, setRef] = useState<{ url: string; acesso: string; iso: string } | null>(null);

  function toggle() {
    if (!open) {
      const now = new Date();
      setRef({
        url: `${window.location.origin}/objeto/${id}`,
        acesso: `${now.getDate()} ${MESES[now.getMonth()]} ${now.getFullYear()}`,
        iso: now.toISOString().slice(0, 10),
      });
    }
    setOpen((v) => !v);
  }

  const abnt = ref
    ? `RAMOS, Marcos. ${title}. ${year}. Disponível em: ${ref.url}. Acesso em: ${ref.acesso}.`
    : "";
  const key = `ramos${year}${id.split("-").find((w) => w.length > 3) ?? id.split("-")[0]}`;
  const bibtex = ref
    ? `@misc{${key},\n  author  = {Ramos, Marcos},\n  title   = {${title}},\n  year    = {${year}},\n  url     = {${ref.url}},\n  urldate = {${ref.iso}}\n}`
    : "";

  async function copy(which: "abnt" | "bibtex") {
    try {
      await navigator.clipboard.writeText(which === "abnt" ? abnt : bibtex);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // sem permissão de área de transferência: o texto segue selecionável
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="citar-painel"
        aria-pressed={open}
        className="pill"
      >
        citar
      </button>

      {open && ref && (
        <div id="citar-painel" className="mt-6 basis-full border-t border-rule">
          <div className="grid-12 gap-y-3 py-5">
            <p className="strong m-0 col-span-12 md:col-span-2">abnt</p>
            <p className="m-0 col-span-12 max-w-measure md:col-span-8">
              RAMOS, Marcos. <strong className="strong">{title}</strong>. {year}. Disponível
              em: {ref.url}. Acesso em: {ref.acesso}.
            </p>
            <div className="col-span-12 md:col-span-2 md:text-right">
              <button type="button" onClick={() => copy("abnt")} className="pill">
                {copied === "abnt" ? "copiado" : "copiar"}
              </button>
            </div>
          </div>
          <div className="grid-12 gap-y-3 border-t border-hair py-5">
            <p className="strong m-0 col-span-12 md:col-span-2">bibtex</p>
            <pre className="m-0 col-span-12 overflow-x-auto font-mono text-step-0 leading-[1.5] md:col-span-8">
              {bibtex}
            </pre>
            <div className="col-span-12 md:col-span-2 md:text-right">
              <button type="button" onClick={() => copy("bibtex")} className="pill">
                {copied === "bibtex" ? "copiado" : "copiar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
