"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"

interface PreviewContainerProps {
  formatConfig: any
  children: React.ReactNode
  className?: string
}

export function PreviewContainer({ formatConfig, children, className = "" }: PreviewContainerProps) {
  const [fullWidth, setFullWidth] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { width, height } = formatConfig
  const aspectRatio = width / height
  const isVertical = height > width

  // Adicione este log logo após a desestruturação das props
  console.log(
    `PreviewContainer - Formato: ${formatConfig.nome}, Dimensões: ${width}x${height}, Proporção: ${aspectRatio}`,
  )

  // Calcula o estilo do container com base na orientação e proporção
  const getContainerStyle = () => {
    if (fullWidth) {
      return {
        width: "100%",
        aspectRatio: `${width} / ${height}`,
      }
    }

    // Para formatos verticais (como Stories), limitamos a altura e calculamos a largura
    if (isVertical) {
      return {
        height: "70vh",
        width: `calc(70vh * ${aspectRatio})`,
        maxWidth: "100%",
      }
    }

    // Para formatos horizontais, usamos largura máxima e calculamos a altura
    return {
      width: "100%",
      aspectRatio: `${width} / ${height}`,
      maxHeight: "70vh",
    }
  }

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
        style={getContainerStyle()}
      >
        {children}
      </div>
    </div>
  )
}
