"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { getFormatosPorPlataforma, opcoesDePlataformas } from "@/lib/config-plataformas"
import { ProgressoGeracao } from "./progresso-geracao"
import { useMutation } from "@tanstack/react-query"

interface FormatoSelecionado {
  plataforma: string
  formato: string
  nome: string
  largura: number
  altura: number
  selecionado: boolean
}

export function GeradorMultiFormatos({
  elementos,
  plataformaAtual,
  formatoAtual,
  onAplicarElementos,
}: {
  elementos: any[]
  plataformaAtual: string
  formatoAtual: string
  onAplicarElementos: (elementos: any[], formato: string) => void
}) {
  const { toast } = useToast()
  const [formatosSelecionados, setFormatosSelecionados] = useState<FormatoSelecionado[]>([])
  const [open, setOpen] = useState(false)
  const [sugestoes, setSugestoes] = useState<any[]>([])
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [mensagemProgresso, setMensagemProgresso] = useState("")

  // Inicializa os formatos disponíveis
  const inicializarFormatos = () => {
    const formatos: FormatoSelecionado[] = []

    opcoesDePlataformas.forEach((plataforma) => {
      const formatosDisponiveis = getFormatosPorPlataforma(plataforma.id)

      formatosDisponiveis.forEach((formato: any) => {
        // Não incluir o formato atual
        if (!(plataforma.id === plataformaAtual && formato.nome === formatoAtual)) {
          formatos.push({
            plataforma: plataforma.id,
            formato: formato.nome,
            nome: `${plataforma.nome} - ${formato.nome}`,
            largura: formato.largura,
            altura: formato.altura,
            selecionado: false,
          })
        }
      })
    })

    setFormatosSelecionados(formatos)
  }

  // Mutação para obter sugestões de posicionamento
  const gerarSugestoesMutation = useMutation({
    mutationFn: async (dados: any) => {
      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Gerar sugestões simuladas
      const sugestoes = dados.formatosDestino.map((formato: any) => ({
        formato: {
          plataforma: formato.plataforma,
          formato: formato.formato,
          largura: formato.largura,
          altura: formato.altura,
        },
        elementos: elementos.map((elemento) => ({
          id: `${elemento.id}-${formato.formato}`,
          tipo: elemento.tipo,
          posicao: {
            x: Math.floor(Math.random() * (formato.largura - 100)),
            y: Math.floor(Math.random() * (formato.altura - 100)),
          },
          dimensoes: {
            largura: Math.min(elemento.posicaoGrid?.width || 100, formato.largura / 4),
            altura: Math.min(elemento.posicaoGrid?.height || 100, formato.altura / 4),
          },
          conteudo: elemento.conteudo,
        })),
      }))

      return { sugestoes }
    },
    onSuccess: (data) => {
      setSugestoes(data.sugestoes || [])
      setEtapaAtual(3)
      setMensagemProgresso("Sugestões geradas com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao gerar sugestões:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar sugestões. Tente novamente.",
        variant: "destructive",
      })
      setEtapaAtual(0)
    },
  })

  // Gerar sugestões para os formatos selecionados
  const gerarSugestoes = async () => {
    if (!elementos || elementos.length === 0) {
      toast({
        title: "Erro",
        description: "Não há elementos para gerar sugestões.",
        variant: "destructive",
      })
      return
    }

    const formatosParaGerar = formatosSelecionados.filter((f) => f.selecionado)

    if (formatosParaGerar.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um formato para gerar.",
        variant: "default",
      })
      return
    }

    setEtapaAtual(1)
    setMensagemProgresso("Preparando elementos...")

    // Preparar dados para enviar à API
    const formatoOrigem = {
      plataforma: plataformaAtual,
      formato: formatoAtual,
    }

    const formatosDestino = formatosParaGerar.map((f) => ({
      plataforma: f.plataforma,
      formato: f.formato,
      largura: f.largura,
      altura: f.altura,
    }))

    setEtapaAtual(2)
    setMensagemProgresso("Consultando IA para sugestões de posicionamento...")

    // Chamar a API para gerar sugestões
    gerarSugestoesMutation.mutate({
      elementos,
      formatoOrigem,
      formatosDestino,
    })
  }

  // Aplicar sugestão a um formato específico
  const aplicarSugestao = (sugestao: any) => {
    if (!elementos || !sugestao) return

    try {
      // Adaptar elementos para o formato do editor
      const elementosAdaptados = sugestao.elementos.map((elemento: any) => ({
        ...elemento,
        posicaoGrid: {
          x: Math.floor(elemento.posicao.x / 100),
          y: Math.floor(elemento.posicao.y / 100),
          width: Math.floor(elemento.dimensoes.largura / 100),
          height: Math.floor(elemento.dimensoes.altura / 100),
        },
      }))

      // Aplicar ao formato atual
      onAplicarElementos(elementosAdaptados, sugestao.formato.formato)

      toast({
        title: "Sucesso",
        description: `Elementos aplicados ao formato ${sugestao.formato.formato}.`,
        variant: "default",
      })

      setOpen(false)
    } catch (error) {
      console.error("Erro ao aplicar sugestão:", error)
      toast({
        title: "Erro",
        description: "Não foi possível aplicar a sugestão.",
        variant: "destructive",
      })
    }
  }

  // Toggle para selecionar/deselecionar formato
  const toggleFormato = (index: number) => {
    const novosFormatos = [...formatosSelecionados]
    novosFormatos[index].selecionado = !novosFormatos[index].selecionado
    setFormatosSelecionados(novosFormatos)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) {
          inicializarFormatos()
          setEtapaAtual(0)
          setSugestoes([])
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Gerar Múltiplos Formatos</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Múltiplos Formatos</DialogTitle>
          <DialogDescription>Selecione os formatos que deseja gerar a partir dos elementos atuais.</DialogDescription>
        </DialogHeader>

        {etapaAtual < 3 ? (
          <>
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="all">Todos</TabsTrigger>
                {opcoesDePlataformas.map((plataforma) => (
                  <TabsTrigger key={plataforma.id} value={plataforma.id}>
                    {plataforma.nome}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {formatosSelecionados.map((item, index) => (
                    <Card key={`${item.plataforma}-${item.formato}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{item.nome}</CardTitle>
                        <CardDescription className="text-xs">
                          {item.largura}x{item.altura}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`formato-${index}`}
                            checked={item.selecionado}
                            onCheckedChange={() => toggleFormato(index)}
                          />
                          <label
                            htmlFor={`formato-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Selecionar
                          </label>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {opcoesDePlataformas.map((plataforma) => (
                <TabsContent key={plataforma.id} value={plataforma.id} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {formatosSelecionados
                      .filter((item) => item.plataforma === plataforma.id)
                      .map((item, index) => {
                        // Encontrar o índice real no array completo
                        const realIndex = formatosSelecionados.findIndex(
                          (f) => f.plataforma === item.plataforma && f.formato === item.formato,
                        )

                        return (
                          <Card key={`${item.plataforma}-${item.formato}`}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">{item.nome}</CardTitle>
                              <CardDescription className="text-xs">
                                {item.largura}x{item.altura}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`formato-tab-${realIndex}`}
                                  checked={item.selecionado}
                                  onCheckedChange={() => toggleFormato(realIndex)}
                                />
                                <label
                                  htmlFor={`formato-tab-${realIndex}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Selecionar
                                </label>
                              </div>
                            </CardFooter>
                          </Card>
                        )
                      })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <ProgressoGeracao
              etapaAtual={etapaAtual}
              totalEtapas={3}
              mensagem={mensagemProgresso}
              visivel={etapaAtual > 0}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={gerarSugestoes} disabled={etapaAtual > 0 && etapaAtual < 3}>
                {etapaAtual > 0 ? "Gerando..." : "Gerar Sugestões"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sugestões Geradas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sugestoes.map((sugestao, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {sugestao.formato.plataforma} - {sugestao.formato.formato}
                      </CardTitle>
                      <CardDescription>
                        {sugestao.formato.largura}x{sugestao.formato.altura}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="border rounded-md p-2 bg-gray-50 relative"
                        style={{
                          width: "100%",
                          height: "150px",
                          overflow: "hidden",
                        }}
                      >
                        {/* Visualização simplificada dos elementos */}
                        {sugestao.elementos.map((elemento: any, idx: number) => (
                          <div
                            key={idx}
                            className="absolute bg-gray-200 border border-gray-300 flex items-center justify-center text-xs"
                            style={{
                              left: `${(elemento.posicao.x / sugestao.formato.largura) * 100}%`,
                              top: `${(elemento.posicao.y / sugestao.formato.altura) * 100}%`,
                              width: `${(elemento.dimensoes.largura / sugestao.formato.largura) * 100}%`,
                              height: `${(elemento.dimensoes.altura / sugestao.formato.altura) * 100}%`,
                            }}
                          >
                            {elemento.tipo}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => aplicarSugestao(sugestao)} className="w-full">
                        Aplicar este formato
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEtapaAtual(0)}>
                Voltar
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
