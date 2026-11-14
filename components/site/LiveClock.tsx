"use client";

import { useEffect, useState } from "react";

/** Hora local e cidade — dado, então vai em IBM Plex Mono. */
export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="data m-0">
      {time ?? "--:--"} · rio de janeiro, brasil
    </p>
  );
}
