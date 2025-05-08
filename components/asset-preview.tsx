"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Grid, Eye, EyeOff } from "lucide-react"
import { ElementRenderer } from "@/components/element-renderer"

interface AssetPreviewProps {
  formatConfig: any
  elements: any[]
}

export function AssetPreview({ formatConfig, elements }: AssetPreviewProps) {
  const [showGrid, setShowGrid] = useState(false)

  const { width, height, grid } = formatConfig
  const aspectRatio = width / height

  // Calculate grid cell dimensions
  const cellWidth = 100 / grid.columns
  const cellHeight = 100 / grid.rows

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Preview</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
            {showGrid ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showGrid ? "Hide Grid" : "Show Grid"}
          </Button>
        </div>
      </div>

      <div className="relative mx-auto border rounded-md shadow-sm" style={{ maxWidth: "100%", aspectRatio }}>
        {/* Canvas with proper aspect ratio */}
        <div className="relative w-full h-full overflow-hidden bg-white" style={{ aspectRatio }}>
          {/* Grid overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Vertical grid lines */}
              {Array.from({ length: grid.columns - 1 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-dashed border-blue-300 opacity-50"
                  style={{ left: `${cellWidth * (i + 1)}%` }}
                />
              ))}

              {/* Horizontal grid lines */}
              {Array.from({ length: grid.rows - 1 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-dashed border-blue-300 opacity-50"
                  style={{ top: `${cellHeight * (i + 1)}%` }}
                />
              ))}
            </div>
          )}

          {/* Render elements */}
          {elements.map((element, index) => (
            <ElementRenderer key={element.id || index} element={element} gridConfig={grid} />
          ))}
        </div>
      </div>

      <div className="p-3 text-sm text-center text-gray-500 border rounded-md bg-gray-50">
        <Grid className="inline-block w-4 h-4 mr-1" />
        {formatConfig.name}: {width} × {height} pixels
      </div>
    </div>
  )
}
