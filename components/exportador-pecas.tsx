"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Share2, Loader2 } from "lucide-react"

interface ExportadorPecasProps {
  plataforma: string
  formato: string
  formatConfig: any
  elementos: any[]
}

export function ExportadorPecas({ plataforma, formato, formatConfig, elementos }: ExportadorPecasProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Função de exportação simulada - em uma aplicação real, isso geraria e baixaria a imagem
  const handleExport = async () => {
    if (!formatConfig) return

    setIsExporting(true)

    // Simula tempo de processamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Em uma implementação real, isso:
    // 1. Renderizaria o canvas com todos os elementos
    // 2. Converteria para imagem (PNG/JPG)
    // 3. Iniciaria o download

    console.log("Exportando peça:", {
      plataforma,
      formato,
      dimensoes: `${formatConfig.width}x${formatConfig.height}`,
      elementos: elementos.length,
    })

    setIsExporting(false)

    // Download simulado - em uma aplicação real, este seria o arquivo real
    const a = document.createElement("a")
    a.href = "#"
    a.download = `${plataforma}-${formato}-peca.png`
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Peça</CardTitle>
        <CardDescription>Gere e baixe sua peça gráfica</CardDescription>
      </CardHeader>
      <CardContent>
        {formatConfig ? (
          <div className="space-y-4">
            <div className="p-3 text-sm border rounded-md bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Plataforma:</span>
                </div>
                <div className="capitalize">{plataforma}</div>

                <div>
                  <span className="font-medium">Formato:</span>
                </div>
                <div>{formato}</div>

                <div>
                  <span className="font-medium">Dimensões:</span>
                </div>
                <div>
                  {formatConfig.width} × {formatConfig.height}px
                </div>

                <div>
                  <span className="font-medium">Elementos:</span>
                </div>
                <div>{elementos.length}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-center text-gray-500">
            Selecione uma plataforma e formato para habilitar a exportação
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={handleExport} disabled={!formatConfig || isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Exportar Peça
            </>
          )}
        </Button>
        <Button variant="outline" className="w-full" disabled={!formatConfig || isExporting}>
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar Peça
        </Button>
      </CardFooter>
    </Card>
  )
}
