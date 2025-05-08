"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePecasStore } from "@/lib/pecas-store"
import { Clock, ArrowUpRight } from "lucide-react"

export function HistoricoVersoes() {
  const { versoes, carregarVersao } = usePecasStore()
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleLoadVersion = (versao: any) => {
    carregarVersao(versao)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-4 text-lg font-medium">Histórico de Versões</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {versoes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">Nenhuma versão salva ainda.</p>
          ) : (
            versoes.map((versao, index) => (
              <div
                key={versao.timestamp}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedVersion(expandedVersion === versao.timestamp ? null : versao.timestamp)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Versão {versoes.length - index}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(versao.timestamp)}</span>
                </div>

                {expandedVersion === versao.timestamp && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                      <div>Plataforma:</div>
                      <div className="capitalize">{versao.plataforma}</div>
                      <div>Formato:</div>
                      <div>{versao.formato}</div>
                      <div>Elementos:</div>
                      <div>{versao.elementos.length}</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLoadVersion(versao)
                      }}
                    >
                      <ArrowUpRight className="w-3 h-3 mr-2" />
                      Carregar esta versão
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
