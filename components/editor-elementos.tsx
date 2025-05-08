"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  PlusCircle,
  Trash2,
  MoveHorizontal,
  MoveVertical,
  Copy,
  GripHorizontal,
} from "lucide-react";
import { PreviewPeca } from "@/components/preview-peca";
import { Checkbox } from "@/components/ui/checkbox";
import { BibliotecaImagens } from "@/components/biblioteca-imagens";

interface EditorElementosProps {
  formatConfig: any;
  elementos: any[];
  setElementos: (elementos: any[]) => void;
}

export function EditorElementos({
  formatConfig,
  elementos,
  setElementos,
}: EditorElementosProps) {
  const [selectedElementIndex, setSelectedElementIndex] = useState<
    number | null
  >(null);

  const selectedElement =
    selectedElementIndex !== null ? elementos[selectedElementIndex] : null;

  // Adiciona um novo elemento
  const addElement = (tipo: string) => {
    const newElement = {
      id: `elemento-${Date.now()}`,
      tipo,
      posicaoGrid: {
        x: 1,
        y: 1,
        width: 2,
        height: 2,
      },
      conteudo: getDefaultContentForType(tipo),
    };

    setElementos([...elementos, newElement]);
    setSelectedElementIndex(elementos.length);
  };

  // Obtém conteúdo padrão baseado no tipo de elemento
  const getDefaultContentForType = (tipo: string) => {
    switch (tipo) {
      case "logo":
        return { src: "" };
      case "texto":
        return {
          texto: "Texto de Exemplo",
          fontSize: "16px",
          color: "#000000",
          textAlign: "left",
        };
      case "imagem":
        return { src: "", alt: "Imagem" };
      case "imagemPersonalizada":
        return {
          src: "",
          alt: "Imagem Personalizada",
          filtro: "nenhum",
          opacidade: 100,
          borda: false,
          bordaRadius: "0px",
        };
      case "cta":
        return {
          texto: "Saiba Mais",
          backgroundColor: "#0070f3",
          fontSize: "16px",
        };
      default:
        return {};
    }
  };

  // Atualiza propriedades do elemento
  const updateElement = (updates: any) => {
    if (selectedElementIndex === null) return;

    const updatedElements = [...elementos];
    updatedElements[selectedElementIndex] = {
      ...updatedElements[selectedElementIndex],
      ...updates,
    };

    setElementos(updatedElements);
  };

  // Atualiza conteúdo do elemento
  const updateElementContent = (contentUpdates: any) => {
    if (selectedElementIndex === null) return;

    const updatedElements = [...elementos];
    updatedElements[selectedElementIndex] = {
      ...updatedElements[selectedElementIndex],
      conteudo: {
        ...updatedElements[selectedElementIndex].conteudo,
        ...contentUpdates,
      },
    };

    setElementos(updatedElements);
  };

  // Atualiza posição do elemento
  const updateElementPosition = (positionUpdates: any) => {
    if (selectedElementIndex === null) return;

    const updatedElements = [...elementos];
    updatedElements[selectedElementIndex] = {
      ...updatedElements[selectedElementIndex],
      posicaoGrid: {
        ...updatedElements[selectedElementIndex].posicaoGrid,
        ...positionUpdates,
      },
    };

    setElementos(updatedElements);
  };

  // Deleta elemento selecionado
  const deleteElement = () => {
    if (selectedElementIndex === null) return;

    const updatedElements = elementos.filter(
      (_, index) => index !== selectedElementIndex
    );
    setElementos(updatedElements);
    setSelectedElementIndex(null);
  };

  // Duplica elemento selecionado
  const duplicateElement = () => {
    if (selectedElementIndex === null) return;

    const elementToDuplicate = elementos[selectedElementIndex];
    const duplicatedElement = {
      ...JSON.parse(JSON.stringify(elementToDuplicate)),
      id: `elemento-${Date.now()}`,
      posicaoGrid: {
        ...elementToDuplicate.posicaoGrid,
        x: Math.min(
          elementToDuplicate.posicaoGrid.x + 1,
          formatConfig.grid.columns - elementToDuplicate.posicaoGrid.width
        ),
      },
    };

    setElementos([...elementos, duplicatedElement]);
    setSelectedElementIndex(elementos.length);
  };

  return (
    <div className="gap-6">
      {/* Lista de elementos */}
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Elementos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addElement("logo")}
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> Logo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addElement("texto")}
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> Texto
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addElement("imagem")}
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> Imagem
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addElement("imagemPersonalizada")}
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> Imagem Personalizada
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addElement("cta")}
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> CTA
                </Button>
              </div>

              <div className="border rounded-md divide-y">
                {elementos.length === 0 ? (
                  <div className="p-4 text-sm text-center text-gray-500">
                    Nenhum elemento adicionado. Adicione elementos usando os
                    botões acima.
                  </div>
                ) : (
                  elementos.map((elemento, index) => (
                    <div
                      key={elemento.id || index}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedElementIndex === index ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedElementIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripHorizontal className="w-4 h-4 text-gray-400" />
                          <span className="font-medium capitalize">
                            {elemento.tipo}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newElementos = [...elementos];
                              const elemento = newElementos[index];
                              newElementos[index] = {
                                ...elemento,
                                camada: Math.min(
                                  100,
                                  (elemento.camada || 10) + 5
                                ),
                              };
                              setElementos(newElementos);
                            }}
                            title="Trazer para frente"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-bring-to-front"
                            >
                              <rect x="8" y="8" width="8" height="8" rx="2" />
                              <path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" />
                              <path d="M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" />
                            </svg>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newElementos = [...elementos];
                              const elemento = newElementos[index];
                              newElementos[index] = {
                                ...elemento,
                                camada: Math.max(
                                  1,
                                  (elemento.camada || 10) - 5
                                ),
                              };
                              setElementos(newElementos);
                            }}
                            title="Enviar para trás"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-send-to-back"
                            >
                              <rect x="14" y="14" width="8" height="8" rx="2" />
                              <rect x="2" y="2" width="8" height="8" rx="2" />
                              <path d="M7 14v1a2 2 0 0 0 2 2h1" />
                              <path d="M14 7h1a2 2 0 0 1 2 2v1" />
                            </svg>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateElement();
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteElement();
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {elemento.tipo === "texto" && (
                        <div className="mt-1 text-sm text-gray-500 truncate">
                          {elemento.conteudo.texto || "Texto"}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-400 flex justify-between">
                        <span>
                          Posição: x:{elemento.posicaoGrid.x}, y:
                          {elemento.posicaoGrid.y}
                        </span>
                        <span>Camada: {elemento.camada || 10}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Propriedades do elemento e visualização arrastável */}
      <div className="lg:col-span-8">
        <div className="grid gap-6">
          {/* Preview arrastável pequeno */}
          <Card>
            <CardHeader>
              <CardTitle>Posicionamento Direto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-gray-500">
                Arraste elementos para posicioná-los visualmente no grid. O grid
                está visível para facilitar o posicionamento.
              </div>
              <div className="h-94 overflow-auto border rounded-lg">
                <PreviewPeca
                  formatConfig={formatConfig}
                  elementos={elementos}
                  onElementosChange={setElementos}
                  editMode={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Propriedades do elemento */}
          {selectedElement ? (
            <Card>
              <CardHeader>
                <CardTitle>Editar {selectedElement.tipo}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="conteudo">
                  <TabsList className="mb-4">
                    <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                    <TabsTrigger value="posicao">Posição</TabsTrigger>
                  </TabsList>

                  <TabsContent value="conteudo">
                    {selectedElement.tipo === "texto" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="texto">Conteúdo do Texto</Label>
                          <Input
                            id="texto"
                            value={selectedElement.conteudo.texto || ""}
                            onChange={(e) =>
                              updateElementContent({ texto: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="fontSize"
                              value={
                                selectedElement.conteudo.fontSize || "16px"
                              }
                              onChange={(e) =>
                                updateElementContent({
                                  fontSize: e.target.value,
                                })
                              }
                              className="w-24"
                            />
                            <Slider
                              defaultValue={[
                                Number.parseInt(
                                  selectedElement.conteudo.fontSize
                                ) || 16,
                              ]}
                              min={8}
                              max={72}
                              step={1}
                              onValueChange={(value) =>
                                updateElementContent({
                                  fontSize: `${value[0]}px`,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="textColor">Cor do Texto</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="textColor"
                              type="color"
                              value={
                                selectedElement.conteudo.color || "#000000"
                              }
                              onChange={(e) =>
                                updateElementContent({ color: e.target.value })
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={
                                selectedElement.conteudo.color || "#000000"
                              }
                              onChange={(e) =>
                                updateElementContent({ color: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="textAlign">
                            Alinhamento do Texto
                          </Label>
                          <Select
                            value={selectedElement.conteudo.textAlign || "left"}
                            onValueChange={(value) =>
                              updateElementContent({ textAlign: value })
                            }
                          >
                            <SelectTrigger id="textAlign">
                              <SelectValue placeholder="Selecione o alinhamento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Esquerda</SelectItem>
                              <SelectItem value="center">Centro</SelectItem>
                              <SelectItem value="right">Direita</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {selectedElement.tipo === "imagem" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="imageSrc">URL da Imagem</Label>
                          <Input
                            id="imageSrc"
                            value={selectedElement.conteudo.src || ""}
                            onChange={(e) =>
                              updateElementContent({ src: e.target.value })
                            }
                            placeholder="https://exemplo.com/imagem.jpg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="imageAlt">Texto Alternativo</Label>
                          <Input
                            id="imageAlt"
                            value={selectedElement.conteudo.alt || ""}
                            onChange={(e) =>
                              updateElementContent({ alt: e.target.value })
                            }
                            placeholder="Descrição da imagem"
                          />
                        </div>
                      </div>
                    )}

                    {selectedElement.tipo === "imagemPersonalizada" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="imagemSrc">URL da Imagem</Label>
                          <div className="flex gap-2">
                            <Input
                              id="imagemSrc"
                              value={selectedElement.conteudo.src || ""}
                              onChange={(e) =>
                                updateElementContent({ src: e.target.value })
                              }
                              placeholder="https://exemplo.com/imagem.jpg"
                              className="flex-1"
                            />
                            <BibliotecaImagens
                              onSelectImage={(imageUrl) =>
                                updateElementContent({ src: imageUrl })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="imagemAlt">Texto Alternativo</Label>
                          <Input
                            id="imagemAlt"
                            value={selectedElement.conteudo.alt || ""}
                            onChange={(e) =>
                              updateElementContent({ alt: e.target.value })
                            }
                            placeholder="Descrição da imagem"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="imagemOpacidade">Opacidade</Label>
                          <div className="flex items-center space-x-2">
                            <Slider
                              id="imagemOpacidade"
                              defaultValue={[
                                selectedElement.conteudo.opacidade || 100,
                              ]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={(value) =>
                                updateElementContent({ opacidade: value[0] })
                              }
                              className="flex-1"
                            />
                            <span className="w-12 text-center">
                              {selectedElement.conteudo.opacidade || 100}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="imagemFiltro">Filtro</Label>
                          <Select
                            value={selectedElement.conteudo.filtro || "nenhum"}
                            onValueChange={(value) =>
                              updateElementContent({ filtro: value })
                            }
                          >
                            <SelectTrigger id="imagemFiltro">
                              <SelectValue placeholder="Selecione um filtro" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nenhum">Nenhum</SelectItem>
                              <SelectItem value="grayscale">
                                Preto e Branco
                              </SelectItem>
                              <SelectItem value="sepia">Sépia</SelectItem>
                              <SelectItem value="blur">Desfoque</SelectItem>
                              <SelectItem value="brightness">Brilho</SelectItem>
                              <SelectItem value="contrast">
                                Contraste
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="imagemBorda"
                            checked={selectedElement.conteudo.borda || false}
                            onCheckedChange={(checked) =>
                              updateElementContent({ borda: checked })
                            }
                          />
                          <Label
                            htmlFor="imagemBorda"
                            className="cursor-pointer"
                          >
                            Adicionar borda
                          </Label>
                        </div>

                        {selectedElement.conteudo.borda && (
                          <div className="space-y-2">
                            <Label htmlFor="imagemBordaRadius">
                              Arredondamento da borda
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="imagemBordaRadius"
                                value={
                                  selectedElement.conteudo.bordaRadius || "0px"
                                }
                                onChange={(e) =>
                                  updateElementContent({
                                    bordaRadius: e.target.value,
                                  })
                                }
                                className="w-24"
                              />
                              <Slider
                                defaultValue={[
                                  Number.parseInt(
                                    selectedElement.conteudo.bordaRadius
                                  ) || 0,
                                ]}
                                min={0}
                                max={50}
                                step={1}
                                onValueChange={(value) =>
                                  updateElementContent({
                                    bordaRadius: `${value[0]}px`,
                                  })
                                }
                                className="flex-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedElement.tipo === "logo" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="logoSrc">URL do Logo</Label>
                          <Input
                            id="logoSrc"
                            value={selectedElement.conteudo.src || ""}
                            onChange={(e) =>
                              updateElementContent({ src: e.target.value })
                            }
                            placeholder="https://exemplo.com/logo.png"
                          />
                        </div>
                      </div>
                    )}

                    {selectedElement.tipo === "cta" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ctaText">Texto do Botão</Label>
                          <Input
                            id="ctaText"
                            value={selectedElement.conteudo.texto || ""}
                            onChange={(e) =>
                              updateElementContent({ texto: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ctaColor">Cor do Botão</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="ctaColor"
                              type="color"
                              value={
                                selectedElement.conteudo.backgroundColor ||
                                "#0070f3"
                              }
                              onChange={(e) =>
                                updateElementContent({
                                  backgroundColor: e.target.value,
                                })
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={
                                selectedElement.conteudo.backgroundColor ||
                                "#0070f3"
                              }
                              onChange={(e) =>
                                updateElementContent({
                                  backgroundColor: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ctaFontSize">Tamanho da Fonte</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="ctaFontSize"
                              value={
                                selectedElement.conteudo.fontSize || "16px"
                              }
                              onChange={(e) =>
                                updateElementContent({
                                  fontSize: e.target.value,
                                })
                              }
                              className="w-24"
                            />
                            <Slider
                              defaultValue={[
                                Number.parseInt(
                                  selectedElement.conteudo.fontSize
                                ) || 16,
                              ]}
                              min={8}
                              max={32}
                              step={1}
                              onValueChange={(value) =>
                                updateElementContent({
                                  fontSize: `${value[0]}px`,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="posicao">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gridX">Posição X</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updateElementPosition({
                                  x: Math.max(
                                    0,
                                    selectedElement.posicaoGrid.x - 1
                                  ),
                                })
                              }
                              disabled={selectedElement.posicaoGrid.x <= 0}
                            >
                              <MoveHorizontal className="w-4 h-4 rotate-180" />
                            </Button>
                            <Input
                              id="gridX"
                              type="number"
                              min={0}
                              max={
                                formatConfig.grid.columns -
                                selectedElement.posicaoGrid.width
                              }
                              value={selectedElement.posicaoGrid.x}
                              onChange={(e) =>
                                updateElementPosition({
                                  x: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updateElementPosition({
                                  x: Math.min(
                                    formatConfig.grid.columns -
                                      selectedElement.posicaoGrid.width,
                                    selectedElement.posicaoGrid.x + 1
                                  ),
                                })
                              }
                              disabled={
                                selectedElement.posicaoGrid.x >=
                                formatConfig.grid.columns -
                                  selectedElement.posicaoGrid.width
                              }
                            >
                              <MoveHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gridY">Posição Y</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updateElementPosition({
                                  y: Math.max(
                                    0,
                                    selectedElement.posicaoGrid.y - 1
                                  ),
                                })
                              }
                              disabled={selectedElement.posicaoGrid.y <= 0}
                            >
                              <MoveVertical className="w-4 h-4 rotate-180" />
                            </Button>
                            <Input
                              id="gridY"
                              type="number"
                              min={0}
                              max={
                                formatConfig.grid.rows -
                                selectedElement.posicaoGrid.height
                              }
                              value={selectedElement.posicaoGrid.y}
                              onChange={(e) =>
                                updateElementPosition({
                                  y: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updateElementPosition({
                                  y: Math.min(
                                    formatConfig.grid.rows -
                                      selectedElement.posicaoGrid.height,
                                    selectedElement.posicaoGrid.y + 1
                                  ),
                                })
                              }
                              disabled={
                                selectedElement.posicaoGrid.y >=
                                formatConfig.grid.rows -
                                  selectedElement.posicaoGrid.height
                              }
                            >
                              <MoveVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gridWidth">Largura (células)</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updateElementPosition({
                                  width: Math.max(
                                    1,
                                    selectedElement.posicaoGrid.width - 1
                                  ),
                                })
                              }
                              disabled={selectedElement.posicaoGrid.width <= 1}
                            >
                              <MoveHorizontal className="w-4 h-4 rotate-180" />
                            </Button>
                            <Input
                              id="gridWidth"
                              type="number"
                              min={1}
                              max={
                                formatConfig.grid.columns -
                                selectedElement.posicaoGrid.x
                              }
                              value={selectedElement.posicaoGrid.width}
                              onChange={(e) =>
                                updateElementPosition({
                                  width: Number.parseInt(e.target.value) || 1,
                                })
                              }
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updateElementPosition({
                                  width: Math.min(
                                    formatConfig.grid.columns -
                                      selectedElement.posicaoGrid.x,
                                    selectedElement.posicaoGrid.width + 1
                                  ),
                                })
                              }
                              disabled={
                                selectedElement.posicaoGrid.width >=
                                formatConfig.grid.columns -
                                  selectedElement.posicaoGrid.x
                              }
                            >
                              <MoveHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gridHeight">Altura (células)</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updateElementPosition({
                                  height: Math.max(
                                    1,
                                    selectedElement.posicaoGrid.height - 1
                                  ),
                                })
                              }
                              disabled={selectedElement.posicaoGrid.height <= 1}
                            >
                              <MoveVertical className="w-4 h-4 rotate-180" />
                            </Button>
                            <Input
                              id="gridHeight"
                              type="number"
                              min={1}
                              max={
                                formatConfig.grid.rows -
                                selectedElement.posicaoGrid.y
                              }
                              value={selectedElement.posicaoGrid.height}
                              onChange={(e) =>
                                updateElementPosition({
                                  height: Number.parseInt(e.target.value) || 1,
                                })
                              }
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updateElementPosition({
                                  height: Math.min(
                                    formatConfig.grid.rows -
                                      selectedElement.posicaoGrid.y,
                                    selectedElement.posicaoGrid.height + 1
                                  ),
                                })
                              }
                              disabled={
                                selectedElement.posicaoGrid.height >=
                                formatConfig.grid.rows -
                                  selectedElement.posicaoGrid.y
                              }
                            >
                              <MoveVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <Label htmlFor="camada">Camada (Z-Index)</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElement({
                                camada: Math.max(
                                  1,
                                  (selectedElement.camada || 10) - 1
                                ),
                              })
                            }
                            title="Enviar para trás"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-send-to-back"
                            >
                              <rect x="14" y="14" width="8" height="8" rx="2" />
                              <rect x="2" y="2" width="8" height="8" rx="2" />
                              <path d="M7 14v1a2 2 0 0 0 2 2h1" />
                              <path d="M14 7h1a2 2 0 0 1 2 2v1" />
                            </svg>
                          </Button>
                          <Input
                            id="camada"
                            type="number"
                            min={1}
                            max={100}
                            value={selectedElement.camada || 10}
                            onChange={(e) =>
                              updateElement({
                                camada: Number.parseInt(e.target.value) || 10,
                              })
                            }
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElement({
                                camada: Math.min(
                                  100,
                                  (selectedElement.camada || 10) + 1
                                ),
                              })
                            }
                            title="Trazer para frente"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-bring-to-front"
                            >
                              <rect x="8" y="8" width="8" height="8" rx="2" />
                              <path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" />
                              <path d="M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" />
                            </svg>
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Valores maiores trazem o elemento para frente, valores
                          menores enviam para trás.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-center border rounded-lg">
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-medium">
                  Nenhum Elemento Selecionado
                </h3>
                <p className="text-sm text-gray-500">
                  Selecione um elemento da lista à esquerda para editar suas
                  propriedades, ou adicione um novo elemento.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
