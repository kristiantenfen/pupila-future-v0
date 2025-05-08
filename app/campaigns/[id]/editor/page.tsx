"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AssetPreview } from "@/components/asset-preview"
import { ElementEditor } from "@/components/element-editor"
import { AssetExporter } from "@/components/asset-exporter"
import { getPlatformFormats, getFormatConfig } from "@/lib/platform-config"
import { useAssetStore } from "@/lib/asset-store"

export default function CampaignEditorPage() {
  const params = useParams()
  const campaignId = params.id as string

  const [selectedPlatform, setSelectedPlatform] = useState("instagram")
  const [selectedFormat, setSelectedFormat] = useState("")
  const [availableFormats, setAvailableFormats] = useState<string[]>([])
  const [formatConfig, setFormatConfig] = useState<any>(null)

  const { elements, setElements, resetElements } = useAssetStore()

  // Set available formats when platform changes
  useEffect(() => {
    const formats = getPlatformFormats(selectedPlatform)
    setAvailableFormats(formats)
    setSelectedFormat(formats[0] || "")
  }, [selectedPlatform])

  // Update format config when format changes
  useEffect(() => {
    if (selectedFormat) {
      const config = getFormatConfig(selectedPlatform, selectedFormat)
      setFormatConfig(config)
      resetElements(config.defaultElements || [])
    }
  }, [selectedFormat, selectedPlatform, resetElements])

  return (
    <div className="container px-4 py-6 mx-auto md:px-6">
      <h1 className="mb-6 text-2xl font-bold">Asset Editor</h1>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left sidebar - Platform & Format Selection */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-4 border rounded-lg">
            <h2 className="mb-4 text-lg font-medium">Platform & Format</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="print">Print</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select
                  value={selectedFormat}
                  onValueChange={setSelectedFormat}
                  disabled={availableFormats.length === 0}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formatConfig && (
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Size: {formatConfig.width} × {formatConfig.height} px
                </p>
                <p>
                  Grid: {formatConfig.grid.columns} × {formatConfig.grid.rows}
                </p>
              </div>
            )}
          </div>

          <AssetExporter
            platform={selectedPlatform}
            format={selectedFormat}
            formatConfig={formatConfig}
            elements={elements}
          />
        </div>

        {/* Main content - Preview & Editor */}
        <div className="lg:col-span-9">
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="elements">Elements</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="p-4 border rounded-lg">
              {formatConfig ? (
                <AssetPreview formatConfig={formatConfig} elements={elements} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a platform and format to preview
                </div>
              )}
            </TabsContent>

            <TabsContent value="elements">
              {formatConfig ? (
                <ElementEditor formatConfig={formatConfig} elements={elements} setElements={setElements} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a platform and format to edit elements
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
