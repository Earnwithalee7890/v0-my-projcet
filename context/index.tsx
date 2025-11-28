"use client"

import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config } from "@/config"

const queryClient = new QueryClient()

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies?: string | null
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
