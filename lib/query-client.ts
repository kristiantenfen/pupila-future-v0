"use client"

import { QueryClient } from "@tanstack/react-query"

// Cria uma instância do QueryClient com configuração padrão
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
