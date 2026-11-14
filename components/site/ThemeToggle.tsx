"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/**
 * Alternador de tema. O site abre no claro (principal); a escolha fica em
 * localStorage e é aplicada antes da pintura pelo script em app/layout.tsx.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // armazenamento bloqueado — o tema vale só nesta visita
    }
    setTheme(next);
  }

  return (
    <button type="button" onClick={toggle} className="pill">
      {theme === "light" ? "modo escuro" : "modo claro"}
    </button>
  );
}
