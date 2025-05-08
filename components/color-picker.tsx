"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color)

  useEffect(() => {
    setInputValue(color)
  }, [color])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setInputValue(newColor)
    onChange(newColor)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
    setInputValue(newHex)

    // Validar se é um código hex válido antes de atualizar
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newHex)) {
      onChange(newHex)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Input type="color" value={inputValue} onChange={handleColorChange} className="w-12 h-8 p-1" />
      <Input type="text" value={inputValue} onChange={handleHexChange} placeholder="#000000" />
    </div>
  )
}
