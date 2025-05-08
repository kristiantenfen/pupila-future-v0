import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Gerador de Peças Gráficas",
  description: "Sistema para geração de peças gráficas para campanhas de marketing",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-primary">Gerador</span>
            <span>de Peças Gráficas</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Gerador de Peças Gráficas para Campanhas
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Crie peças gráficas consistentes para múltiplas plataformas com nosso poderoso sistema de geração.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/campanhas">
                  <Button>Ver Campanhas</Button>
                </Link>
                <Link href="/campanhas/nova">
                  <Button variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Nova Campanha
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Suporte Multi-Plataforma</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Gere peças para redes sociais, banners web, materiais impressos e mais, com regras específicas para
                  cada plataforma.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Design Baseado em Grid</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Mantenha consistência visual com nosso sistema inteligente de grid que se adapta a diferentes
                  formatos.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Regras de Elementos</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Aplique logos, CTAs, gráficos e textos com regras de posicionamento específicas para cada plataforma.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 px-4 py-6 text-center md:flex-row md:gap-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 Gerador de Peças Gráficas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
