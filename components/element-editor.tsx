"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PlusCircle, Trash2, MoveHorizontal, MoveVertical, Copy } from "lucide-react"

interface ElementEditorProps {
  formatConfig: any
  elements: any[]
  setElements: (elements: any[]) => void
}

export function ElementEditor({ formatConfig, elements, setElements }: ElementEditorProps) {
  const [selectedElementIndex, setSelectedElementIndex] = useState<number | null>(null)

  const selectedElement = selectedElementIndex !== null ? elements[selectedElementIndex] : null

  // Add a new element
  const addElement = (type: string) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      gridPosition: {
        x: 1,
        y: 1,
        width: 2,
        height: 2,
      },
      content: getDefaultContentForType(type),
    }

    setElements([...elements, newElement])
    setSelectedElementIndex(elements.length)
  }

  // Get default content based on element type
  const getDefaultContentForType = (type: string) => {
    switch (type) {
      case "logo":
        return { src: "" }
      case "text":
        return { text: "Sample Text", fontSize: "16px", color: "#000000", textAlign: "left" }
      case "image":
        return { src: "", alt: "Image" }
      case "cta":
        return { text: "Learn More", backgroundColor: "#0070f3", fontSize: "16px" }
      default:
        return {}
    }
  }

  // Update element properties
  const updateElement = (updates: any) => {
    if (selectedElementIndex === null) return

    const updatedElements = [...elements]
    updatedElements[selectedElementIndex] = {
      ...updatedElements[selectedElementIndex],
      ...updates,
    }

    setElements(updatedElements)
  }

  // Update element content
  const updateElementContent = (contentUpdates: any) => {
    if (selectedElementIndex === null) return

    const updatedElements = [...elements]
    updatedElements[selectedElementIndex] = {
      ...updatedElements[selectedElementIndex],
      content: {
        ...updatedElements[selectedElementIndex].content,
        ...contentUpdates,
      },
    }

    setElements(updatedElements)
  }

  // Update element position
  const updateElementPosition = (positionUpdates: any) => {
    if (selectedElementIndex === null) return

    const updatedElements = [...elements]
    updatedElements[selectedElementIndex] = {
      ...updatedElements[selectedElementIndex],
      gridPosition: {
        ...updatedElements[selectedElementIndex].gridPosition,
        ...positionUpdates,
      },
    }

    setElements(updatedElements)
  }

  // Delete selected element
  const deleteElement = () => {
    if (selectedElementIndex === null) return

    const updatedElements = elements.filter((_, index) => index !== selectedElementIndex)
    setElements(updatedElements)
    setSelectedElementIndex(null)
  }

  // Duplicate selected element
  const duplicateElement = () => {
    if (selectedElementIndex === null) return

    const elementToDuplicate = elements[selectedElementIndex]
    const duplicatedElement = {
      ...JSON.parse(JSON.stringify(elementToDuplicate)),
      id: `element-${Date.now()}`,
      gridPosition: {
        ...elementToDuplicate.gridPosition,
        x: Math.min(
          elementToDuplicate.gridPosition.x + 1,
          formatConfig.grid.columns - elementToDuplicate.gridPosition.width,
        ),
      },
    }

    setElements([...elements, duplicatedElement])
    setSelectedElementIndex(elements.length)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Elements list */}
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => addElement("logo")}>
                  <PlusCircle className="w-4 h-4 mr-1" /> Logo
                </Button>
                <Button size="sm" variant="outline" onClick={() => addElement("text")}>
                  <PlusCircle className="w-4 h-4 mr-1" /> Text
                </Button>
                <Button size="sm" variant="outline" onClick={() => addElement("image")}>
                  <PlusCircle className="w-4 h-4 mr-1" /> Image
                </Button>
                <Button size="sm" variant="outline" onClick={() => addElement("cta")}>
                  <PlusCircle className="w-4 h-4 mr-1" /> CTA
                </Button>
              </div>

              <div className="border rounded-md divide-y">
                {elements.length === 0 ? (
                  <div className="p-4 text-sm text-center text-gray-500">
                    No elements added yet. Add elements using the buttons above.
                  </div>
                ) : (
                  elements.map((element, index) => (
                    <div
                      key={element.id || index}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedElementIndex === index ? "bg-blue-50" : ""}`}
                      onClick={() => setSelectedElementIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{element.type}</span>
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateElement()
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteElement()
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {element.type === "text" && (
                        <div className="mt-1 text-sm text-gray-500 truncate">{element.content.text || "Text"}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Element properties */}
      <div className="lg:col-span-8">
        {selectedElement ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit {selectedElement.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="position">Position</TabsTrigger>
                </TabsList>

                <TabsContent value="content">
                  {selectedElement.type === "text" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="text">Text Content</Label>
                        <Input
                          id="text"
                          value={selectedElement.content.text || ""}
                          onChange={(e) => updateElementContent({ text: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fontSize">Font Size</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="fontSize"
                            value={selectedElement.content.fontSize || "16px"}
                            onChange={(e) => updateElementContent({ fontSize: e.target.value })}
                            className="w-24"
                          />
                          <Slider
                            defaultValue={[Number.parseInt(selectedElement.content.fontSize) || 16]}
                            min={8}
                            max={72}
                            step={1}
                            onValueChange={(value) => updateElementContent({ fontSize: `${value[0]}px` })}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="textColor"
                            type="color"
                            value={selectedElement.content.color || "#000000"}
                            onChange={(e) => updateElementContent({ color: e.target.value })}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            value={selectedElement.content.color || "#000000"}
                            onChange={(e) => updateElementContent({ color: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="textAlign">Text Alignment</Label>
                        <Select
                          value={selectedElement.content.textAlign || "left"}
                          onValueChange={(value) => updateElementContent({ textAlign: value })}
                        >
                          <SelectTrigger id="textAlign">
                            <SelectValue placeholder="Select alignment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedElement.type === "image" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="imageSrc">Image URL</Label>
                        <Input
                          id="imageSrc"
                          value={selectedElement.content.src || ""}
                          onChange={(e) => updateElementContent({ src: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="imageAlt">Alt Text</Label>
                        <Input
                          id="imageAlt"
                          value={selectedElement.content.alt || ""}
                          onChange={(e) => updateElementContent({ alt: e.target.value })}
                          placeholder="Image description"
                        />
                      </div>
                    </div>
                  )}

                  {selectedElement.type === "logo" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="logoSrc">Logo URL</Label>
                        <Input
                          id="logoSrc"
                          value={selectedElement.content.src || ""}
                          onChange={(e) => updateElementContent({ src: e.target.value })}
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>
                  )}

                  {selectedElement.type === "cta" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ctaText">Button Text</Label>
                        <Input
                          id="ctaText"
                          value={selectedElement.content.text || ""}
                          onChange={(e) => updateElementContent({ text: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ctaColor">Button Color</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="ctaColor"
                            type="color"
                            value={selectedElement.content.backgroundColor || "#0070f3"}
                            onChange={(e) => updateElementContent({ backgroundColor: e.target.value })}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            value={selectedElement.content.backgroundColor || "#0070f3"}
                            onChange={(e) => updateElementContent({ backgroundColor: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ctaFontSize">Font Size</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="ctaFontSize"
                            value={selectedElement.content.fontSize || "16px"}
                            onChange={(e) => updateElementContent({ fontSize: e.target.value })}
                            className="w-24"
                          />
                          <Slider
                            defaultValue={[Number.parseInt(selectedElement.content.fontSize) || 16]}
                            min={8}
                            max={32}
                            step={1}
                            onValueChange={(value) => updateElementContent({ fontSize: `${value[0]}px` })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="position">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gridX">X Position</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElementPosition({
                                x: Math.max(0, selectedElement.gridPosition.x - 1),
                              })
                            }
                            disabled={selectedElement.gridPosition.x <= 0}
                          >
                            <MoveHorizontal className="w-4 h-4 rotate-180" />
                          </Button>
                          <Input
                            id="gridX"
                            type="number"
                            min={0}
                            max={formatConfig.grid.columns - selectedElement.gridPosition.width}
                            value={selectedElement.gridPosition.x}
                            onChange={(e) => updateElementPosition({ x: Number.parseInt(e.target.value) || 0 })}
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElementPosition({
                                x: Math.min(
                                  formatConfig.grid.columns - selectedElement.gridPosition.width,
                                  selectedElement.gridPosition.x + 1,
                                ),
                              })
                            }
                            disabled={
                              selectedElement.gridPosition.x >=
                              formatConfig.grid.columns - selectedElement.gridPosition.width
                            }
                          >
                            <MoveHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gridY">Y Position</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElementPosition({
                                y: Math.max(0, selectedElement.gridPosition.y - 1),
                              })
                            }
                            disabled={selectedElement.gridPosition.y <= 0}
                          >
                            <MoveVertical className="w-4 h-4 rotate-180" />
                          </Button>
                          <Input
                            id="gridY"
                            type="number"
                            min={0}
                            max={formatConfig.grid.rows - selectedElement.gridPosition.height}
                            value={selectedElement.gridPosition.y}
                            onChange={(e) => updateElementPosition({ y: Number.parseInt(e.target.value) || 0 })}
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElementPosition({
                                y: Math.min(
                                  formatConfig.grid.rows - selectedElement.gridPosition.height,
                                  selectedElement.gridPosition.y + 1,
                                ),
                              })
                            }
                            disabled={
                              selectedElement.gridPosition.y >=
                              formatConfig.grid.rows - selectedElement.gridPosition.height
                            }
                          >
                            <MoveVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gridWidth">Width (cells)</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElementPosition({
                                width: Math.max(1, selectedElement.gridPosition.width - 1),
                              })
                            }
                            disabled={selectedElement.gridPosition.width <= 1}
                          >
                            <MoveHorizontal className="w-4 h-4 rotate-180" />
                          </Button>
                          <Input
                            id="gridWidth"
                            type="number"
                            min={1}
                            max={formatConfig.grid.columns - selectedElement.gridPosition.x}
                            value={selectedElement.gridPosition.width}
                            onChange={(e) => updateElementPosition({ width: Number.parseInt(e.target.value) || 1 })}
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElementPosition({
                                width: Math.min(
                                  formatConfig.grid.columns - selectedElement.gridPosition.x,
                                  selectedElement.gridPosition.width + 1,
                                ),
                              })
                            }
                            disabled={
                              selectedElement.gridPosition.width >=
                              formatConfig.grid.columns - selectedElement.gridPosition.x
                            }
                          >
                            <MoveHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gridHeight">Height (cells)</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElementPosition({
                                height: Math.max(1, selectedElement.gridPosition.height - 1),
                              })
                            }
                            disabled={selectedElement.gridPosition.height <= 1}
                          >
                            <MoveVertical className="w-4 h-4 rotate-180" />
                          </Button>
                          <Input
                            id="gridHeight"
                            type="number"
                            min={1}
                            max={formatConfig.grid.rows - selectedElement.gridPosition.y}
                            value={selectedElement.gridPosition.height}
                            onChange={(e) => updateElementPosition({ height: Number.parseInt(e.target.value) || 1 })}
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateElementPosition({
                                height: Math.min(
                                  formatConfig.grid.rows - selectedElement.gridPosition.y,
                                  selectedElement.gridPosition.height + 1,
                                ),
                              })
                            }
                            disabled={
                              selectedElement.gridPosition.height >=
                              formatConfig.grid.rows - selectedElement.gridPosition.y
                            }
                          >
                            <MoveVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full p-8 text-center border rounded-lg">
            <div className="max-w-md space-y-2">
              <h3 className="text-lg font-medium">No Element Selected</h3>
              <p className="text-sm text-gray-500">
                Select an element from the list on the left to edit its properties, or add a new element.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
