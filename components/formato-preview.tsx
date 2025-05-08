"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"

interface FormatoPreviewProps {
  formatConfig: any
}

export function FormatoPreview({ formatConfig }: FormatoPreviewProps) {
  const [showDetails, setShowDetails] = useState(false)

  const { width, height, nome } = formatConfig
  const aspectRatio = width / height
  const isVertical = height > width
  const isSquare = Math.abs(aspectRatio - 1) < 0.1
  const isWideFormat = aspectRatio > 2

  // Determina o tamanho e a classe com base na orientação
  const getPreviewStyle = () => {
    // Base size for the preview
    const baseSize = 120

    if (isSquare) {
      return {
        width: `${baseSize}px`,
        height: `${baseSize}px`,
        className: "bg-blue-100 border border-blue-300 rounded flex items-center justify-center",
      }
    }

    if (isVertical) {
      return {
        width: `${baseSize * aspectRatio}px`,
        height: `${baseSize}px`,
        className: "bg-green-100 border border-green-300 rounded flex items-center justify-center",
      }
    }

    if (isWideFormat) {
      return {
        width: `${baseSize}px`,
        height: `${baseSize / aspectRatio}px`,
        className: "bg-purple-100 border border-purple-300 rounded flex items-center justify-center",
      }
    }

    // Default horizontal format
    return {
      width: `${baseSize}px`,
      height: `${baseSize / aspectRatio}px`,
      className: "bg-blue-100 border border-blue-300 rounded flex items-center justify-center",
    }
  }

  const previewStyle = getPreviewStyle()

  // Determina o nome da proporção para exibição
  const getAspectRatioName = () => {
    if (isSquare) return "1:1"
    if (isVertical) {
      if (Math.abs(aspectRatio - 0.5625) < 0.05) return "9:16"
      if (Math.abs(aspectRatio - 0.75) < 0.05) return "3:4"
      return `${Math.round(aspectRatio * 100)}:100`
    }
    if (isWideFormat) {
      if (Math.abs(aspectRatio - 3.2) < 0.1) return "16:5"
      if (Math.abs(aspectRatio - 4) < 0.1) return "4:1"
      return `${Math.round(aspectRatio * 10)}:10`
    }
    if (Math.abs(aspectRatio - 1.78) < 0.05) return "16:9"
    if (Math.abs(aspectRatio - 1.33) < 0.05) return "4:3"
    return `${Math.round(aspectRatio * 10)}:10`
  }

  return (
    <div className="mt-4 p-3 border rounded-md bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Visualização do Formato</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </Button>
      </div>

      <div className="flex flex-col items-center">
        {/* Representação visual do formato */}
        <div
          className={previewStyle.className}
          style={{
            width: previewStyle.width,
            height: previewStyle.height,
          }}
        >
          <span className="text-xs text-center px-1 truncate">{getAspectRatioName()}</span>
        </div>

        {/* Detalhes do formato */}
        {showDetails && (
          <div className="mt-3 text-xs text-gray-500 space-y-1 w-full">
            <div className="flex justify-between">
              <span>Formato:</span>
              <span className="font-medium">{nome}</span>
            </div>
            <div className="flex justify-between">
              <span>Dimensões:</span>
              <span className="font-medium">
                {width} × {height}px
              </span>
            </div>
            <div className="flex justify-between">
              <span>Proporção:</span>
              <span className="font-medium">
                {getAspectRatioName()} ({aspectRatio.toFixed(2)}:1)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Orientação:</span>
              <span className="font-medium">
                {isSquare ? "Quadrado" : isVertical ? "Vertical" : isWideFormat ? "Banner" : "Horizontal"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
