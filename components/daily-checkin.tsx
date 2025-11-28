"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CalendarCheck, Loader2, Check, ExternalLink, Zap, Share2, X } from "lucide-react"
import sdk from "@farcaster/frame-sdk"

const NETWORKS = [
  {
    id: "base",
    name: "Base",
    chainId: 8453,
    explorerUrl: "https://basescan.org/tx/",
  },
  {
    id: "celo",
    name: "Celo",
    chainId: 42220,
    explorerUrl: "https://celoscan.io/tx/",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    chainId: 1,
    explorerUrl: "https://etherscan.io/tx/",
  },
  {
    id: "monad",
    name: "Monad",
    chainId: 10143,
    explorerUrl: "https://testnet.monadexplorer.com/tx/",
  },
]

interface DailyCheckinProps {
  walletAddress?: string | null
  username?: string
  score?: number
}

export function DailyCheckin({ walletAddress, username, score }: DailyCheckinProps) {
  const [network, setNetwork] = useState("base")
  const [status, setStatus] = useState<"idle" | "switching" | "loading" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [lastCheckin, setLastCheckin] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const selectedNetwork = NETWORKS.find((n) => n.id === network)

  const handleCheckin = async () => {
    if (!walletAddress || !selectedNetwork) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
      return
    }

    setTxHash(null)
    setStatus("loading")

    try {
      // Use Farcaster SDK's ethProvider for transactions
      const provider = await sdk.wallet.ethProvider

      // Request to switch chain if needed
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${selectedNetwork.chainId.toString(16)}` }],
        })
      } catch (switchError: any) {
        // Chain might not be added, continue anyway
        console.log("Chain switch:", switchError.message)
      }

      // Send the check-in transaction
      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: walletAddress,
            value: "0x0",
            data: "0x436865636b496e", // "CheckIn" in hex
          },
        ],
      })

      if (txHash) {
        setTxHash(txHash as string)
        setLastCheckin(new Date().toLocaleDateString())
        setStatus("success")
        setShowShareDialog(true)
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

  const getExplorerUrl = () => {
    if (!txHash) return ""
    const net = NETWORKS.find((n) => n.id === network)
    return net ? `${net.explorerUrl}${txHash}` : ""
  }

  const getButtonText = () => {
    if (!walletAddress) return "No Wallet"
    if (status === "switching") return "Switching..."
    if (status === "loading") return "Sending..."
    if (status === "success") return "Done!"
    return "Check In"
  }

  const handleShare = async () => {
    try {
      const shareText = `I just checked in on TrustScore! My score is ${score || 0}. Check yours at`
      const frameUrl = process.env.NEXT_PUBLIC_URL || "https://trust-score.vercel.app"

      await sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`,
      )
      setShowShareDialog(false)
    } catch (error) {
      console.error("Share failed:", error)
    }
  }

  const handleCloseDialog = () => {
    setShowShareDialog(false)
  }

  return (
    <>
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
            disabled={status === "loading" || status === "switching" || !walletAddress}
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

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              Check-In Successful!
            </DialogTitle>
            <DialogDescription>
              Your daily check-in has been recorded on-chain. Share your achievement with your followers!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Your TrustScore</p>
                <p className="text-4xl font-bold text-emerald-500">{score || 0}</p>
                <p className="text-xs text-muted-foreground">@{username}</p>
              </div>
            </div>

            {txHash && (
              <a
                href={getExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View transaction on explorer
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCloseDialog}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share on Warpcast
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
