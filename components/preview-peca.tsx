"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Grid, Eye, EyeOff, Move } from "lucide-react";
import { RenderizadorElemento } from "@/components/renderizador-elemento";

interface PreviewPecaProps {
  formatConfig: any;
  elementos: any[];
  onElementosChange?: (elementos: any[]) => void;
  editMode?: boolean;
}

export function PreviewPeca({
  formatConfig,
  elementos,
  onElementosChange,
  editMode = false,
}: PreviewPecaProps) {
  const [showGrid, setShowGrid] = useState(true); // Grid visível por padrão
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { width, height, grid } = formatConfig;
  const aspectRatio = width / height;
  const isVertical = height > width;
  const isWideFormat = aspectRatio > 2; // Para formatos muito largos como banners

  // Calcula dimensões das células do grid
  const cellWidth = 100 / grid.columns;
  const cellHeight = 100 / grid.rows;

  // Atualiza o tamanho do container quando ele é montado ou redimensionado
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    // Atualiza o tamanho inicial
    updateSize();

    // Adiciona um listener para redimensionamento
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const handlePositionChange = (
    id: string,
    newPosition: { x: number; y: number }
  ) => {
    if (!onElementosChange) return;

    const newElementos = elementos.map((el) => {
      if (el.id === id) {
        return {
          ...el,
          posicaoGrid: {
            ...el.posicaoGrid,
            x: Math.max(
              0,
              Math.min(newPosition.x, grid.columns - el.posicaoGrid.width)
            ),
            y: Math.max(
              0,
              Math.min(newPosition.y, grid.rows - el.posicaoGrid.height)
            ),
          },
        };
      }
      return el;
    });

    onElementosChange(newElementos);
  };

  const handleElementClick = (elementId: string) => {
    if (editMode) {
      setSelectedElementId(elementId);
    }
  };

  // Ordena os elementos por z-index (camada) antes de renderizar
  const elementosOrdenados = [...elementos].sort((a, b) => {
    const camadaA = a.camada || 10;
    const camadaB = b.camada || 10;
    return camadaA - camadaB;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between h-full p-4">
        <h3 className="text-lg font-medium">Preview</h3>
        <div className="flex space-x-2">
          {editMode && (
            <div className="mr-2 text-sm text-gray-500 flex items-center gap-2">
              <Move size={16} className="text-blue-500" />
              <span>Arraste os elementos para posicioná-los</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showGrid ? "Ocultar Grid" : "Mostrar Grid"}
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative  w-full h-full overflow-hidden bg-white border rounded-md shadow-sm"
        style={{
          aspectRatio: `${width} / ${height}`,
          //maxHeight: isVertical ? "70vh" : isWideFormat ? "200px" : "60vh",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Renderiza elementos */}
        {elementosOrdenados.map((elemento) => (
          <RenderizadorElemento
            key={elemento.id}
            elemento={elemento}
            gridConfig={grid}
            isEditing={editMode}
            onClick={() => handleElementClick(elemento.id)}
            onPositionChange={handlePositionChange}
            container={containerRef.current}
          />
        ))}

        {/* Sobreposição do grid - agora renderizado por cima dos elementos */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Linhas verticais do grid */}
            {Array.from({ length: grid.columns + 1 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 border-l border-blue-300"
                style={{
                  left: `${(i / grid.columns) * 100}%`,
                  opacity: i % 2 === 0 ? 0.4 : 0.2, // Linhas principais mais visíveis
                  borderStyle: i % 2 === 0 ? "solid" : "dashed",
                }}
              />
            ))}

            {/* Linhas horizontais do grid */}
            {Array.from({ length: grid.rows + 1 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 border-t border-blue-300"
                style={{
                  top: `${(i / grid.rows) * 100}%`,
                  opacity: i % 2 === 0 ? 0.4 : 0.2, // Linhas principais mais visíveis
                  borderStyle: i % 2 === 0 ? "solid" : "dashed",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 text-sm text-center text-gray-500 border rounded-md bg-gray-50">
        <Grid className="inline-block w-4 h-4 mr-1" />
        {formatConfig.nome}: {width} × {height} pixels
      </div>
    </div>
  );
}
