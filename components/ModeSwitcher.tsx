"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import type { Mode } from "@/types";

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "explorar", label: "Explorar", hint: "grafo de conceitos" },
  { id: "ler", label: "Ler", hint: "textos e falas" },
  { id: "construir", label: "Construir", hint: "ferramentas e projetos" },
];

/**
 * Alterna entre os três modos de navegação. Os modos consomem os mesmos
 * dados — apenas filtram e reorganizam a visualização.
 */
export function ModeSwitcher() {
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);

  return (
    <nav
      aria-label="Modos de navegação"
      className="flex gap-1 border border-line rounded-full p-1 w-fit"
    >
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            aria-pressed={active}
            title={m.hint}
            className={`relative px-4 py-1.5 text-sm rounded-full transition-colors ${
              active ? "text-paper" : "text-ink hover:text-accent"
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{m.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
