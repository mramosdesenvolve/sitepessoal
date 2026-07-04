"use client";

import { create } from "zustand";

export type Theme = "light" | "dark";

/**
 * Estado global leve compartilhado entre grafo, painel lateral, busca e
 * listas — evita prop drilling entre componentes irmãos.
 */
interface AppState {
  /** conceito selecionado (clique em nó do grafo ou chip no mobile) */
  selectedConceptId: string | null;
  setSelectedConceptId: (id: string | null) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  /**
   * Tema visual. O valor inicial é sempre "light" (para casar com a
   * primeira renderização no servidor); o valor real é sincronizado a
   * partir da classe já aplicada em <html> por ThemeToggle logo no mount
   * — ver componente para o porquê disso evitar flash/mismatch.
   */
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedConceptId: null,
  setSelectedConceptId: (selectedConceptId) => set({ selectedConceptId }),

  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  theme: "light",
  setTheme: (theme) => set({ theme }),
}));
