"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { opcoesDePlataformas } from "@/lib/config-plataformas"
import { ColorPicker } from "@/components/color-picker"
import { useCampanhasStore } from "@/lib/campanhas-store"
import { useToast } from "@/components/ui/use-toast"

export default function NovaCampanhaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const adicionarCampanha = useCampanhasStore((state) => state.adicionarCampanha)

  const [activeTab, setActiveTab] = useState("informacoes")
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    plataformas: [] as string[],
    cores: {
      primaria: "#0070f3",
      secundaria: "#ff4081",
      texto: "#333333",
      fundo: "#ffffff",
    },
    tipografia: {
      titulo: "Inter",
      corpo: "Roboto",
    },
  })

  const handlePlataformaToggle = (plataforma: string) => {
    setFormData((prev) => {
      const plataformas = prev.plataformas.includes(plataforma)
        ? prev.plataformas.filter((p) => p !== plataforma)
        : [...prev.plataformas, plataforma]
      return { ...prev, plataformas }
    })
  }

  const handleColorChange = (tipo: string, cor: string) => {
    setFormData((prev) => ({
      ...prev,
      cores: {
        ...prev.cores,
        [tipo]: cor,
      },
    }))
  }

  const handleFontChange = (tipo: string, fonte: string) => {
    setFormData((prev) => ({
      ...prev,
      tipografia: {
        ...prev.tipografia,
        [tipo]: fonte,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para a campanha.",
        variant: "destructive",
      })
      return
    }

    if (formData.plataformas.length === 0) {
      toast({
        title: "Plataformas obrigatórias",
        description: "Selecione pelo menos uma plataforma para a campanha.",
        variant: "destructive",
      })
      return
    }

    try {
      // Adicionar a campanha ao store
      const campanhaId = adicionarCampanha({
        nome: formData.nome,
        descricao: formData.descricao,
        plataformas: formData.plataformas,
      })

      toast({
        title: "Campanha criada",
        description: "A campanha foi criada com sucesso!",
      })

      // Redirecionar para o editor da campanha
      router.push(`/campanhas/${campanhaId}/editor`)
    } catch (error) {
      console.error("Erro ao criar campanha:", error)
      toast({
        title: "Erro ao criar campanha",
        description: "Ocorreu um erro ao criar a campanha. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const nextTab = () => {
    if (activeTab === "informacoes") setActiveTab("design")
    else if (activeTab === "design") setActiveTab("plataformas")
  }

  const prevTab = () => {
    if (activeTab === "plataformas") setActiveTab("design")
    else if (activeTab === "design") setActiveTab("informacoes")
  }

  return (
    <div className="container px-4 py-8 mx-auto md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Criar Nova Campanha</h1>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalhes da Campanha</CardTitle>
            <CardDescription>Configure as informações básicas da sua campanha de marketing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="informacoes">Informações</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="plataformas">Plataformas</TabsTrigger>
              </TabsList>

              <TabsContent value="informacoes" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Campanha</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Promoção Verão 2025"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o propósito e objetivos desta campanha"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Paleta de Cores</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cor Primária</Label>
                      <ColorPicker
                        color={formData.cores.primaria}
                        onChange={(cor) => handleColorChange("primaria", cor)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor Secundária</Label>
                      <ColorPicker
                        color={formData.cores.secundaria}
                        onChange={(cor) => handleColorChange("secundaria", cor)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor de Texto</Label>
                      <ColorPicker color={formData.cores.texto} onChange={(cor) => handleColorChange("texto", cor)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor de Fundo</Label>
                      <ColorPicker color={formData.cores.fundo} onChange={(cor) => handleColorChange("fundo", cor)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tipografia</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fonteTitulo">Fonte de Título</Label>
                      <select
                        id="fonteTitulo"
                        className="w-full p-2 border rounded-md"
                        value={formData.tipografia.titulo}
                        onChange={(e) => handleFontChange("titulo", e.target.value)}
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fonteCorpo">Fonte de Corpo</Label>
                      <select
                        id="fonteCorpo"
                        className="w-full p-2 border rounded-md"
                        value={formData.tipografia.corpo}
                        onChange={(e) => handleFontChange("corpo", e.target.value)}
                      >
                        <option value="Roboto">Roboto</option>
                        <option value="Inter">Inter</option>
                        <option value="Lato">Lato</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Nunito">Nunito</option>
                      </select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="plataformas" className="space-y-6">
                <div className="space-y-3">
                  <Label>Plataformas</Label>
                  <p className="text-sm text-gray-500">Selecione as plataformas para as quais deseja criar peças.</p>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {opcoesDePlataformas.map((plataforma) => (
                      <div key={plataforma.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={plataforma.id}
                          checked={formData.plataformas.includes(plataforma.id)}
                          onCheckedChange={() => handlePlataformaToggle(plataforma.id)}
                        />
                        <Label htmlFor={plataforma.id} className="font-normal cursor-pointer">
                          {plataforma.nome}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeTab !== "informacoes" ? (
              <Button type="button" variant="outline" onClick={prevTab}>
                Voltar
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            )}

            {activeTab !== "plataformas" ? (
              <Button type="button" onClick={nextTab}>
                Próximo
              </Button>
            ) : (
              <Button type="submit" disabled={!formData.nome || formData.plataformas.length === 0}>
                Criar Campanha
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
