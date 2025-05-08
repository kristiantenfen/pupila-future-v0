import { Progress } from "@/components/ui/progress"

interface ProgressoGeracaoProps {
  etapaAtual: number
  totalEtapas: number
  mensagem: string
  visivel?: boolean
}

export function ProgressoGeracao({ etapaAtual, totalEtapas, mensagem, visivel = true }: ProgressoGeracaoProps) {
  if (!visivel) return null

  const progresso = Math.round((etapaAtual / totalEtapas) * 100)

  return (
    <div className="space-y-2 my-4">
      <div className="flex justify-between text-sm">
        <span>Progresso: {progresso}%</span>
        <span>
          Etapa {etapaAtual} de {totalEtapas}
        </span>
      </div>
      <Progress value={progresso} className="h-2" />
      <p className="text-sm text-gray-500">{mensagem}</p>
    </div>
  )
}
