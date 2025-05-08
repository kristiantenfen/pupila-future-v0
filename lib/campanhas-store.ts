"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Campanha {
  id: string
  nome: string
  descricao: string
  plataformas: string[]
  criadoEm: string
  modificadoEm: string
  assets: {
    plataforma: string
    formato: string
    elementos: any[]
  }[]
}

interface CampanhasStoreState {
  campanhas: Campanha[]
  campanhaAtual: Campanha | null
  adicionarCampanha: (campanha: Omit<Campanha, "id" | "criadoEm" | "modificadoEm" | "assets">) => string
  atualizarCampanha: (id: string, atualizacoes: Partial<Omit<Campanha, "id" | "criadoEm">>) => void
  removerCampanha: (id: string) => void
  selecionarCampanha: (id: string) => void
  adicionarAsset: (campanhaId: string, asset: { plataforma: string; formato: string; elementos: any[] }) => void
  atualizarAsset: (campanhaId: string, plataforma: string, formato: string, elementos: any[]) => void
  obterAsset: (
    campanhaId: string,
    plataforma: string,
    formato: string,
  ) => { plataforma: string; formato: string; elementos: any[] } | undefined
}

export const useCampanhasStore = create<CampanhasStoreState>()(
  persist(
    (set, get) => ({
      campanhas: [],
      campanhaAtual: null,

      adicionarCampanha: (campanha) => {
        const id = `campanha-${Date.now()}`
        const novaCampanha: Campanha = {
          ...campanha,
          id,
          criadoEm: new Date().toISOString(),
          modificadoEm: new Date().toISOString(),
          assets: [],
        }

        set((state) => ({
          campanhas: [...state.campanhas, novaCampanha],
          campanhaAtual: novaCampanha,
        }))

        return id
      },

      atualizarCampanha: (id, atualizacoes) => {
        set((state) => ({
          campanhas: state.campanhas.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...atualizacoes,
                  modificadoEm: new Date().toISOString(),
                }
              : c,
          ),
          campanhaAtual:
            state.campanhaAtual?.id === id
              ? {
                  ...state.campanhaAtual,
                  ...atualizacoes,
                  modificadoEm: new Date().toISOString(),
                }
              : state.campanhaAtual,
        }))
      },

      removerCampanha: (id) => {
        set((state) => ({
          campanhas: state.campanhas.filter((c) => c.id !== id),
          campanhaAtual: state.campanhaAtual?.id === id ? null : state.campanhaAtual,
        }))
      },

      selecionarCampanha: (id) => {
        const campanha = get().campanhas.find((c) => c.id === id) || null
        set({ campanhaAtual: campanha })
      },

      adicionarAsset: (campanhaId, asset) => {
        set((state) => {
          const campanhas = state.campanhas.map((c) => {
            if (c.id !== campanhaId) return c

            // Verifica se já existe um asset para esta plataforma/formato
            const assetExistente = c.assets.findIndex(
              (a) => a.plataforma === asset.plataforma && a.formato === asset.formato,
            )

            let assets
            if (assetExistente >= 0) {
              // Atualiza o asset existente
              assets = [...c.assets]
              assets[assetExistente] = asset
            } else {
              // Adiciona um novo asset
              assets = [...c.assets, asset]
            }

            return {
              ...c,
              assets,
              modificadoEm: new Date().toISOString(),
            }
          })

          // Atualiza também a campanha atual se for a mesma
          const campanhaAtual =
            state.campanhaAtual?.id === campanhaId
              ? campanhas.find((c) => c.id === campanhaId) || null
              : state.campanhaAtual

          return { campanhas, campanhaAtual }
        })
      },

      atualizarAsset: (campanhaId, plataforma, formato, elementos) => {
        set((state) => {
          const campanhas = state.campanhas.map((c) => {
            if (c.id !== campanhaId) return c

            const assets = c.assets.map((a) => {
              if (a.plataforma === plataforma && a.formato === formato) {
                return { ...a, elementos }
              }
              return a
            })

            return {
              ...c,
              assets,
              modificadoEm: new Date().toISOString(),
            }
          })

          // Atualiza também a campanha atual se for a mesma
          const campanhaAtual =
            state.campanhaAtual?.id === campanhaId
              ? campanhas.find((c) => c.id === campanhaId) || null
              : state.campanhaAtual

          return { campanhas, campanhaAtual }
        })
      },

      obterAsset: (campanhaId, plataforma, formato) => {
        const campanha = get().campanhas.find((c) => c.id === campanhaId)
        if (!campanha) return undefined

        return campanha.assets.find((a) => a.plataforma === plataforma && a.formato === formato)
      },
    }),
    {
      name: "campanhas-store",
    },
  ),
)
