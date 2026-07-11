"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
  summary: string;
  author?: string;
}

/**
 * Compartilha só o essencial — título, resumo brevíssimo e autor, sem
 * imagem — via Web Share API nativa (mobile/alguns desktops) com
 * fallback de copiar para a área de transferência. O texto compartilhado
 * é montado aqui, não deriva de og:image nenhuma.
 */
export function ShareButton({ title, summary, author = "Marcos Ramos" }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleShare() {
    const url = window.location.href;
    const text = `${title}\n${summary}\n— ${author}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // usuário cancelou o share sheet — não é um erro a tratar
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="group inline-flex items-center gap-1.5 border border-term-line px-3 py-1.5 text-[11.5px] text-term-muted hover:border-term-accent2 hover:text-term-accent2 transition-colors"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12" />
        <path d="M8 7l4-4 4 4" />
        <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </svg>
      {status === "copied"
        ? "copiado ✓"
        : status === "error"
          ? "não foi possível copiar"
          : "compartilhar"}
    </button>
  );
}
