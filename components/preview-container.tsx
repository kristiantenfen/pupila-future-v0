"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface PreviewContainerProps {
  formatConfig: any;
  children: React.ReactNode;
  className?: string;
}

export function PreviewContainer({
  formatConfig,
  children,
  className = "",
}: PreviewContainerProps) {
  const [fullWidth, setFullWidth] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { width, height, nome } = formatConfig;
  const aspectRatio = width / height;
  const isVertical = height > width;
  const isSquare = width === height;
  const isWideFormat = aspectRatio > 2; // Para formatos muito largos como banners

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

  // Calcula o estilo do container com base na orientação e proporção
  const getContainerStyle = () => {
    if (fullWidth) {
      return {
        width: "100%",
        aspectRatio: `${width} / ${height}`,
        maxHeight: "100vh", // Limita a altura máxima para visualização
      };
    }

    // Para formatos verticais (como Stories)
    if (isVertical) {
      return {
        height: "70vh",
        width: `calc(70vh * ${aspectRatio})`,
        maxWidth: "100%",
      };
    }

    // Para formatos quadrados
    if (isSquare) {
      const size = Math.min(500, window.innerWidth * 0.8);
      return {
        width: `${size}px`,
        height: `${size}px`,
        maxWidth: "100%",
      };
    }

    // Para formatos muito largos (banners)
    if (isWideFormat) {
      return {
        width: "100%",
        height: `calc(100% / ${aspectRatio})`,
        maxHeight: "200px",
      };
    }

    // Para formatos horizontais padrão
    return {
      width: "100%",
      aspectRatio: `${width} / ${height}`,
      maxHeight: "60vh",
    };
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-30">
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white/80 backdrop-blur-sm"
          onClick={() => setFullWidth(!fullWidth)}
        >
          {fullWidth ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </Button>
      </div>

      <div
        ref={containerRef}
        className={`relative mx-auto border rounded-md shadow-sm overflow-hidden bg-white ${className}`}
        // style={getContainerStyle()}
      >
        {children}
      </div>

      <div className="mt-2 text-xs text-center text-gray-500">
        <span>
          {nome} • {width}×{height}px • Proporção: {aspectRatio.toFixed(2)}:1
        </span>
      </div>
    </div>
  );
}
