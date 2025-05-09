"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PreviewPeca } from "@/components/preview-peca";
import { EditorElementos } from "@/components/editor-elementos";
import { ExportadorPecas } from "@/components/exportador-pecas";
import { HistoricoVersoes } from "@/components/historico-versoes";
import { FormatoPreview } from "@/components/formato-preview";
import {
  getFormatosPorPlataforma,
  getConfigFormato,
  formatosPorPlataforma,
  verificarFormatoExisteEmQualquerPlataforma,
  verificarFormatoExiste,
} from "@/lib/config-plataformas";
import { usePecasStore } from "@/lib/pecas-store";
import { PreviewContainer } from "@/components/preview-container";
import { CompartilharElementos } from "@/components/compartilhar-elementos";
import { Toaster } from "@/components/toaster";
import { useCampanhasStore } from "@/lib/campanhas-store";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GeradorMultiFormatos } from "@/components/gerador-multi-formatos";

export default function EditorCampanhaPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const campanhaId = params.id as string;

  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [availableFormats, setAvailableFormats] = useState<any[]>([]);
  const [formatConfig, setFormatConfig] = useState<any>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const { elementos, setElementos, resetElementos, salvarVersao, versoes } =
    usePecasStore();
  const {
    campanhas,
    campanhaAtual,
    selecionarCampanha,
    adicionarAsset,
    obterAsset,
    atualizarCampanha,
  } = useCampanhasStore();

  // Carregar a campanha selecionada
  useEffect(() => {
    if (campanhaId) {
      selecionarCampanha(campanhaId);
    }
  }, [campanhaId, selecionarCampanha]);

  // Verificar se a campanha existe
  useEffect(() => {
    if (
      campanhaId &&
      campanhas.length > 0 &&
      !campanhas.some((c) => c.id === campanhaId)
    ) {
      toast({
        title: "Campanha não encontrada",
        description: "A campanha que você está tentando editar não existe.",
        variant: "destructive",
      });
      router.push("/campanhas");
    }
  }, [campanhaId, campanhas, router, toast]);

  // Define formatos disponíveis quando a plataforma muda
  useEffect(() => {
    // Verificar se a plataforma selecionada está disponível na campanha
    if (
      campanhaAtual &&
      !campanhaAtual.plataformas.includes(selectedPlatform)
    ) {
      // Se a plataforma atual não estiver disponível, selecionar a primeira plataforma da campanha
      if (campanhaAtual.plataformas.length > 0) {
        setSelectedPlatform(campanhaAtual.plataformas[0]);
        return;
      }
    }

    const formatos = getFormatosPorPlataforma(selectedPlatform);
    setAvailableFormats(formatos);

    // Só definir o formato padrão se não houver um formato já selecionado
    // ou se o formato atual não estiver disponível na nova plataforma
    if (!selectedFormat || !formatos.some((f) => f.nome === selectedFormat)) {
      setSelectedFormat(formatos.length > 0 ? formatos[0].nome : "");
    }
  }, [selectedPlatform, campanhaAtual, selectedFormat]);

  // Atualiza configuração do formato quando o formato muda
  useEffect(() => {
    if (selectedFormat) {
      const config = getConfigFormato(selectedPlatform, selectedFormat);
      setFormatConfig(config);

      // Verificar se já existe um asset salvo para este formato
      if (campanhaId) {
        const assetSalvo = obterAsset(
          campanhaId,
          selectedPlatform,
          selectedFormat
        );

        if (assetSalvo && assetSalvo.elementos.length > 0) {
          // Usar os elementos salvos
          setElementos(assetSalvo.elementos);
        } else if (config && config.elementosPadrao) {
          // Usar os elementos padrão do formato
          resetElementos(config.elementosPadrao);
        } else {
          // Inicializar com array vazio
          resetElementos([]);
        }
      }
    }
  }, [
    selectedFormat,
    selectedPlatform,
    resetElementos,
    campanhaId,
    obterAsset,
    setElementos,
  ]);

  // Auto-save quando os elementos mudam (com debounce)
  useEffect(() => {
    if (
      !autoSave ||
      !campanhaId ||
      !selectedPlatform ||
      !selectedFormat ||
      !formatConfig
    )
      return;

    const timer = setTimeout(() => {
      adicionarAsset(campanhaId, {
        plataforma: selectedPlatform,
        formato: selectedFormat,
        elementos: elementos,
      });

      // Atualizar a data de modificação da campanha
      atualizarCampanha(campanhaId, {});

      setLastSaved(new Date().toLocaleTimeString());
    }, 2000); // 2 segundos de debounce

    return () => clearTimeout(timer);
  }, [
    elementos,
    autoSave,
    campanhaId,
    selectedPlatform,
    selectedFormat,
    formatConfig,
    adicionarAsset,
    atualizarCampanha,
  ]);

  const handleSaveVersion = () => {
    if (!campanhaId || !selectedPlatform || !selectedFormat) {
      toast({
        title: "Erro ao salvar",
        description: "Selecione uma plataforma e formato antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Salvar no histórico de versões
      salvarVersao({
        plataforma: selectedPlatform,
        formato: selectedFormat,
        elementos: [...elementos],
        timestamp: new Date().toISOString(),
      });

      // Salvar na campanha
      adicionarAsset(campanhaId, {
        plataforma: selectedPlatform,
        formato: selectedFormat,
        elementos: elementos,
      });

      // Atualizar a data de modificação da campanha
      atualizarCampanha(campanhaId, {});

      setLastSaved(new Date().toLocaleTimeString());

      toast({
        title: "Versão salva",
        description: "A versão atual foi salva com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar versão:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a versão.",
        variant: "destructive",
      });
    }
  };

  const handleAplicarElementos = (elementosCompartilhados: any[]) => {
    try {
      console.log("Recebendo elementos para aplicar:", elementosCompartilhados);

      if (!elementosCompartilhados || elementosCompartilhados.length === 0) {
        toast({
          title: "Sem elementos",
          description: "Não há elementos para aplicar.",
          variant: "destructive",
        });
        return;
      }

      // Adaptar os elementos para o formato atual se necessário
      const elementosAdaptados = adaptarElementosParaFormato(
        elementosCompartilhados,
        formatConfig
      );
      console.log(
        "Elementos adaptados para o formato atual:",
        elementosAdaptados
      );

      // Aplicar os elementos ao estado
      setElementos(elementosAdaptados);

      toast({
        title: "Elementos aplicados",
        description: `${elementosAdaptados.length} elementos foram aplicados com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao aplicar elementos:", error);
      toast({
        title: "Erro ao aplicar elementos",
        description: "Ocorreu um erro ao aplicar os elementos.",
        variant: "destructive",
      });
    }
  };

  const adaptarElementosParaFormato = (
    elementos: any[],
    formatoConfig: any
  ) => {
    if (!formatoConfig) return elementos;
    console.log("Adaptando elementos para o formato:", formatoConfig.nome);

    try {
      // Clonar os elementos para não modificar os originais
      const elementosAdaptados = JSON.parse(JSON.stringify(elementos));
      console.log("Elementos clonados:", elementosAdaptados);

      // Ajustar posições e tamanhos para o novo formato
      return elementosAdaptados.map((elemento: any, index: number) => {
        // Verificar se o elemento tem a estrutura esperada
        if (!elemento.posicaoGrid) {
          console.warn(`Elemento ${index} não tem posicaoGrid, criando padrão`);
          elemento.posicaoGrid = { x: 0, y: 0, width: 2, height: 2 };
          return elemento;
        }

        // Garantir que o elemento não ultrapasse os limites do grid
        const posicaoGrid = { ...elemento.posicaoGrid };

        // Ajustar posição X se necessário
        if (posicaoGrid.x + posicaoGrid.width > formatoConfig.grid.columns) {
          if (posicaoGrid.width > formatoConfig.grid.columns) {
            posicaoGrid.width = formatoConfig.grid.columns;
            posicaoGrid.x = 0;
          } else {
            posicaoGrid.x = formatoConfig.grid.columns - posicaoGrid.width;
          }
        }

        // Ajustar posição Y se necessário
        if (posicaoGrid.y + posicaoGrid.height > formatoConfig.grid.rows) {
          if (posicaoGrid.height > formatoConfig.grid.rows) {
            posicaoGrid.height = formatoConfig.grid.rows;
            posicaoGrid.y = 0;
          } else {
            posicaoGrid.y = formatoConfig.grid.rows - posicaoGrid.height;
          }
        }

        return {
          ...elemento,
          id: `elemento-${Date.now()}-${index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`, // Gerar novo ID para evitar conflitos
          posicaoGrid,
        };
      });
    } catch (error) {
      console.error("Erro ao adaptar elementos para o formato:", error);
      return elementos; // Em caso de erro, retorna os elementos originais
    }
  };

  const aplicarElementosAoFormato = (
    elementosNovos: any[],
    formato: string,
    plataforma: string
  ) => {
    console.log(
      "Aplicando elementos ao formato:",
      formato,
      plataforma,
      elementosNovos
    );

    if (!verificarFormatoExiste(`${plataforma}/${formato}`)) {
      console.log("Formato inválido:", formato, availableFormats);
      toast({
        title: "Formato inválido",
        description: `O formato ${formato} não está disponível para esta plataforma.`,
        variant: "destructive",
      });
      return;
    }

    // Primeiro, mudar para o formato selecionado
    setSelectedFormat(formato);

    // Aguardar a mudança de formato ser processada
    setTimeout(() => {
      // Adaptar os elementos para o formato atual
      const config = getConfigFormato(plataforma, formato);
      if (config) {
        const elementosAdaptados = adaptarElementosParaFormato(
          elementosNovos,
          config
        );

        // Aplicar os elementos adaptados
        setElementos(elementosAdaptados);

        // Salvar automaticamente se auto-save estiver ativado
        if (autoSave && campanhaId) {
          adicionarAsset(campanhaId, {
            plataforma: plataforma,
            formato: formato,
            elementos: elementosAdaptados,
          });

          setLastSaved(new Date().toLocaleTimeString());
        }

        toast({
          title: "Elementos aplicados",
          description: `${elementosAdaptados.length} elementos foram aplicados ao formato ${formato}.`,
        });
      }
    }, 100); // Pequeno delay para garantir que o formato foi alterado
  };

  return (
    <div className="container px-4 py-6 mx-auto md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {campanhaAtual ? `Editor: ${campanhaAtual.nome}` : "Editor de Peças"}
        </h1>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {lastSaved && <span>Último salvamento: {lastSaved}</span>}
          </div>
          <Button onClick={handleSaveVersion} disabled={!formatConfig}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Versão
          </Button>
        </div>
      </div>

      {!campanhaAtual && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Campanha não encontrada</AlertTitle>
          <AlertDescription>
            A campanha que você está tentando editar não existe ou não foi
            carregada corretamente.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar esquerda - Seleção de Plataforma e Formato */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-4 border rounded-lg">
            <h2 className="mb-4 text-lg font-medium">Plataforma e Formato</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Plataforma</Label>
                <Select
                  value={selectedPlatform}
                  onValueChange={setSelectedPlatform}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {campanhaAtual?.plataformas.map((plataforma) => (
                      <SelectItem key={plataforma} value={plataforma}>
                        {plataforma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Formato</Label>
                <Select
                  value={selectedFormat}
                  onValueChange={setSelectedFormat}
                  disabled={availableFormats.length === 0}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormats.map((format) => (
                      <SelectItem key={format.nome} value={format.nome}>
                        {format.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formatConfig && (
              <>
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    Tamanho: {formatConfig.width} × {formatConfig.height} px
                  </p>
                  <p>
                    Grid: {formatConfig.grid.columns} × {formatConfig.grid.rows}
                  </p>
                </div>

                <FormatoPreview formatConfig={formatConfig} />
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoSave" className="cursor-pointer">
                Auto-salvar
              </Label>
              <input
                type="checkbox"
                id="autoSave"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={handleSaveVersion}
              disabled={!formatConfig}
            >
              Salvar Versão Atual
            </Button>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              disabled={versoes.length === 0}
            >
              {showVersionHistory
                ? "Ocultar Histórico"
                : "Ver Histórico de Versões"}
            </Button>

            {showVersionHistory && <HistoricoVersoes />}
          </div>

          {/* Componente para compartilhar elementos entre formatos */}
          <div className="p-4 border rounded-lg">
            <h2 className="mb-4 text-lg font-medium">Compartilhar Elementos</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-3">
                Salve e reutilize elementos entre diferentes formatos.
              </p>
              <CompartilharElementos
                elementos={elementos}
                plataforma={selectedPlatform}
                formato={selectedFormat}
                onAplicarElementos={handleAplicarElementos}
              />

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-3">
                  Gere múltiplos formatos com ajuda de IA.
                </p>
                <GeradorMultiFormatos
                  elementos={elementos}
                  plataformaAtual={selectedPlatform}
                  formatoAtual={selectedFormat}
                  onAplicarElementos={aplicarElementosAoFormato}
                />
              </div>
            </div>
          </div>

          <ExportadorPecas
            plataforma={selectedPlatform}
            formato={selectedFormat}
            formatConfig={formatConfig}
            elementos={elementos}
          />
        </div>

        {/* Conteúdo principal - Preview e Editor */}
        <div className="lg:col-span-9">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="elementos">Elementos</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="p-4 border rounded-lg">
              {formatConfig ? (
                <PreviewContainer formatConfig={formatConfig}>
                  <PreviewPeca
                    formatConfig={formatConfig}
                    elementos={elementos}
                    onElementosChange={setElementos}
                    editMode={true}
                  />
                </PreviewContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Selecione uma plataforma e formato para visualizar
                </div>
              )}
            </TabsContent>

            <TabsContent value="elementos">
              {formatConfig ? (
                <EditorElementos
                  formatConfig={formatConfig}
                  elementos={elementos}
                  setElementos={setElementos}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Selecione uma plataforma e formato para editar elementos
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
