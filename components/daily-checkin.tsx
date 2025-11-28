"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarCheck, Loader2, Check, ExternalLink, Zap } from "lucide-react"
import { useAccount, useConnect, useSendTransaction, useSwitchChain, useChainId } from "wagmi"
import { base, celo, mainnet } from "wagmi/chains"

const NETWORKS = [
  {
    id: "base",
    name: "Base",
    chainId: base.id,
    explorerUrl: "https://basescan.org/tx/",
  },
  {
    id: "celo",
    name: "Celo",
    chainId: celo.id,
    explorerUrl: "https://celoscan.io/tx/",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    chainId: mainnet.id,
    explorerUrl: "https://etherscan.io/tx/",
  },
  {
    id: "monad",
    name: "Monad",
    chainId: 10143,
    explorerUrl: "https://testnet.monadexplorer.com/tx/",
  },
]

export function DailyCheckin() {
  const [network, setNetwork] = useState("base")
  const [status, setStatus] = useState<"idle" | "switching" | "loading" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [lastCheckin, setLastCheckin] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { sendTransactionAsync, reset: resetTransaction } = useSendTransaction()
  const { switchChainAsync } = useSwitchChain()
  const currentChainId = useChainId()

  const selectedNetwork = NETWORKS.find((n) => n.id === network)

  const sendCheckinTransaction = async () => {
    if (!address || !selectedNetwork) return

    try {
      setStatus("loading")
      resetTransaction()

      const result = await sendTransactionAsync({
        to: address,
        value: BigInt(0),
        data: "0x436865636b496e" as `0x${string}`,
        chainId: selectedNetwork.chainId,
      })

      if (result) {
        setTxHash(result)
        setLastCheckin(new Date().toLocaleDateString())
        setStatus("success")
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 3000)
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const handleCheckin = async () => {
    if (!isConnected) {
      try {
        connect({ connector: connectors[0] })
        return
      } catch (err) {
        console.error("Connection failed:", err)
        setStatus("error")
        setTimeout(() => setStatus("idle"), 3000)
        return
      }
    }

    if (!address || !selectedNetwork) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
      return
    }

    setTxHash(null)

    try {
      if (currentChainId === selectedNetwork.chainId) {
        await sendCheckinTransaction()
      } else {
        setStatus("switching")
        await switchChainAsync({ chainId: selectedNetwork.chainId })
        await new Promise((resolve) => setTimeout(resolve, 500))
        await sendCheckinTransaction()
      }
    } catch (error) {
      console.error("Check-in failed:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const getExplorerUrl = () => {
    if (!txHash) return ""
    const net = NETWORKS.find((n) => n.id === network)
    return net ? `${net.explorerUrl}${txHash}` : ""
  }

  const getButtonText = () => {
    if (!isConnected) return "Connect"
    if (status === "switching") return "Switching..."
    if (status === "loading") return "Sending..."
    if (status === "success") return "Done!"
    return "Check In"
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <CalendarCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-sm">Daily Check-In</p>
              <p className="text-xs text-muted-foreground">Earn on-chain proof</p>
            </div>
          </div>
          {lastCheckin && (
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <Zap className="w-3 h-3" />
              {lastCheckin}
            </div>
          )}
        </div>

        <Select value={network} onValueChange={setNetwork}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NETWORKS.map((net) => (
              <SelectItem key={net.id} value={net.id}>
                {net.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleCheckin}
          disabled={status === "loading" || status === "switching"}
          className={`w-full ${
            status === "success"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          }`}
          size="sm"
        >
          {(status === "loading" || status === "switching") && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {status === "success" && <Check className="w-4 h-4 mr-2" />}
          {getButtonText()}
        </Button>

        {status === "success" && txHash && (
          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 text-xs text-emerald-500 hover:underline"
          >
            View transaction
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {status === "error" && <p className="text-xs text-center text-red-500">Check-in failed. Please try again.</p>}
      </div>
    </Card>
  )
}
