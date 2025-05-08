"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface ElementRendererProps {
  element: any
  gridConfig: {
    columns: number
    rows: number
  }
  isEditing?: boolean
  onClick?: () => void
}

export function ElementRenderer({ element, gridConfig, isEditing = false, onClick }: ElementRendererProps) {
  const { type, content, gridPosition, style = {} } = element

  // Calculate position based on grid
  const left = `${(gridPosition.x / gridConfig.columns) * 100}%`
  const top = `${(gridPosition.y / gridConfig.rows) * 100}%`
  const width = `${(gridPosition.width / gridConfig.columns) * 100}%`
  const height = `${(gridPosition.height / gridConfig.rows) * 100}%`

  // Base styles for positioning
  const baseStyles = {
    position: "absolute",
    left,
    top,
    width,
    height,
    ...style,
  }

  // Render different element types
  const renderElement = () => {
    switch (type) {
      case "logo":
        return (
          <div
            className={cn("flex items-center justify-center", isEditing && "border-2 border-dashed border-blue-400")}
            style={baseStyles}
            onClick={onClick}
          >
            {content.src ? (
              <Image
                src={content.src || "/placeholder.svg"}
                alt="Logo"
                width={200}
                height={100}
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm text-gray-500 bg-gray-100 rounded-md">
                Logo Placeholder
              </div>
            )}
          </div>
        )

      case "text":
        return (
          <div
            className={cn("overflow-hidden", isEditing && "border-2 border-dashed border-blue-400")}
            style={{
              ...baseStyles,
              fontSize: content.fontSize || "16px",
              fontWeight: content.fontWeight || "normal",
              color: content.color || "#000000",
              textAlign: content.textAlign || "left",
            }}
            onClick={onClick}
          >
            {content.text || "Text placeholder"}
          </div>
        )

      case "image":
        return (
          <div
            className={cn("overflow-hidden", isEditing && "border-2 border-dashed border-blue-400")}
            style={baseStyles}
            onClick={onClick}
          >
            {content.src ? (
              <Image
                src={content.src || "/placeholder.svg"}
                alt={content.alt || "Image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm text-gray-500 bg-gray-100 rounded-md">
                Image Placeholder
              </div>
            )}
          </div>
        )

      case "cta":
        return (
          <div
            className={cn("flex items-center justify-center", isEditing && "border-2 border-dashed border-blue-400")}
            style={baseStyles}
            onClick={onClick}
          >
            <div
              className="px-4 py-2 text-center text-white rounded-md"
              style={{
                backgroundColor: content.backgroundColor || "#000000",
                fontSize: content.fontSize || "16px",
              }}
            >
              {content.text || "Call to Action"}
            </div>
          </div>
        )

      default:
        return (
          <div
            className={cn(
              "flex items-center justify-center bg-gray-100 text-gray-500 text-sm",
              isEditing && "border-2 border-dashed border-blue-400",
            )}
            style={baseStyles}
            onClick={onClick}
          >
            Unknown Element
          </div>
        )
    }
  }

  return renderElement()
}
