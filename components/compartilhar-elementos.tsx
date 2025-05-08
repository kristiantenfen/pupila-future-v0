"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  type ElementoCompartilhado,
  useElementosCompartilhadosStore,
} from "@/lib/elementos-compartilhados-store";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompartilharElementosProps {
  elementos: any[];
  plataforma: string;
  formato: string;
  onAplicarElementos: (elementos: any[]) => void;
}

export function CompartilharElementos({
  elementos,
  plataforma,
  formato,
  onAplicarElementos,
}: CompartilharElementosProps) {
  const [nomeConjunto, setNomeConjunto] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modoSalvar, setModoSalvar] = useState(true);
  const { conjuntos, adicionarConjunto, removerConjunto } =
    useElementosCompartilhadosStore();
  const { toast } = useToast();

  // Vamos melhorar o componente para garantir que os elementos sejam carregados corretamente

  // Adicione um useEffect para verificar o localStorage ao montar o componente
  useEffect(() => {
    // Verificar se há dados no localStorage
    const dadosLocalStorage = localStorage.getItem("elementos-compartilhados");
    console.log("Dados no localStorage ao montar:", dadosLocalStorage);

    // Carregar os conjuntos do localStorage quando o componente montar
    useElementosCompartilhadosStore.getState().carregarConjuntos();

    // Verificar se os conjuntos foram carregados
    const conjuntosCarregados =
      useElementosCompartilhadosStore.getState().conjuntos;
    console.log("Conjuntos carregados ao montar:", conjuntosCarregados);
  }, []);

  // Efeito para verificar se os conjuntos estão sendo carregados corretamente
  useEffect(() => {
    console.log("Conjuntos carregados:", conjuntos);
  }, [conjuntos]);

  // Vamos corrigir o problema de salvamento dos elementos compartilhados

  // Modifique a função handleSalvarConjunto para garantir que os elementos sejam salvos corretamente
  const handleSalvarConjunto = () => {
    if (!nomeConjunto.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o conjunto de elementos.",
        variant: "destructive",
      });
      return;
    }

    if (elementos.length === 0) {
      toast({
        title: "Sem elementos",
        description:
          "Não há elementos para salvar. Adicione elementos antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clonar os elementos para garantir que não haja referências
      const elementosParaSalvar = JSON.parse(JSON.stringify(elementos));

      console.log("Salvando conjunto:", {
        nome: nomeConjunto,
        elementos: elementosParaSalvar,
        plataforma,
        formato,
      });

      // Salvar o conjunto
      adicionarConjunto({
        nome: nomeConjunto,
        elementos: elementosParaSalvar,
        plataforma,
        formato,
      });

      // Forçar a persistência no localStorage
      useElementosCompartilhadosStore.getState().salvarConjuntos();

      // Verificar se o conjunto foi salvo
      const conjuntosAtuais =
        useElementosCompartilhadosStore.getState().conjuntos;
      console.log("Conjuntos após salvar:", conjuntosAtuais);

      toast({
        title: "Conjunto salvo",
        description: `O conjunto "${nomeConjunto}" foi salvo com sucesso.`,
      });

      setNomeConjunto("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar conjunto:", error);
      toast({
        title: "Erro ao salvar",
        description:
          "Ocorreu um erro ao salvar o conjunto. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Vamos melhorar a função de aplicar elementos e adicionar mais logs de diagnóstico

  // Modifique a função handleAplicarConjunto para incluir mais logs e tratamento de erros
  const handleAplicarConjunto = (conjunto: ElementoCompartilhado) => {
    try {
      console.log("Aplicando conjunto:", conjunto);
      console.log("Elementos no conjunto:", conjunto.elementos);

      if (!conjunto.elementos || conjunto.elementos.length === 0) {
        toast({
          title: "Conjunto vazio",
          description: "Este conjunto não contém elementos para aplicar.",
          variant: "destructive",
        });
        return;
      }

      // Clonar profundamente os elementos para evitar problemas de referência
      const elementosClonados = JSON.parse(JSON.stringify(conjunto.elementos));
      console.log("Elementos clonados:", elementosClonados);

      // Adaptar elementos para o novo formato
      const elementosAdaptados = adaptarElementosParaNovoFormato(
        elementosClonados,
        conjunto.formato,
        formato
      );
      console.log("Elementos adaptados:", elementosAdaptados);

      // Garantir que cada elemento tenha um ID único
      const elementosComIds = elementosAdaptados.map((elem) => ({
        ...elem,
        id:
          elem.id ||
          `elemento-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      // Aplicar os elementos
      onAplicarElementos(elementosComIds);

      toast({
        title: "Conjunto aplicado",
        description: `O conjunto "${conjunto.nome}" foi aplicado com sucesso com ${elementosComIds.length} elementos.`,
      });

      setDialogOpen(false);
    } catch (error) {
      console.error("Erro ao aplicar conjunto:", error);
      toast({
        title: "Erro ao aplicar conjunto",
        description: "Ocorreu um erro ao aplicar o conjunto de elementos.",
        variant: "destructive",
      });
    }
  };

  // Modifique a função adaptarElementosParaNovoFormato para ser mais robusta
  const adaptarElementosParaNovoFormato = (
    elementos: any[],
    formatoOrigem: string,
    formatoDestino: string
  ) => {
    console.log(
      `Adaptando elementos de ${formatoOrigem} para ${formatoDestino}`
    );

    // Se os formatos forem iguais, não precisa adaptar
    if (formatoOrigem === formatoDestino) {
      return JSON.parse(JSON.stringify(elementos));
    }

    try {
      // Clonar os elementos para não modificar os originais
      const elementosAdaptados = JSON.parse(JSON.stringify(elementos));

      // Garantir que cada elemento tenha as propriedades necessárias
      return elementosAdaptados.map((elemento: any, index: number) => {
        // Verificar se o elemento tem a estrutura esperada
        if (!elemento.posicaoGrid) {
          console.warn(`Elemento ${index} não tem posicaoGrid, criando padrão`);
          elemento.posicaoGrid = { x: 0, y: 0, width: 2, height: 2 };
        }

        if (!elemento.conteudo) {
          console.warn(`Elemento ${index} não tem conteudo, criando padrão`);
          elemento.conteudo = {};
        }

        if (!elemento.tipo) {
          console.warn(
            `Elemento ${index} não tem tipo, definindo como 'texto'`
          );
          elemento.tipo = "texto";
        }

        return {
          ...elemento,
          id: `elemento-${Date.now()}-${index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`, // Gerar novo ID para evitar conflitos
        };
      });
    } catch (error) {
      console.error("Erro ao adaptar elementos:", error);
      // Em caso de erro, retorna uma cópia simples dos elementos
      return JSON.parse(JSON.stringify(elementos));
    }
  };

  const handleRemoverConjunto = (
    id: string,
    nome: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    console.log("Removendo conjunto:", id);
    removerConjunto(id);

    toast({
      title: "Conjunto removido",
      description: `O conjunto "${nome}" foi removido com sucesso.`,
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex flex-col gap-2">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setModoSalvar(true);
              setNomeConjunto("");
            }}
          >
            Salvar Elementos
          </Button>
        </DialogTrigger>

        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setModoSalvar(false);
              console.log("Conjuntos disponíveis:", conjuntos);
            }}
            disabled={conjuntos.length === 0}
          >
            Aplicar Elementos ({conjuntos.length})
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {modoSalvar
              ? "Salvar Conjunto de Elementos"
              : "Aplicar Conjunto de Elementos"}
          </DialogTitle>
        </DialogHeader>

        {modoSalvar ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeConjunto">Nome do Conjunto</Label>
              <Input
                id="nomeConjunto"
                value={nomeConjunto}
                onChange={(e) => setNomeConjunto(e.target.value)}
                placeholder="Ex: Logo e Texto Padrão"
              />
            </div>
            <div className="text-sm text-gray-500">
              Este conjunto salvará {elementos.length} elementos do formato
              atual.
            </div>
            <Button onClick={handleSalvarConjunto} className="w-full">
              Salvar Conjunto
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {conjuntos.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Nenhum conjunto de elementos salvo.
              </div>
            ) : (
              conjuntos.map((conjunto) => (
                <Card
                  key={conjunto.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAplicarConjunto(conjunto)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{conjunto.nome}</h3>
                        <div className="text-sm text-gray-500">
                          {conjunto.elementos.length} elementos •{" "}
                          {conjunto.plataforma}/{conjunto.formato}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Criado{" "}
                          {formatDistanceToNow(new Date(conjunto.dataCriacao), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) =>
                          handleRemoverConjunto(conjunto.id, conjunto.nome, e)
                        }
                      >
                        Remover
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
