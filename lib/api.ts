// Função auxiliar para fazer requisições HTTP
const api = {
  async get(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`)
    }
    return response.json()
  },

  async post(url: string, data: any) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`)
    }

    return response.json()
  },
}

export { api }
