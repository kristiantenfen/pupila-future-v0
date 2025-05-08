"use client";

import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, History, Trash2 } from "lucide-react";
import { useCampanhasStore } from "@/lib/campanhas-store";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CampanhasPage() {
  const { campanhas, removerCampanha } = useCampanhasStore();
  const { toast } = useToast();

  // Formata a data para exibição
  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Calcula a versão com base na quantidade de assets
  const calcularVersao = (campanha: any) => {
    const numAssets = campanha.assets?.length || 0;
    const versaoBase = 1;
    const versaoDecimal = numAssets > 0 ? numAssets : 0;
    return `${versaoBase}.${versaoDecimal}`;
  };

  const handleRemoverCampanha = (
    id: string,
    nome: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`Tem certeza que deseja remover a campanha "${nome}"?`)) {
      removerCampanha(id);
      toast({
        title: "Campanha removida",
        description: `A campanha "${nome}" foi removida com sucesso.`,
      });
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Campanhas</h1>
        <Link href="/campanhas/nova">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </Link>
      </div>

      {campanhas.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-medium mb-2">
            Nenhuma campanha encontrada
          </h2>
          <p className="text-gray-500 mb-6">
            Comece criando sua primeira campanha de marketing.
          </p>
          <Link href="/campanhas/nova">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Campanha
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campanhas.map((campanha) => (
            <Card key={campanha.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{campanha.nome}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <History className="w-3 h-3" />v{calcularVersao(campanha)}
                  </Badge>
                </div>
                <CardDescription>{campanha.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Plataformas:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campanha.plataformas.map((plataforma) => (
                      <span
                        key={plataforma}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800"
                      >
                        {plataforma}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Criado em: {formatarData(campanha.criadoEm)}</span>
                  <span>{campanha.assets?.length || 0} peças</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) =>
                    handleRemoverCampanha(campanha.id, campanha.nome, e)
                  }
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remover
                </Button>
                <div className="flex space-x-2">
                  <Link href={`/campanhas/${campanha.id}/editor`}>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
