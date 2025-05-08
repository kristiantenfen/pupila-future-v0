// Função para gerar sugestões de posicionamento usando a OpenAI
export async function gerarSugestoesComIA(elementos: any[], formatoOrigem: any, formatosDestino: any[]): Promise<any> {
  try {
    const response = await fetch("/api/posicionamento-elementos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        elementos,
        formatoOrigem,
        formatosDestino,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao gerar sugestões: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao gerar sugestões com IA:", error)
    throw error
  }
}
