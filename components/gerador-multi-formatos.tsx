"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  getFormatosPorPlataforma,
  opcoesDePlataformas,
  getConfigFormato,
} from "@/lib/config-plataformas";
import { ProgressoGeracao } from "./progresso-geracao";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FormatoSelecionado {
  plataforma: string;
  formato: string;
  nome: string;
  largura: number;
  altura: number;
  selecionado: boolean;
}

// Certifique-se de que a exportação esteja correta
export function GeradorMultiFormatos({
  elementos,
  plataformaAtual,
  formatoAtual,
  onAplicarElementos,
}: {
  elementos: any[];
  plataformaAtual: string;
  formatoAtual: string;
  onAplicarElementos: (
    elementos: any[],
    formato: string,
    plataforma: string
  ) => void;
}) {
  const { toast } = useToast();
  const [formatosSelecionados, setFormatosSelecionados] = useState<
    FormatoSelecionado[]
  >([]);
  const [open, setOpen] = useState(false);
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [mensagemProgresso, setMensagemProgresso] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [confirmAllDialogOpen, setConfirmAllDialogOpen] = useState(false);
  const [elementosSalvos, setElementosSalvos] = useState<any[]>([]);

  // Função para verificar se o formato existe
  const verificarFormatoExiste = (plataforma: string, formato: string) => {
    try {
      // Verificação mais simples usando diretamente getConfigFormato
      const config = getConfigFormato(plataforma, formato);
      // Considera válido se tiver alguma propriedade além do objeto padrão
      return (
        config && config.elementosPadrao && config.elementosPadrao.length > 0
      );
    } catch (error) {
      return false;
    }
  };

  // Função para carregar elementos do localStorage quando o componente monta
  useEffect(() => {
    carregarElementosSalvos();
  }, []);

  // Carregar elementos salvos do localStorage
  const carregarElementosSalvos = () => {
    try {
      const dadosLocalStorage = localStorage.getItem(
        "elementos-compartilhados"
      );
      let todosElementos: any[] = [];

      if (dadosLocalStorage) {
        const conjuntos = JSON.parse(dadosLocalStorage);
        if (Array.isArray(conjuntos) && conjuntos.length > 0) {
          // Extrair todos os elementos de todos os conjuntos
          for (const conjunto of conjuntos) {
            if (
              Array.isArray(conjunto.elementos) &&
              conjunto.elementos.length > 0
            ) {
              todosElementos = todosElementos.concat(conjunto.elementos);
            }
          }
          console.log(
            "Elementos pré-carregados do localStorage:",
            todosElementos.length
          );
        }
      }

      // Verificar se existem elementos para cada tipo, caso contrário adicionar padrões
      const tipos = ["texto", "imagem", "botao", "cta", "logo"];
      const tiposExistentes = todosElementos.map((el) => el.tipo);

      tipos.forEach((tipo) => {
        if (!tiposExistentes.includes(tipo)) {
          console.log(`Adicionando elemento padrão para o tipo: ${tipo}`);
          // Adicionar um elemento padrão para este tipo
          const elementoPadrao = {
            id: `padrao-${tipo}-${Date.now()}`,
            tipo: tipo,
            posicaoGrid: { x: 0, y: 0, width: 2, height: 2 },
            conteudo:
              tipo === "texto"
                ? {
                    texto: "Texto de exemplo",
                    fontSize: "16px",
                    color: "#000000",
                    textAlign: "center",
                  }
                : tipo === "imagem"
                ? { src: "", alt: "Imagem" }
                : tipo === "logo"
                ? { src: "", alt: "Logo" }
                : tipo === "botao" || tipo === "cta"
                ? {
                    texto: "Clique aqui",
                    backgroundColor: "#0070f3",
                    color: "#ffffff",
                  }
                : {},
            camada: 10,
          };
          todosElementos.push(elementoPadrao);
        }
      });

      // Adicionar elementos dos editores atuais se houver
      if (elementos && elementos.length > 0) {
        const elementosAtuaisClone = JSON.parse(JSON.stringify(elementos));
        todosElementos = todosElementos.concat(elementosAtuaisClone);
        console.log(
          "Adicionados elementos do editor atual:",
          elementosAtuaisClone.length
        );
      }

      setElementosSalvos(todosElementos);
      return todosElementos;
    } catch (error) {
      console.error("Erro ao carregar elementos do localStorage:", error);
      return [];
    }
  };

  // Função para encontrar conteúdo de elemento salvo baseado no tipo
  const encontrarConteudoElementoSalvo = (tipo: string) => {
    if (!elementosSalvos.length) return null;

    const elementosSimilares = elementosSalvos.filter((el) => el.tipo === tipo);
    if (elementosSimilares.length > 0) {
      // Escolher um elemento aleatório do mesmo tipo
      const elementoSimilar =
        elementosSimilares[
          Math.floor(Math.random() * elementosSimilares.length)
        ];
      if (elementoSimilar.conteudo) {
        return { ...elementoSimilar.conteudo };
      }
    }
    return null;
  };

  // Inicializa os formatos disponíveis
  const inicializarFormatos = () => {
    const formatos: FormatoSelecionado[] = [];

    opcoesDePlataformas.forEach((plataforma) => {
      const formatosDisponiveis = getFormatosPorPlataforma(plataforma.id);
      console.log(
        `Formatos encontrados para ${plataforma.id}:`,
        formatosDisponiveis.length
      );

      formatosDisponiveis.forEach((formato: any) => {
        // Verificar se o formato existe na configuração e não é o formato atual
        if (
          verificarFormatoExiste(plataforma.id, formato.nome) &&
          !(plataforma.id === plataformaAtual && formato.nome === formatoAtual)
        ) {
          formatos.push({
            plataforma: plataforma.id,
            formato: formato.nome,
            nome: `${plataforma.nome} - ${formato.nome}`,
            largura: formato.largura,
            altura: formato.altura,
            selecionado: false,
          });
        }
      });
    });

    setFormatosSelecionados(formatos);
    console.log(`Inicializados ${formatos.length} formatos disponíveis`);

    if (formatos.length === 0) {
      toast({
        title: "Aviso",
        description:
          "Não foram encontrados formatos adicionais para gerar sugestões.",
        variant: "default",
      });
    }
  };

  // Mutação para obter sugestões de posicionamento
  const gerarSugestoesMutation = useMutation({
    mutationFn: async (dados: any) => {
      // Fazer uma solicitação real para a API
      const response = await fetch("/api/posicionamento-elementos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elementos: dados.elementos,
          formatoOrigem: dados.formatoOrigem,
          formatosDestino: dados.formatosDestino,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao obter sugestões da API");
      }

      const responseData = await response.json();

      // Validar a estrutura da resposta
      if (!responseData.sugestoes || !Array.isArray(responseData.sugestoes)) {
        throw new Error("Formato de resposta inválido da API");
      }

      return responseData;
    },
    onSuccess: (data) => {
      if (data.sugestoes.length === 0) {
        toast({
          title: "Aviso",
          description: "Não foram geradas sugestões. Tente novamente.",
          variant: "default",
        });
        setEtapaAtual(0);
        return;
      }

      setSugestoes(data.sugestoes || []);
      setEtapaAtual(3);
      setMensagemProgresso("Sugestões geradas com sucesso!");

      toast({
        title: "Sucesso",
        description: `${data.sugestoes.length} sugestões geradas com sucesso!`,
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Erro ao gerar sugestões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar sugestões. Tente novamente.",
        variant: "destructive",
      });
      setEtapaAtual(0);
      setMensagemProgresso("");
    },
  });

  // Gerar sugestões para os formatos selecionados
  const gerarSugestoes = async () => {
    if (!elementos || elementos.length === 0) {
      toast({
        title: "Erro",
        description: "Não há elementos para gerar sugestões.",
        variant: "destructive",
      });
      return;
    }

    const formatosParaGerar = formatosSelecionados.filter((f) => f.selecionado);

    if (formatosParaGerar.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um formato para gerar.",
        variant: "default",
      });
      return;
    }

    setEtapaAtual(1);
    setMensagemProgresso("Preparando elementos...");

    // Obter configuração do formato atual
    const configAtual = getConfigFormato(plataformaAtual, formatoAtual);
    if (!configAtual) {
      toast({
        title: "Erro",
        description: "Não foi possível obter a configuração do formato atual.",
        variant: "destructive",
      });
      return;
    }

    // Preparar dados para enviar à API
    const formatoOrigem = {
      plataforma: plataformaAtual,
      formato: formatoAtual,
      largura: configAtual.width || 1080,
      altura: configAtual.height || 1080,
    };

    const formatosDestino = formatosParaGerar.map((f) => ({
      plataforma: f.plataforma,
      formato: f.formato,
      largura: f.largura,
      altura: f.altura,
    }));

    setEtapaAtual(2);
    setMensagemProgresso("Consultando IA para sugestões de posicionamento...");

    try {
      // Preparar os elementos no formato adequado para a API
      const elementosFormatados = elementos.map((elemento) => ({
        id: elemento.id || `elemento-${Date.now()}`,
        tipo: elemento.tipo || "texto",
        posicaoGrid: elemento.posicaoGrid || {
          x: 0,
          y: 0,
          width: 2,
          height: 2,
        },
        conteudo: elemento.conteudo || {},
        camada: elemento.camada || 10,
      }));

      // Chamar a API para gerar sugestões
      gerarSugestoesMutation.mutate({
        elementos: elementosFormatados,
        formatoOrigem,
        formatosDestino,
      });
    } catch (error) {
      console.error("Erro ao preparar dados para a API:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao preparar os dados. Tente novamente.",
        variant: "destructive",
      });
      setEtapaAtual(0);
    }
  };

  // Aplicar sugestão a um formato específico
  const aplicarSugestao = (sugestao: any) => {
    if (!elementos || !sugestao) return;

    try {
      console.log("Aplicando sugestão:", sugestao);

      // Obter a configuração do formato de destino
      const configFormato = getConfigFormato(
        sugestao.formato.plataforma,
        sugestao.formato.formato
      );

      if (!configFormato) {
        toast({
          title: "Erro",
          description: `Configuração do formato ${sugestao.formato.plataforma}/${sugestao.formato.formato} não encontrada.`,
          variant: "destructive",
        });
        return;
      }

      // Extrair informações do grid para cálculos de posição
      const gridColumns = configFormato.grid?.columns || 12;
      const gridRows = configFormato.grid?.rows || 12;

      // Calcular a escala de cada unidade de grid
      const unitWidthScale = configFormato.width / gridColumns;
      const unitHeightScale = configFormato.height / gridRows;

      // Converter os elementos do formato da sugestão para o formato do editor
      const elementosAdaptados = sugestao.elementos.map((elemento: any) => {
        // Garantir que estamos usando as propriedades corretamente
        const posX = elemento.posicao?.x ?? 0;
        const posY = elemento.posicao?.y ?? 0;
        const largura = elemento.dimensoes?.largura ?? 100;
        const altura = elemento.dimensoes?.altura ?? 100;

        // Converter as dimensões absolutas para posições na grade
        const gridX = Math.floor(posX / unitWidthScale);
        const gridY = Math.floor(posY / unitHeightScale);
        const gridWidth = Math.max(1, Math.floor(largura / unitWidthScale));
        const gridHeight = Math.max(1, Math.floor(altura / unitHeightScale));

        // Criar um ID único para o elemento
        const id = `elemento-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        // Procurar um elemento salvo do mesmo tipo para reutilizar seu conteúdo
        const conteudoSalvo = encontrarConteudoElementoSalvo(elemento.tipo);

        // Criar um objeto de elemento adaptado com todas as propriedades necessárias
        return {
          id,
          tipo: elemento.tipo || "texto",
          posicaoGrid: {
            x: gridX,
            y: gridY,
            width: gridWidth,
            height: gridHeight,
          },
          // Usar conteúdo salvo ou criar um padrão se não existir
          conteudo: conteudoSalvo || {
            texto:
              elemento.tipo === "texto"
                ? elemento.conteudo?.texto || "Texto"
                : "",
            src:
              elemento.tipo === "imagem" || elemento.tipo === "logo"
                ? elemento.conteudo?.src || ""
                : undefined,
            fontSize:
              elemento.tipo === "texto"
                ? elemento.conteudo?.fontSize || "16px"
                : undefined,
            color:
              elemento.tipo === "texto"
                ? elemento.conteudo?.color || "#000000"
                : undefined,
            backgroundColor:
              elemento.tipo === "botao" || elemento.tipo === "cta"
                ? elemento.conteudo?.backgroundColor || "#0070f3"
                : undefined,
            textAlign:
              elemento.tipo === "texto"
                ? elemento.conteudo?.textAlign || "center"
                : undefined,
            alt:
              elemento.tipo === "imagem"
                ? elemento.conteudo?.alt || "Imagem"
                : undefined,
          },
          // Preservar a camada original ou definir um valor padrão
          camada: elemento.camada || 10,
        };
      });

      // Aplicar ao formato selecionado
      onAplicarElementos(
        elementosAdaptados,
        sugestao.formato.formato,
        sugestao.formato.plataforma
      );

      toast({
        title: "Sucesso",
        description: `Elementos aplicados ao formato ${sugestao.formato.formato}.`,
        variant: "default",
      });

      setOpen(false);
    } catch (error) {
      console.error("Erro ao aplicar sugestão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aplicar a sugestão.",
        variant: "destructive",
      });
    }
  };

  // Aplicar todas as sugestões de uma vez
  const aplicarTodasSugestoes = () => {
    if (!sugestoes || sugestoes.length === 0) return;

    try {
      let aplicadasComSucesso = 0;

      // Aplicar cada sugestão sequencialmente
      sugestoes.forEach((sugestao) => {
        try {
          // Obter a configuração do formato de destino
          const configFormato = getConfigFormato(
            sugestao.formato.plataforma,
            sugestao.formato.formato
          );

          if (!configFormato) {
            console.log({
              plataforma: sugestao.formato.plataforma,
              formato: sugestao.formato.formato,
            });
            console.error(
              `Configuração do formato ${sugestao.formato.plataforma}/${sugestao.formato.formato} não encontrada.`
            );
            return;
          }

          // Extrair informações do grid para cálculos de posição
          const gridColumns = configFormato.grid?.columns || 12;
          const gridRows = configFormato.grid?.rows || 12;

          // Calcular a escala de cada unidade de grid
          const unitWidthScale = configFormato.width / gridColumns;
          const unitHeightScale = configFormato.height / gridRows;

          // Converter os elementos do formato da sugestão para o formato do editor
          const elementosAdaptados = sugestao.elementos.map((elemento: any) => {
            // Garantir que estamos usando as propriedades corretamente
            const posX = elemento.posicao?.x ?? 0;
            const posY = elemento.posicao?.y ?? 0;
            const largura = elemento.dimensoes?.largura ?? 100;
            const altura = elemento.dimensoes?.altura ?? 100;

            // Converter as dimensões absolutas para posições na grade
            const gridX = Math.floor(posX / unitWidthScale);
            const gridY = Math.floor(posY / unitHeightScale);
            const gridWidth = Math.max(1, Math.floor(largura / unitWidthScale));
            const gridHeight = Math.max(
              1,
              Math.floor(altura / unitHeightScale)
            );

            // Criar um ID único para o elemento
            const id = `elemento-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`;

            // Procurar um elemento salvo do mesmo tipo para reutilizar seu conteúdo
            const conteudoSalvo = encontrarConteudoElementoSalvo(elemento.tipo);

            // Criar um objeto de elemento adaptado com todas as propriedades necessárias
            return {
              id,
              tipo: elemento.tipo || "texto",
              posicaoGrid: {
                x: gridX,
                y: gridY,
                width: gridWidth,
                height: gridHeight,
              },
              // Usar conteúdo salvo ou criar um padrão se não existir
              conteudo: conteudoSalvo || {
                texto:
                  elemento.tipo === "texto"
                    ? elemento.conteudo?.texto || "Texto"
                    : "",
                src:
                  elemento.tipo === "imagem" || elemento.tipo === "logo"
                    ? elemento.conteudo?.src || ""
                    : undefined,
                fontSize:
                  elemento.tipo === "texto"
                    ? elemento.conteudo?.fontSize || "16px"
                    : undefined,
                color:
                  elemento.tipo === "texto"
                    ? elemento.conteudo?.color || "#000000"
                    : undefined,
                backgroundColor:
                  elemento.tipo === "botao" || elemento.tipo === "cta"
                    ? elemento.conteudo?.backgroundColor || "#0070f3"
                    : undefined,
                textAlign:
                  elemento.tipo === "texto"
                    ? elemento.conteudo?.textAlign || "center"
                    : undefined,
                alt:
                  elemento.tipo === "imagem"
                    ? elemento.conteudo?.alt || "Imagem"
                    : undefined,
              },
              // Preservar a camada original ou definir um valor padrão
              camada: elemento.camada || 10,
            };
          });

          // Aplicar ao formato selecionado
          onAplicarElementos(
            elementosAdaptados,
            sugestao.formato.formato,
            sugestao.formato.plataforma
          );
          aplicadasComSucesso++;
        } catch (error) {
          console.error(
            `Erro ao aplicar sugestão para ${sugestao.formato.formato}:`,
            error
          );
        }
      });

      toast({
        title: "Sucesso",
        description: `${aplicadasComSucesso} de ${sugestoes.length} formatos aplicados com sucesso.`,
        variant: "default",
      });

      setOpen(false);
    } catch (error) {
      console.error("Erro ao aplicar todas as sugestões:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao aplicar todas as sugestões.",
        variant: "destructive",
      });
    }
  };

  // Toggle para selecionar/deselecionar formato
  const toggleFormato = (index: number) => {
    const novosFormatos = [...formatosSelecionados];
    novosFormatos[index].selecionado = !novosFormatos[index].selecionado;
    setFormatosSelecionados(novosFormatos);
  };

  // Função para abrir diálogo de confirmação ao aplicar sugestão
  const handleApplySuggestion = (sugestao: any) => {
    setSelectedSuggestion(sugestao);
    setConfirmDialogOpen(true);
  };

  // Função para confirmar aplicação da sugestão
  const confirmApplySuggestion = () => {
    if (selectedSuggestion) {
      aplicarSugestao(selectedSuggestion);
      setConfirmDialogOpen(false);
      setSelectedSuggestion(null);
    }
  };

  // Função para abrir diálogo de confirmação ao aplicar todas as sugestões
  const handleApplyAllSuggestions = () => {
    setConfirmAllDialogOpen(true);
  };

  // Função para confirmar aplicação de todas as sugestões
  const confirmApplyAllSuggestions = () => {
    aplicarTodasSugestoes();
    setConfirmAllDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) {
            inicializarFormatos();
            setEtapaAtual(0);
            setSugestoes([]);
            // Reload elementos do localStorage quando o dialog é aberto
            carregarElementosSalvos();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Gerar Múltiplos Formatos</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerar Múltiplos Formatos</DialogTitle>
            <DialogDescription>
              Selecione os formatos que deseja gerar a partir dos elementos
              atuais.
            </DialogDescription>
          </DialogHeader>

          {etapaAtual < 3 ? (
            <>
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-3 gap-2 mb-4 h-[120px]">
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
                          <CardTitle className="text-sm font-medium">
                            {item.nome}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {item.largura}x{item.altura}
                          </CardDescription>
                          <div
                            className="mt-2 rounded bg-gray-50 mx-auto"
                            style={{
                              width: "80%",
                              aspectRatio: `${item.largura} / ${item.altura}`,
                              maxHeight: "80px",
                            }}
                          />
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
                  <TabsContent
                    key={plataforma.id}
                    value={plataforma.id}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {formatosSelecionados
                        .filter((item) => item.plataforma === plataforma.id)
                        .map((item, index) => {
                          // Encontrar o índice real no array completo
                          const realIndex = formatosSelecionados.findIndex(
                            (f) =>
                              f.plataforma === item.plataforma &&
                              f.formato === item.formato
                          );

                          return (
                            <Card key={`${item.plataforma}-${item.formato}`}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                  {item.nome}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  {item.largura}x{item.altura}
                                </CardDescription>
                                <div
                                  className="mt-2 border rounded bg-gray-50 mx-auto"
                                  style={{
                                    width: "80%",
                                    aspectRatio: `${item.largura} / ${item.altura}`,
                                    maxHeight: "80px",
                                  }}
                                />
                              </CardHeader>
                              <CardFooter>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`formato-tab-${realIndex}`}
                                    checked={item.selecionado}
                                    onCheckedChange={() =>
                                      toggleFormato(realIndex)
                                    }
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
                          );
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
                <Button
                  onClick={gerarSugestoes}
                  disabled={etapaAtual > 0 && etapaAtual < 3}
                >
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
                          {sugestao.formato.plataforma} -{" "}
                          {sugestao.formato.formato}
                        </CardTitle>
                        <CardDescription>
                          {sugestao.formato.largura}x{sugestao.formato.altura} (
                          {sugestao.elementos.length} elementos)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div
                            className="border rounded-md p-2 bg-gray-50 relative"
                            style={{
                              width: "100%",
                              aspectRatio: `${sugestao.formato.largura} / ${sugestao.formato.altura}`,
                              maxHeight:
                                sugestao.formato.altura >
                                sugestao.formato.largura
                                  ? "200px"
                                  : "150px",
                              overflow: "hidden",
                            }}
                          >
                            {/* Visualização simplificada dos elementos */}
                            {sugestao.elementos.map(
                              (elemento: any, idx: number) => {
                                // Determinar a cor de fundo e borda com base no tipo do elemento
                                let bgColor, borderColor, textColor;
                                switch (elemento.tipo) {
                                  default:
                                    bgColor = "bg-gray-100";
                                    borderColor = "border-gray-300";
                                    textColor = "text-gray-700";
                                }

                                // Tentar encontrar conteúdo salvo para este tipo de elemento
                                let textoPreview = elemento.tipo;
                                let srcPreview = "";
                                let bgColorStyle = "";
                                let textColorStyle = "";

                                // Usar os elementos pré-carregados
                                const conteudoSalvo =
                                  encontrarConteudoElementoSalvo(elemento.tipo);
                                if (conteudoSalvo) {
                                  if (
                                    elemento.tipo === "texto" &&
                                    conteudoSalvo.texto
                                  ) {
                                    textoPreview = conteudoSalvo.texto;
                                    textColorStyle = conteudoSalvo.color || "";
                                  } else if (
                                    (elemento.tipo === "imagem" ||
                                      elemento.tipo === "logo") &&
                                    conteudoSalvo.src
                                  ) {
                                    srcPreview = conteudoSalvo.src;
                                  } else if (
                                    (elemento.tipo === "botao" ||
                                      elemento.tipo === "cta") &&
                                    conteudoSalvo
                                  ) {
                                    if (conteudoSalvo.texto) {
                                      textoPreview = conteudoSalvo.texto;
                                    }
                                    if (conteudoSalvo.backgroundColor) {
                                      bgColorStyle =
                                        conteudoSalvo.backgroundColor;
                                    }
                                    if (conteudoSalvo.color) {
                                      textColorStyle = conteudoSalvo.color;
                                    }
                                  }
                                }

                                return (
                                  <div
                                    key={idx}
                                    className={`absolute flex items-center justify-center text-xs overflow-hidden`}
                                    style={{
                                      left: `${
                                        (elemento.posicao.x /
                                          sugestao.formato.largura) *
                                        100
                                      }%`,
                                      top: `${
                                        (elemento.posicao.y /
                                          sugestao.formato.altura) *
                                        100
                                      }%`,
                                      width: `${
                                        (elemento.dimensoes.largura /
                                          sugestao.formato.largura) *
                                        100
                                      }%`,
                                      height: `${
                                        (elemento.dimensoes.altura /
                                          sugestao.formato.altura) *
                                        100
                                      }%`,
                                      zIndex: elemento.camada || 10,
                                      fontSize: "9px",
                                      opacity: 0.85,
                                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                      ...(bgColorStyle
                                        ? { backgroundColor: bgColorStyle }
                                        : {}),
                                      ...(textColorStyle
                                        ? { color: textColorStyle }
                                        : {}),
                                    }}
                                  >
                                    <div className="flex flex-col items-center justify-center w-full h-full p-1">
                                      {elemento.tipo === "imagem" &&
                                        !srcPreview && (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3 mb-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                          </svg>
                                        )}
                                      {elemento.tipo === "imagem" &&
                                        srcPreview && (
                                          <img
                                            src={srcPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            style={{
                                              minWidth: "100%",
                                              minHeight: "100%",
                                            }}
                                          />
                                        )}
                                      {elemento.tipo === "logo" &&
                                        !srcPreview && (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3 mb-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                          </svg>
                                        )}
                                      {elemento.tipo === "logo" &&
                                        srcPreview && (
                                          <img
                                            src={srcPreview}
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                            style={{
                                              maxWidth: "100%",
                                              maxHeight: "100%",
                                            }}
                                          />
                                        )}
                                      {(elemento.tipo === "botao" ||
                                        elemento.tipo === "cta") && (
                                        <div className="flex items-center justify-center w-full h-full rounded-sm border border-current p-1">
                                          <span className="block truncate text-center w-full">
                                            {textoPreview.length > 20
                                              ? textoPreview.substring(0, 20) +
                                                "..."
                                              : textoPreview}
                                          </span>
                                        </div>
                                      )}

                                      {elemento.tipo === "texto" && (
                                        <span className="block truncate text-center w-full">
                                          {textoPreview.length > 20
                                            ? textoPreview.substring(0, 20) +
                                              "..."
                                            : textoPreview}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>

                          {/* Resumo dos elementos da sugestão */}
                          <div className="mt-2 text-xs">
                            <details className="border rounded-md p-2">
                              <summary className="font-medium cursor-pointer">
                                Detalhes dos elementos
                              </summary>
                              <div className="mt-2 space-y-2">
                                {sugestao.elementos.map(
                                  (elemento: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="border-b pb-1 last:border-0"
                                    >
                                      <div className="flex items-center">
                                        <span
                                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                            elemento.tipo === "imagem"
                                              ? "bg-blue-400"
                                              : elemento.tipo === "texto"
                                              ? "bg-green-400"
                                              : elemento.tipo === "botao" ||
                                                elemento.tipo === "cta"
                                              ? "bg-orange-400"
                                              : elemento.tipo === "logo"
                                              ? "bg-purple-400"
                                              : "bg-gray-400"
                                          }`}
                                        ></span>
                                        <span className="font-medium capitalize">
                                          {elemento.tipo}
                                        </span>
                                      </div>
                                      {elemento.conteudo?.texto && (
                                        <div className="ml-4 text-[10px] text-gray-600 truncate">
                                          "
                                          {elemento.conteudo.texto.substring(
                                            0,
                                            30
                                          )}
                                          {elemento.conteudo.texto.length > 30
                                            ? "..."
                                            : ""}
                                          "
                                        </div>
                                      )}
                                      <div className="ml-4 text-[10px] text-gray-500">
                                        Posição:{" "}
                                        {Math.round(elemento.posicao.x)},
                                        {Math.round(elemento.posicao.y)} |
                                        Tamanho:{" "}
                                        {Math.round(elemento.dimensoes.largura)}
                                        ×{Math.round(elemento.dimensoes.altura)}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </details>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleApplySuggestion(sugestao)}
                          className="w-full"
                        >
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
                <Button onClick={handleApplyAllSuggestions}>
                  Aplicar Todos
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para aplicar sugestão */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aplicar elementos ao formato</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a aplicar{" "}
              {selectedSuggestion?.elementos.length || 0} elementos ao formato{" "}
              {selectedSuggestion?.formato.plataforma} -{" "}
              {selectedSuggestion?.formato.formato}. Isto substituirá os
              elementos existentes neste formato.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedSuggestion && (
            <div className="my-4">
              <div className="text-sm font-medium mb-2">
                Visualização dos elementos:
              </div>
              <div
                className="border rounded-md p-2 bg-gray-50 relative"
                style={{
                  width: "100%",
                  aspectRatio: `${selectedSuggestion.formato.largura} / ${selectedSuggestion.formato.altura}`,
                  maxHeight:
                    selectedSuggestion.formato.altura >
                    selectedSuggestion.formato.largura
                      ? "250px"
                      : "200px",
                  overflow: "hidden",
                }}
              >
                {selectedSuggestion.elementos.map(
                  (elemento: any, idx: number) => {
                    // Determinar a cor de fundo e borda com base no tipo do elemento
                    let bgColor, borderColor, textColor;
                    switch (elemento.tipo) {
                      default:
                        bgColor = "";
                        borderColor = "";
                        textColor = "";
                    }

                    // Tentar encontrar conteúdo salvo para este tipo de elemento
                    let textoPreview = elemento.tipo;
                    let srcPreview = "";
                    let bgColorStyle = "";
                    let textColorStyle = "";

                    // Usar os elementos pré-carregados
                    const conteudoSalvo = encontrarConteudoElementoSalvo(
                      elemento.tipo
                    );
                    if (conteudoSalvo) {
                      if (elemento.tipo === "texto" && conteudoSalvo.texto) {
                        textoPreview = conteudoSalvo.texto;
                        textColorStyle = conteudoSalvo.color || "";
                      } else if (
                        (elemento.tipo === "imagem" ||
                          elemento.tipo === "logo") &&
                        conteudoSalvo.src
                      ) {
                        srcPreview = conteudoSalvo.src;
                      } else if (
                        (elemento.tipo === "botao" ||
                          elemento.tipo === "cta") &&
                        conteudoSalvo
                      ) {
                        if (conteudoSalvo.texto) {
                          textoPreview = conteudoSalvo.texto;
                        }
                        if (conteudoSalvo.backgroundColor) {
                          bgColorStyle = conteudoSalvo.backgroundColor;
                        }
                        if (conteudoSalvo.color) {
                          textColorStyle = conteudoSalvo.color;
                        }
                      }
                    }

                    return (
                      <div
                        key={idx}
                        className={`absolute flex items-center justify-center text-xs overflow-hidden`}
                        style={{
                          left: `${
                            (elemento.posicao.x /
                              selectedSuggestion.formato.largura) *
                            100
                          }%`,
                          top: `${
                            (elemento.posicao.y /
                              selectedSuggestion.formato.altura) *
                            100
                          }%`,
                          width: `${
                            (elemento.dimensoes.largura /
                              selectedSuggestion.formato.largura) *
                            100
                          }%`,
                          height: `${
                            (elemento.dimensoes.altura /
                              selectedSuggestion.formato.altura) *
                            100
                          }%`,
                          zIndex: elemento.camada || 10,
                          fontSize: "9px",
                          opacity: 0.85,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          ...(bgColorStyle
                            ? { backgroundColor: bgColorStyle }
                            : {}),
                          ...(textColorStyle ? { color: textColorStyle } : {}),
                        }}
                      >
                        <div className="flex flex-col items-center justify-center w-full h-full p-1">
                          {elemento.tipo === "imagem" && !srcPreview && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mb-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                          {elemento.tipo === "imagem" && srcPreview && (
                            <img
                              src={srcPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              style={{ minWidth: "100%", minHeight: "100%" }}
                            />
                          )}
                          {elemento.tipo === "logo" && !srcPreview && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mb-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                          {elemento.tipo === "logo" && srcPreview && (
                            <img
                              src={srcPreview}
                              alt="Logo"
                              className="w-full h-full object-contain"
                              style={{ maxWidth: "100%", maxHeight: "100%" }}
                            />
                          )}
                          {(elemento.tipo === "botao" ||
                            elemento.tipo === "cta") && (
                            <div className="flex items-center justify-center w-full h-full rounded-sm border border-current p-1">
                              <span className="block truncate text-center w-full">
                                {textoPreview.length > 20
                                  ? textoPreview.substring(0, 20) + "..."
                                  : textoPreview}
                              </span>
                            </div>
                          )}

                          {elemento.tipo === "texto" && (
                            <span className="block truncate text-center w-full">
                              {textoPreview.length > 20
                                ? textoPreview.substring(0, 20) + "..."
                                : textoPreview}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="mt-4 space-y-1 text-xs">
                <div className="font-medium">Elementos a serem aplicados:</div>
                <div className="grid grid-cols-2 gap-2 border rounded p-2">
                  {selectedSuggestion.elementos.map(
                    (elemento: any, idx: number) => (
                      <div key={idx} className="border-b pb-1 last:border-0">
                        <div className="flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 `}
                          ></span>
                          <span className="font-medium capitalize">
                            {elemento.tipo}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApplySuggestion}>
              Aplicar Elementos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação para aplicar todas as sugestões */}
      <AlertDialog
        open={confirmAllDialogOpen}
        onOpenChange={setConfirmAllDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aplicar todos os formatos</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a aplicar {sugestoes.length} formatos
              diferentes. Isto substituirá os elementos existentes em cada um
              destes formatos.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <div className="text-sm font-medium mb-2">
              Formatos que serão modificados:
            </div>
            <div className="max-h-[300px] overflow-y-auto border rounded p-3">
              <ul className="space-y-2">
                {sugestoes.map((sugestao, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full mr-2 bg-blue-500"></span>
                      <span className="font-medium">
                        {sugestao.formato.plataforma} -{" "}
                        {sugestao.formato.formato}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {sugestao.formato.largura}×{sugestao.formato.altura} •{" "}
                      {sugestao.elementos.length} elementos
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApplyAllSuggestions}>
              Aplicar Todos os Formatos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
