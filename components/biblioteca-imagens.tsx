"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface BibliotecaImagensProps {
  onSelectImage: (imageUrl: string) => void
}

export function BibliotecaImagens({ onSelectImage }: BibliotecaImagensProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Imagens de exemplo para a biblioteca
  const imagens = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000",
      alt: "Montanhas ao pôr do sol",
      tags: ["natureza", "paisagem", "montanhas"],
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=1000",
      alt: "Praia tropical",
      tags: ["natureza", "praia", "mar", "tropical"],
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1682687220923-c58b9a4592ea?q=80&w=1000",
      alt: "Cidade à noite",
      tags: ["cidade", "urbano", "noite", "luzes"],
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1682687220067-dced9a881b56?q=80&w=1000",
      alt: "Floresta densa",
      tags: ["natureza", "floresta", "árvores", "verde"],
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000",
      alt: "Deserto ao entardecer",
      tags: ["natureza", "deserto", "areia", "pôr do sol"],
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=1000",
      alt: "Lago com montanhas",
      tags: ["natureza", "lago", "montanhas", "reflexo"],
    },
  ]

  // Filtra imagens com base no termo de busca
  const imagensFiltradas = searchTerm
    ? imagens.filter(
        (img) =>
          img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : imagens

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Selecionar da Biblioteca
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Biblioteca de Imagens</DialogTitle>
        </DialogHeader>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar imagens..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
          {imagensFiltradas.map((imagem) => (
            <div
              key={imagem.id}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-md border hover:border-blue-500 transition-all"
              onClick={() => {
                onSelectImage(imagem.url)
              }}
            >
              <img src={imagem.url || "/placeholder.svg"} alt={imagem.alt} className="h-full w-full object-cover" />
            </div>
          ))}
          {imagensFiltradas.length === 0 && (
            <div className="col-span-3 py-8 text-center text-gray-500">
              Nenhuma imagem encontrada para "{searchTerm}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
