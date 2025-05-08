import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { SplashScreen } from "@/components/ui/splash-screen"

export const metadata: Metadata = {
  title: "Gerador de Peças Gráficas",
  description: "Sistema para geração de peças gráficas para campanhas de marketing",
}

export default function HomePage() {
  
  return (<SplashScreen />)
}
