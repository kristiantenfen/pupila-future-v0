"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Share2, Loader2 } from "lucide-react"

interface AssetExporterProps {
  platform: string
  format: string
  formatConfig: any
  elements: any[]
}

export function AssetExporter({ platform, format, formatConfig, elements }: AssetExporterProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Mock export function - in a real app, this would generate and download the image
  const handleExport = async () => {
    if (!formatConfig) return

    setIsExporting(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real implementation, this would:
    // 1. Render the canvas with all elements
    // 2. Convert to image (PNG/JPG)
    // 3. Trigger download

    console.log("Exporting asset:", {
      platform,
      format,
      dimensions: `${formatConfig.width}x${formatConfig.height}`,
      elements: elements.length,
    })

    setIsExporting(false)

    // Mock download - in a real app, this would be the actual file
    const a = document.createElement("a")
    a.href = "#"
    a.download = `${platform}-${format}-asset.png`
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Asset</CardTitle>
        <CardDescription>Generate and download your marketing asset</CardDescription>
      </CardHeader>
      <CardContent>
        {formatConfig ? (
          <div className="space-y-4">
            <div className="p-3 text-sm border rounded-md bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Platform:</span>
                </div>
                <div className="capitalize">{platform}</div>

                <div>
                  <span className="font-medium">Format:</span>
                </div>
                <div>{format}</div>

                <div>
                  <span className="font-medium">Dimensions:</span>
                </div>
                <div>
                  {formatConfig.width} × {formatConfig.height}px
                </div>

                <div>
                  <span className="font-medium">Elements:</span>
                </div>
                <div>{elements.length}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-center text-gray-500">Select a platform and format to enable export</div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={handleExport} disabled={!formatConfig || isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export Asset
            </>
          )}
        </Button>
        <Button variant="outline" className="w-full" disabled={!formatConfig || isExporting}>
          <Share2 className="w-4 h-4 mr-2" />
          Share Asset
        </Button>
      </CardFooter>
    </Card>
  )
}
