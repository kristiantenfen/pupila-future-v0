"use client";

import { useRouter } from "next/navigation";
import { useCampanhasStore } from "@/lib/campanhas-store";
import { useToast } from "@/components/ui/use-toast";
import { opcoesDePlataformas } from "@/lib/config-plataformas";

export default function NovaCampanhaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const adicionarCampanha = useCampanhasStore(
    (state) => state.adicionarCampanha
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nome = formData.get("nome") as string;
    const descricao = formData.get("descricao") as string;

    if (!nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para a campanha.",
        variant: "destructive",
      });
      return;
    }

    try {
      const campanhaId = adicionarCampanha({
        nome,
        descricao,
        plataformas: opcoesDePlataformas.map((plataforma) => plataforma.id),
      });

      toast({
        title: "Campanha criada",
        description: "A campanha foi criada com sucesso!",
      });

      router.push(`/campanhas/${campanhaId}/editor`);
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      toast({
        title: "Erro ao criar campanha",
        description:
          "Ocorreu um erro ao criar a campanha. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <h1 className="page-title">Nova Campanha</h1>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome da Campanha
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="input"
                placeholder="Digite o nome da sua campanha"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao" className="form-label">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                className="textarea"
                placeholder="Descreva o objetivo da sua campanha"
                rows={4}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => router.back()}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Criar Campanha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
