"use client";

import { useState } from "react";

interface IntroBioProps {
  /** primeiro parágrafo, sem o ponto final */
  primeiro: React.ReactNode;
  /** os demais parágrafos */
  resto: React.ReactNode;
}

/** A apresentação da página inicial. Em telas estreitas mostra só o primeiro
 * parágrafo, com "… Mais" para abrir o resto. */
export function IntroBio({ primeiro, resto }: IntroBioProps) {
  const [aberta, setAberta] = useState(false);

  return (
    <section className="intro" data-aberta={aberta ? "" : undefined}>
      <p>
        {primeiro}
        <span className="intro-ponto">.</span>
        <span className="intro-reticencias">&nbsp;… </span>
        <a
          href="#"
          role="button"
          className="intro-mais"
          onClick={(e) => {
            e.preventDefault();
            setAberta(true);
          }}
        >
          Mais
        </a>
      </p>
      <div className="intro-bio">{resto}</div>
    </section>
  );
}
