"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export function DebugStorage() {
  const [localStorageItems, setLocalStorageItems] = useState<{ key: string; value: string }[]>([])
  const { toast } = useToast()

  // Função para atualizar a lista de itens do localStorage
  const refreshLocalStorageItems = () => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return
      }

      const items: { key: string; value: string }[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key) || ""
          items.push({ key, value })
        }
      }
      setLocalStorageItems(items)
    } catch (error) {
      console.error("Erro ao acessar localStorage:", error)
    }
  }

  // Carregar itens quando o componente montar
  useEffect(() => {
    refreshLocalStorageItems()
  }, [])

  // Função para testar o localStorage
  const testLocalStorage = () => {
    try {
      // Verificar se o localStorage está disponível
      if (typeof window === "undefined" || !window.localStorage) {
        toast({
          title: "Erro",
          description: "localStorage não está disponível neste navegador",
          variant: "destructive",
        })
        return
      }

      // Testar escrita e leitura
      const testKey = "debug-test-key"
      const testValue = `test-value-${Date.now()}`

      localStorage.setItem(testKey, testValue)
      const readValue = localStorage.getItem(testKey)

      if (readValue === testValue) {
        toast({
          title: "Sucesso",
          description: "localStorage está funcionando corretamente",
        })
      } else {
        toast({
          title: "Erro",
          description: `Valor lido (${readValue}) não corresponde ao valor escrito (${testValue})`,
          variant: "destructive",
        })
      }

      // Atualizar a lista
      refreshLocalStorageItems()
    } catch (error) {
      console.error("Erro ao testar localStorage:", error)
      toast({
        title: "Erro",
        description: `Exceção ao acessar localStorage: ${error}`,
        variant: "destructive",
      })
    }
  }

  // Função para limpar um item específico
  const clearItem = (key: string) => {
    try {
      localStorage.removeItem(key)
      toast({
        title: "Item removido",
        description: `Item "${key}" removido com sucesso`,
      })
      refreshLocalStorageItems()
    } catch (error) {
      console.error(`Erro ao remover item ${key}:`, error)
      toast({
        title: "Erro",
        description: `Falha ao remover item "${key}"`,
        variant: "destructive",
      })
    }
  }

  // Função para limpar todos os itens
  const clearAll = () => {
    try {
      localStorage.clear()
      toast({
        title: "Storage limpo",
        description: "Todos os itens foram removidos do localStorage",
      })
      refreshLocalStorageItems()
    } catch (error) {
      console.error("Erro ao limpar localStorage:", error)
      toast({
        title: "Erro",
        description: "Falha ao limpar o localStorage",
        variant: "destructive",
      })
    }
  }

  // Vamos adicionar uma função para corrigir o armazenamento de elementos
  const fixElementosStorage = () => {
    try {
      // Verificar se há dados de elementos compartilhados
      const dados = localStorage.getItem("elementos-compartilhados")

      if (!dados) {
        toast({
          title: "Nada para corrigir",
          description: "Não foram encontrados dados de elementos compartilhados.",
        })
        return
      }

      // Tentar analisar os dados
      let conjuntos
      try {
        conjuntos = JSON.parse(dados)
      } catch (e) {
        toast({
          title: "Dados corrompidos",
          description: "Os dados estão corrompidos e não podem ser recuperados.",
          variant: "destructive",
        })
        return
      }

      // Verificar se é um array
      if (!Array.isArray(conjuntos)) {
        // Tentar converter para array se for um objeto
        if (typeof conjuntos === "object" && conjuntos !== null) {
          conjuntos = [conjuntos]
        } else {
          toast({
            title: "Formato inválido",
            description: "Os dados não estão no formato esperado.",
            variant: "destructive",
          })
          return
        }
      }

      // Filtrar conjuntos válidos
      const conjuntosValidos = conjuntos.filter(
        (c) => c && typeof c === "object" && c.id && c.nome && Array.isArray(c.elementos),
      )

      // Salvar os conjuntos válidos
      localStorage.setItem("elementos-compartilhados", JSON.stringify(conjuntosValidos))

      toast({
        title: "Armazenamento corrigido",
        description: `${conjuntosValidos.length} conjuntos válidos foram mantidos.`,
      })

      // Atualizar a lista
      refreshLocalStorageItems()
    } catch (error) {
      console.error("Erro ao corrigir armazenamento:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar corrigir o armazenamento.",
        variant: "destructive",
      })
    }
  }

  // Vamos adicionar uma função para depurar especificamente os elementos compartilhados

  // Adicione esta função dentro do componente DebugStorage
  const debugElementosCompartilhados = () => {
    try {
      const dadosLocalStorage = localStorage.getItem("elementos-compartilhados")
      console.log("Dados brutos de elementos compartilhados:", dadosLocalStorage)

      if (!dadosLocalStorage) {
        toast({
          title: "Sem dados",
          description: "Não há dados de elementos compartilhados no localStorage.",
        })
        return
      }

      try {
        const dados = JSON.parse(dadosLocalStorage)
        console.log("Dados parseados:", dados)

        if (Array.isArray(dados)) {
          toast({
            title: "Dados encontrados",
            description: `Encontrados ${dados.length} conjuntos de elementos compartilhados.`,
          })
        } else {
          toast({
            title: "Formato inválido",
            description: "Os dados não estão no formato de array esperado.",
            variant: "destructive",
          })
        }
      } catch (e) {
        toast({
          title: "Erro ao analisar dados",
          description: "Os dados estão em um formato JSON inválido.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao depurar elementos compartilhados:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao depurar os elementos compartilhados.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Debug localStorage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={testLocalStorage} variant="outline">
              Testar localStorage
            </Button>
            <Button onClick={refreshLocalStorageItems} variant="outline">
              Atualizar Lista
            </Button>
            <Button onClick={clearAll} variant="destructive">
              Limpar Tudo
            </Button>
            <Button onClick={fixElementosStorage} variant="outline">
              Corrigir Elementos
            </Button>
            <Button onClick={debugElementosCompartilhados} variant="outline">
              Depurar Elementos
            </Button>
          </div>

          <div className="border rounded-md p-4 max-h-[300px] overflow-auto">
            <h3 className="font-medium mb-2">Itens no localStorage ({localStorageItems.length})</h3>
            {localStorageItems.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum item encontrado</p>
            ) : (
              <div className="space-y-3">
                {localStorageItems.map(({ key, value }) => (
                  <div key={key} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">{key}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-red-500 hover:text-red-700"
                        onClick={() => clearItem(key)}
                      >
                        Remover
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 break-all">
                      {value.length > 100 ? `${value.substring(0, 100)}...` : value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
