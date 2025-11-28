"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Coins, Loader2, Sparkles, Copy, Check } from "lucide-react"
import sdk from "@farcaster/frame-sdk"

const WALLET_ADDRESS = "0xBC74eA115f4f30Ce737F394a93701Abd1642d7D1" as const

interface TipButtonProps {
  walletAddress?: string | null
}

export function TipButton({ walletAddress }: TipButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [copied, setCopied] = useState(false)

  const handleTip = async () => {
    if (!walletAddress) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
      return
    }

    setStatus("loading")
    try {
      const provider = await sdk.wallet.ethProvider

      // Send 0.001 ETH tip
      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: WALLET_ADDRESS,
            value: "0x38D7EA4C68000", // 0.001 ETH in hex
          },
        ],
      })

      if (txHash) {
        setStatus("success")
        setTimeout(() => setStatus("idle"), 3000)
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error) {
      console.error("Tip failed:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(WALLET_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="font-medium text-sm">Tip the Creator</p>
            <p className="text-xs text-muted-foreground">Support with 0.001 ETH</p>
          </div>
        </div>

        {/* Wallet Address Display */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border">
          <span className="text-xs font-mono text-muted-foreground flex-1">{shortenAddress(WALLET_ADDRESS)}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          </Button>
        </div>

        <Button
          onClick={handleTip}
          disabled={status === "loading" || !walletAddress}
          className={`w-full ${
            status === "success"
              ? "bg-green-500 hover:bg-green-600"
              : status === "error"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          }`}
          size="sm"
        >
          {status === "loading" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {status === "success" && <Sparkles className="w-4 h-4 mr-2" />}
          {status === "idle" && <Coins className="w-4 h-4 mr-2" />}
          {status === "error" && <Coins className="w-4 h-4 mr-2" />}
          {status === "loading"
            ? "Sending..."
            : status === "success"
              ? "Tip Sent!"
              : status === "error"
                ? "Failed - Try Again"
                : "Send Tip"}
        </Button>
      </div>
    </Card>
  )
}
