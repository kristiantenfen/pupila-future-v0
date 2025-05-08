"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Versao {
  plataforma: string
  formato: string
  elementos: any[]
  timestamp: string
}

interface PecasStoreState {
  elementos: any[]
  versoes: Versao[]
  setElementos: (elementos: any[]) => void
  resetElementos: (elementosPadrao?: any[]) => void
  salvarVersao: (versao: Versao) => void
  carregarVersao: (versao: Versao) => void
}

export const usePecasStore = create<PecasStoreState>()(
  persist(
    (set) => ({
      elementos: [],
      versoes: [],
      setElementos: (elementos) => set({ elementos }),
      resetElementos: (elementosPadrao = []) =>
        set({
          elementos: Array.isArray(elementosPadrao) ? elementosPadrao : [],
        }),
      salvarVersao: (versao) =>
        set((state) => ({
          versoes: [versao, ...state.versoes].slice(0, 20), // Limita a 20 versões
        })),
      carregarVersao: (versao) =>
        set({
          elementos: [...versao.elementos],
        }),
    }),
    {
      name: "pecas-store",
    },
  ),
)
