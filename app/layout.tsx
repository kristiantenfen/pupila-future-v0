import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/toaster"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}
