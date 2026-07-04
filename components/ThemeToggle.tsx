"use client";

import { useLayoutEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Alterna entre os temas claro e escuro. O estado inicial do store é
 * sempre "light" (para casar com a renderização do servidor); o script
 * inline em app/layout.tsx já aplicou a classe `dark` em <html> antes do
 * hydration (evita flash de tema errado). Este useLayoutEffect só lê essa
 * classe e sincroniza o store — roda antes do paint, então o ícone nunca
 * pisca visivelmente, e a primeira renderização React ainda casa com o
 * servidor (sem warning de hydration mismatch).
 */
export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  useLayoutEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, [setTheme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={themeToggleLabel(theme)}
      title={themeToggleLabel(theme)}
      className="shrink-0 border border-line rounded-full p-1.5 text-ink hover:border-accent hover:text-accent transition-colors"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function themeToggleLabel(theme: string) {
  return theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
    </svg>
  );
}
