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

  // Determina a classe de tamanho com base na orientação
  const sizeClass = isVertical
    ? "h-40 w-[calc(40px*" + width / height + ")]"
    : "w-40 h-[calc(40px/" + width / height + ")]"

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
          className={`bg-blue-100 border border-blue-300 rounded flex items-center justify-center ${sizeClass}`}
          style={{
            aspectRatio: `${width} / ${height}`,
          }}
        >
          <span className="text-xs text-blue-700 text-center px-1 truncate">
            {isVertical ? "9:16" : width / height >= 1.7 ? "16:9" : "4:3"}
          </span>
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
                {isVertical
                  ? `9:16 (${aspectRatio.toFixed(2)}:1)`
                  : `${Math.round(aspectRatio * 9)}:9 (${aspectRatio.toFixed(2)}:1)`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Orientação:</span>
              <span className="font-medium">{isVertical ? "Vertical" : "Horizontal"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
