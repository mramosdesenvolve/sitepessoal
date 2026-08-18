"use client";

import { create } from "zustand";

/**
 * Estado global leve compartilhado entre o grafo e o painel lateral de
 * conceito — evita prop drilling entre componentes irmãos.
 */
interface AppState {
  /** conceito selecionado (clique em nó do grafo) */
  selectedConceptId: string | null;
  setSelectedConceptId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedConceptId: null,
  setSelectedConceptId: (selectedConceptId) => set({ selectedConceptId }),
}));
