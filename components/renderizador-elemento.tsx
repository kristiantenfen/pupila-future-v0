"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Move } from "lucide-react";

interface RenderizadorElementoProps {
  elemento: any;
  gridConfig: {
    columns: number;
    rows: number;
  };
  isEditing?: boolean;
  onClick?: () => void;
  onPositionChange?: (
    id: string,
    newPosition: { x: number; y: number }
  ) => void;
  container?: HTMLElement | null;
}

export function RenderizadorElemento({
  elemento,
  gridConfig,
  isEditing = false,
  onClick,
  onPositionChange,
  container,
}: RenderizadorElementoProps) {
  // Verificação de segurança para elemento nulo
  if (!elemento) {
    console.error("Tentativa de renderizar elemento nulo ou indefinido");
    return null;
  }

  // Extrair propriedades com valores padrão seguros
  const {
    tipo = "desconhecido",
    conteudo = {},
    posicaoGrid = { x: 0, y: 0, width: 1, height: 1 },
    estilo = {},
    camada = 10,
    id = "elemento-sem-id",
  } = elemento;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const snapLinesRef = useRef<{ x: number[]; y: number[] }>({ x: [], y: [] });

  // Store style values in refs to avoid re-renders
  const styleRef = useRef({
    position: "absolute" as const,
    left: `${(posicaoGrid.x / gridConfig.columns) * 100}%`,
    top: `${(posicaoGrid.y / gridConfig.rows) * 100}%`,
    width: `${(posicaoGrid.width / gridConfig.columns) * 100}%`,
    height: `${(posicaoGrid.height / gridConfig.rows) * 100}%`,
    zIndex: isEditing && isDragging ? 100 : camada,
    cursor: isEditing ? "move" : "default",
    ...estilo,
  });

  // Update style ref when props change (without triggering re-renders)
  useEffect(() => {
    styleRef.current = {
      position: "absolute" as const,
      left: `${(posicaoGrid.x / gridConfig.columns) * 100}%`,
      top: `${(posicaoGrid.y / gridConfig.rows) * 100}%`,
      width: `${(posicaoGrid.width / gridConfig.columns) * 100}%`,
      height: `${(posicaoGrid.height / gridConfig.rows) * 100}%`,
      zIndex: isEditing && isDragging ? 100 : camada,
      cursor: isEditing ? "move" : "default",
      ...estilo,
    };

    // Apply styles directly to the DOM element
    if (elementRef.current) {
      Object.assign(elementRef.current.style, styleRef.current);
    }
  }, [
    posicaoGrid,
    gridConfig.columns,
    gridConfig.rows,
    isEditing,
    isDragging,
    camada,
    estilo,
  ]);

  // Generate snap lines when container or grid changes
  useEffect(() => {
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const cellWidth = containerRect.width / gridConfig.columns;
    const cellHeight = containerRect.height / gridConfig.rows;

    // Generate X positions for each vertical grid line
    const xLines = Array.from({ length: gridConfig.columns + 1 }).map(
      (_, i) => i * cellWidth
    );

    // Generate Y positions for each horizontal grid line
    const yLines = Array.from({ length: gridConfig.rows + 1 }).map(
      (_, i) => i * cellHeight
    );

    snapLinesRef.current = { x: xLines, y: yLines };
  }, [container, gridConfig.columns, gridConfig.rows]);

  // Handle mouse down to start dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditing || !container || !elementRef.current) return;

      e.preventDefault();
      setIsDragging(true);

      const containerRect = container.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();

      // Calculate mouse offset within the element
      dragOffsetRef.current = {
        x: e.clientX - elementRect.left,
        y: e.clientY - elementRect.top,
      };
    },
    [isEditing, container]
  );

  // Handle mouse move during dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !container || !elementRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const cellWidth = containerRect.width / gridConfig.columns;
      const cellHeight = containerRect.height / gridConfig.rows;

      // Calculate position relative to container
      let x = e.clientX - containerRect.left - dragOffsetRef.current.x;
      let y = e.clientY - containerRect.top - dragOffsetRef.current.y;

      // Implement snap to grid - find closest line
      const snapThreshold = Math.min(
        (containerRect.width / gridConfig.columns) * 0.3, // 30% of cell width
        (containerRect.height / gridConfig.rows) * 0.3 // 30% of cell height
      );

      // Snap to vertical lines (X)
      for (const snapX of snapLinesRef.current.x) {
        if (Math.abs(x - snapX) < snapThreshold) {
          x = snapX;
          break;
        }
      }

      // Snap to horizontal lines (Y)
      for (const snapY of snapLinesRef.current.y) {
        if (Math.abs(y - snapY) < snapThreshold) {
          y = snapY;
          break;
        }
      }

      // Limit position within container
      x = Math.max(
        0,
        Math.min(x, containerRect.width - elementRef.current.offsetWidth)
      );
      y = Math.max(
        0,
        Math.min(y, containerRect.height - elementRef.current.offsetHeight)
      );

      // Update element position directly in the DOM
      elementRef.current.style.left = `${x}px`;
      elementRef.current.style.top = `${y}px`;
    },
    [isDragging, container, gridConfig.columns, gridConfig.rows]
  );

  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    if (!isDragging || !container || !elementRef.current || !onPositionChange)
      return;

    setIsDragging(false);

    const containerRect = container.getBoundingClientRect();
    const cellWidth = containerRect.width / gridConfig.columns;
    const cellHeight = containerRect.height / gridConfig.rows;

    // Get current position in pixels
    const rect = elementRef.current.getBoundingClientRect();
    const x = rect.left - containerRect.left;
    const y = rect.top - containerRect.top;

    // Convert to grid position and round to nearest value
    const gridX = Math.max(
      0,
      Math.min(
        Math.round(x / cellWidth),
        gridConfig.columns - posicaoGrid.width
      )
    );
    const gridY = Math.max(
      0,
      Math.min(Math.round(y / cellHeight), gridConfig.rows - posicaoGrid.height)
    );

    // Update position in state
    onPositionChange(id, { x: gridX, y: gridY });

    // Restore percentage-based style to maintain responsiveness
    elementRef.current.style.left = `${(gridX / gridConfig.columns) * 100}%`;
    elementRef.current.style.top = `${(gridY / gridConfig.rows) * 100}%`;
    elementRef.current.style.width = `${
      (posicaoGrid.width / gridConfig.columns) * 100
    }%`;
    elementRef.current.style.height = `${
      (posicaoGrid.height / gridConfig.rows) * 100
    }%`;
  }, [
    isDragging,
    container,
    gridConfig,
    onPositionChange,
    id,
    posicaoGrid.width,
    posicaoGrid.height,
  ]);

  // Remove these state variables:
  // const [mouseMoveListener, setMouseMoveListener] = useState<((e: MouseEvent) => void) | null>(null)
  // const [mouseUpListener, setMouseUpListener] = useState<(() => void) | null>(null)

  // Replace the three useEffect blocks for event listeners with this single one:
  useEffect(() => {
    if (isDragging && container) {
      // Add event listeners directly
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      // Clean up function
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, container, handleMouseMove, handleMouseUp]);

  // Helper function to get image filters
  const getImageFilter = (filtro: string) => {
    switch (filtro) {
      case "grayscale":
        return "grayscale(100%)";
      case "sepia":
        return "sepia(100%)";
      case "blur":
        return "blur(4px)";
      case "brightness":
        return "brightness(150%)";
      case "contrast":
        return "contrast(200%)";
      default:
        return "none";
    }
  };

  // Render element content based on type
  const renderContent = () => {
    switch (tipo) {
      case "logo":
        return (
          <div
            className={cn(
              "flex items-center justify-center relative w-full h-full opacity-70",
              isDragging && ""
            )}
            onClick={onClick}
          >
            {conteudo.src ? (
              <Image
                src={conteudo.src || "/placeholder.svg"}
                alt="Logo"
                fill
                className="object-contain w-full h-full"
                sizes="100%"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm text-gray-500  rounded-md">
                Placeholder Logo
              </div>
            )}
          </div>
        );

      case "texto":
        return (
          <div
            className={cn(
              "overflow-hidden w-full h-full",
              isDragging && "opacity-70"
            )}
            style={{
              fontSize: conteudo.fontSize || "16px",
              fontWeight: conteudo.fontWeight || "normal",
              color: conteudo.color || "#000000",
              textAlign: (conteudo.textAlign as any) || "left",
            }}
            onClick={onClick}
          >
            {conteudo.texto || "Texto placeholder"}
          </div>
        );

      case "imagem":
        return (
          <div
            className={cn(
              "overflow-hidden relative w-full h-full",
              isDragging && "opacity-70"
            )}
            onClick={onClick}
          >
            {conteudo.src ? (
              <Image
                src={conteudo.src || "/placeholder.svg"}
                alt={conteudo.alt || "Imagem"}
                fill
                className="object-cover w-full h-full"
                sizes="100%"
                priority
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm text-gray-500 bg-gray-100 rounded-md">
                Placeholder Imagem
              </div>
            )}
          </div>
        );

      case "imagemPersonalizada":
        return (
          <div
            className={cn(
              "overflow-hidden relative w-full h-full",
              isDragging && "opacity-70"
            )}
            onClick={onClick}
            style={{
              borderRadius: conteudo.borda
                ? conteudo.bordaRadius || "0px"
                : "0px",
              border: conteudo.borda ? "2px solid #3b82f6" : "none",
            }}
          >
            {conteudo.src ? (
              <div className="relative w-full h-full">
                <Image
                  src={conteudo.src || "/placeholder.svg"}
                  alt={conteudo.alt || "Imagem Personalizada"}
                  fill
                  className="object-cover w-full h-full"
                  sizes="100%"
                  priority
                  style={{
                    opacity: (conteudo.opacidade || 100) / 100,
                    filter: getImageFilter(conteudo.filtro || ""),
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm text-gray-500 bg-gray-100 rounded-md">
                Imagem Personalizada
              </div>
            )}
          </div>
        );

      case "cta":
        return (
          <div
            className={cn(
              "flex items-center justify-center w-full h-full",
              isDragging && "opacity-70"
            )}
            onClick={onClick}
          >
            <div
              className="px-4 py-2 text-center text-white rounded-md"
              style={{
                backgroundColor: conteudo.backgroundColor || "#000000",
                fontSize: conteudo.fontSize || "16px",
              }}
            >
              {conteudo.texto || "Chamada para Ação"}
            </div>
          </div>
        );

      default:
        return (
          <div
            className={cn(
              "flex items-center justify-center text-gray-500 text-sm w-full h-full",
              isDragging && "opacity-70"
            )}
            onClick={onClick}
          >
            Elemento Desconhecido
          </div>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute",
        isEditing && [
          "border-2 border-dashed transition-colors",
          isDragging ? "border-blue-500 bg-blue-50/20" : "border-blue-400",
          !isDragging && "bg-white/10",
        ]
      )}
      style={styleRef.current}
      onMouseDown={isEditing ? handleMouseDown : undefined}
    >
      {renderContent()}
      {isEditing && (
        <div className="absolute top-0 right-0 p-1 bg-blue-500 text-white rounded-bl-md opacity-70">
          <Move size={14} />
        </div>
      )}
    </div>
  );
}
