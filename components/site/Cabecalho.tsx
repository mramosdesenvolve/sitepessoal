"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Cabeçalho do site: o nome à esquerda, o seletor de modo claro/escuro à
 * direita. Em telas estreitas ele fica fixo no topo e some ao rolar para
 * baixo, voltando ao rolar para cima.
 */
export function Cabecalho() {
  const [escuro, setEscuro] = useState(false);
  const [oculto, setOculto] = useState(false);
  const ultimo = useRef(0);

  useEffect(() => {
    const el = document.documentElement;
    const escolhido = el.dataset.colorMode;
    setEscuro(
      escolhido
        ? escolhido === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  useEffect(() => {
    function aoRolar() {
      const y = window.scrollY;
      setOculto(y > ultimo.current && y > 80);
      ultimo.current = y;
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  function alternar(marcado: boolean) {
    setEscuro(marcado);
    const modo = marcado ? "dark" : "light";
    document.documentElement.dataset.colorMode = modo;
    try {
      localStorage.setItem("color-mode", modo);
    } catch {
      // sem armazenamento: vale só nesta visita
    }
  }

  return (
    <header className="cabecalho" data-hidden={oculto ? "" : undefined}>
      <div className="coluna cabecalho-barra">
        <Link href="/" className="cabecalho-nome">
          Marcos Ramos
        </Link>
        <span className="modo">
          <input
            id="modo-escuro"
            type="checkbox"
            aria-label="Modo escuro"
            checked={escuro}
            onChange={(e) => alternar(e.target.checked)}
          />
          <label htmlFor="modo-escuro" />
        </span>
      </div>
    </header>
  );
}
