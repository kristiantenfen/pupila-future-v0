"use client"

import { DebugStorage } from "@/components/debug-storage"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function DebugPage() {
  const router = useRouter()

  return (
    <div className="container px-4 py-6 mx-auto md:px-6">
      <div className="mb-6 flex items-center">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Editor
        </Button>
        <h1 className="text-2xl font-bold">Ferramentas de Debug</h1>
      </div>

      <div className="grid gap-6">
        <DebugStorage />
      </div>
    </div>
  )
}
