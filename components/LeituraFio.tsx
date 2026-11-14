"use client";

import { useEffect, useRef } from "react";

/**
 * Fio de leitura: 4px de vermelho no topo da tela, que cresce conforme o
 * texto é percorrido. É estado (onde estou no texto), então segue a regra do
 * sistema para estados — fio de 4px.
 */
export function LeituraFio() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      ref.current?.style.setProperty("--progresso", progress.toFixed(4));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="leitura-fio" aria-hidden="true" />;
}
