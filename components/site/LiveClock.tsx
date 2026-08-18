"use client";

import { useEffect, useState } from "react";

/** Pequeno relógio ao vivo — detalhe pessoal, ecoa onur.design. */
export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    }
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex items-center gap-2 text-[13px] text-muted mb-[34px]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2e9e5b] shrink-0" aria-hidden="true" />
      <span>{time ?? "—:—"}</span>
      <span>· São Paulo, Brasil</span>
    </p>
  );
}
