// Vamos reescrever completamente o store para usar uma abordagem mais direta

"use client"

import { create } from "zustand"

export interface ElementoCompartilhado {
  id: string
  nome: string
  elementos: any[]
  plataforma: string
  formato: string
  dataCriacao: string
}

interface ElementosCompartilhadosState {
  conjuntos: ElementoCompartilhado[]
  adicionarConjunto: (conjunto: Omit<ElementoCompartilhado, "id" | "dataCriacao">) => void
  removerConjunto: (id: string) => void
  atualizarConjunto: (id: string, elementos: any[]) => void
  carregarConjuntos: () => void
  salvarConjuntos: () => void // Nova função para forçar o salvamento
}

// Vamos melhorar as funções de salvar e carregar do localStorage

// Modifique a função carregarDoLocalStorage para incluir mais logs e tratamento de erros
const carregarDoLocalStorage = (): ElementoCompartilhado[] => {
  try {
    const dados = localStorage.getItem("elementos-compartilhados")
    console.log("Dados brutos carregados do localStorage:", dados)

    if (!dados) {
      console.log("Nenhum dado encontrado no localStorage")
      return []
    }

    const conjuntos = JSON.parse(dados)

    if (!Array.isArray(conjuntos)) {
      console.error("Dados carregados não são um array:", conjuntos)
      return []
    }

    // Validar cada conjunto
    const conjuntosValidos = conjuntos.filter((conjunto) => {
      if (!conjunto || typeof conjunto !== "object") {
        console.error("Conjunto inválido:", conjunto)
        return false
      }

      if (!conjunto.id || !conjunto.nome || !Array.isArray(conjunto.elementos)) {
        console.error("Conjunto com estrutura inválida:", conjunto)
        return false
      }

      return true
    })

    console.log("Conjuntos válidos carregados:", conjuntosValidos)
    return conjuntosValidos
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error)
    return []
  }
}

// Modifique a função salvarNoLocalStorage para incluir mais logs e tratamento de erros
const salvarNoLocalStorage = (conjuntos: ElementoCompartilhado[]) => {
  try {
    if (!Array.isArray(conjuntos)) {
      console.error("Tentativa de salvar dados que não são um array:", conjuntos)
      return false
    }

    // Validar cada conjunto antes de salvar
    const conjuntosValidos = conjuntos.filter((conjunto) => {
      if (!conjunto || typeof conjunto !== "object") {
        console.error("Conjunto inválido:", conjunto)
        return false
      }

      if (!conjunto.id || !conjunto.nome || !Array.isArray(conjunto.elementos)) {
        console.error("Conjunto com estrutura inválida:", conjunto)
        return false
      }

      return true
    })

    const dadosJSON = JSON.stringify(conjuntosValidos)
    console.log("Salvando dados no localStorage:", dadosJSON)

    localStorage.setItem("elementos-compartilhados", dadosJSON)
    console.log("Dados salvos com sucesso")
    return true
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error)
    return false
  }
}

export const useElementosCompartilhadosStore = create<ElementosCompartilhadosState>((set, get) => ({
  conjuntos: [],

  carregarConjuntos: () => {
    const conjuntosCarregados = carregarDoLocalStorage()
    set({ conjuntos: conjuntosCarregados })
  },

  // Adicionar função explícita para salvar no localStorage
  salvarConjuntos: () => {
    const conjuntos = get().conjuntos
    salvarNoLocalStorage(conjuntos)
  },

  // Modifique a função adicionarConjunto para incluir mais validações
  adicionarConjunto: (conjunto) => {
    try {
      if (!conjunto.nome || !conjunto.nome.trim()) {
        console.error("Tentativa de adicionar conjunto sem nome")
        return
      }

      if (!Array.isArray(conjunto.elementos) || conjunto.elementos.length === 0) {
        console.error("Tentativa de adicionar conjunto sem elementos")
        return
      }

      // Clonar profundamente os elementos para evitar problemas de referência
      const elementosClonados = JSON.parse(JSON.stringify(conjunto.elementos))

      const novoConjunto = {
        ...conjunto,
        elementos: elementosClonados,
        id: `conjunto-${Date.now()}`,
        dataCriacao: new Date().toISOString(),
      }

      const novosConjuntos = [...get().conjuntos, novoConjunto]
      set({ conjuntos: novosConjuntos })

      // Salvar diretamente no localStorage
      const salvou = salvarNoLocalStorage(novosConjuntos)

      if (salvou) {
        console.log("Conjunto adicionado com sucesso:", novoConjunto)
        console.log("Estado atual após adicionar:", novosConjuntos)
      } else {
        console.error("Falha ao salvar conjunto no localStorage")
      }
    } catch (error) {
      console.error("Erro ao adicionar conjunto:", error)
    }
  },

  removerConjunto: (id) => {
    const conjuntosAtualizados = get().conjuntos.filter((conjunto) => conjunto.id !== id)
    set({ conjuntos: conjuntosAtualizados })

    // Salvar diretamente no localStorage
    salvarNoLocalStorage(conjuntosAtualizados)

    console.log("Conjunto removido:", id)
    console.log("Estado atual após remover:", conjuntosAtualizados)
  },

  atualizarConjunto: (id, elementos) => {
    const conjuntosAtualizados = get().conjuntos.map((conjunto) =>
      conjunto.id === id ? { ...conjunto, elementos } : conjunto,
    )
    set({ conjuntos: conjuntosAtualizados })

    // Salvar diretamente no localStorage
    salvarNoLocalStorage(conjuntosAtualizados)

    console.log("Conjunto atualizado:", id)
    console.log("Estado atual após atualizar:", conjuntosAtualizados)
  },
}))
