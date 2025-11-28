"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ConnectWalletButton() {
  const { isConnected, address } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => disconnect()} className="gap-2 text-red-500">
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700" disabled={isPending}>
          <Wallet className="h-4 w-4" />
          {isPending ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {connectors.map((connector) => (
          <DropdownMenuItem key={connector.uid} onClick={() => connect({ connector })} className="gap-2">
            {connector.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
