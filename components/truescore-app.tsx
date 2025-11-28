"use client"

import { useState, useEffect, useCallback } from "react"
import { ScoreDisplay } from "./score-display"
import { UserStats } from "./user-stats"
import { ReputationBadge } from "./reputation-badge"
import { TipButton } from "./tip-button"
import { DailyCheckin } from "./daily-checkin"
import { ThemeToggle } from "./theme-toggle"
import { AppFooter } from "./app-footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet } from "lucide-react"
import sdk, { type FrameContext } from "@farcaster/frame-sdk"

export interface UserData {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  score: number
  reputation: "safe" | "neutral" | "risky" | "spammy"
  followers: number
  following: number
  verifiedAddresses: string[]
}

export function TrueScoreApp() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const fetchUserData = useCallback(async (fid: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/neynar/user?fid=${fid}`)
      if (!response.ok) throw new Error("Failed to fetch user data")
      const data = await response.json()
      setUserData(data)
      if (data.verifiedAddresses && data.verifiedAddresses.length > 0) {
        setWalletAddress(data.verifiedAddresses[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light"
      document.documentElement.classList.toggle("dark", newTheme === "dark")
      return newTheme
    })
  }, [])

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const frameContext = await sdk.context
        setContext(frameContext)

        if (frameContext?.client?.theme) {
          const fcTheme = frameContext.client.theme === "dark" ? "dark" : "light"
          setTheme(fcTheme)
          document.documentElement.classList.toggle("dark", fcTheme === "dark")
        }

        if (frameContext?.user?.fid) {
          await fetchUserData(frameContext.user.fid)
        } else {
          await fetchUserData(338060)
        }

        await sdk.actions.ready()
        setIsSDKLoaded(true)
      } catch (err) {
        console.error("SDK initialization error:", err)
        setIsSDKLoaded(true)
        await fetchUserData(338060)
      }
    }

    initializeSDK()
  }, [fetchUserData])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">TrustScore</h1>
            <p className="text-muted-foreground">Loading your score...</p>
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">TrustScore</h1>
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  if (!userData) return null

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark bg-zinc-950" : "bg-gray-50"}`}
    >
      <div className="max-w-md mx-auto p-4 pb-20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {walletAddress && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Wallet className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                  </span>
                </div>
              )}
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">Your real Neynar reputation</p>

          {/* User Info */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border">
            <img
              src={userData.pfpUrl || "/placeholder.svg"}
              alt={userData.displayName}
              className="w-16 h-16 rounded-full border-2 border-border"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg truncate">{userData.displayName}</h2>
              <p className="text-muted-foreground text-sm">@{userData.username}</p>
            </div>
          </div>

          {/* Score Display */}
          <div className="p-6 rounded-2xl bg-card border">
            <ScoreDisplay score={userData.score} />
          </div>

          {/* Reputation Badge */}
          <div className="p-4 rounded-2xl bg-card border">
            <ReputationBadge reputation={userData.reputation} />
          </div>

          <div className="p-4 rounded-2xl bg-card border">
            <UserStats followers={userData.followers} following={userData.following} />
          </div>

          {/* Tip & Check-in */}
          <div className="grid grid-cols-2 gap-3">
            <TipButton recipientFid={userData.fid} />
            <DailyCheckin walletAddress={walletAddress} username={userData.username} score={userData.score} />
          </div>

          {/* Footer */}
          <div className="pt-4">
            <AppFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
