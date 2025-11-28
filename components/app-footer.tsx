"use client"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

export function AppFooter() {
  return (
    <footer className="space-y-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <Image src="/neynar-logo.jpg" alt="Neynar" width={24} height={24} className="rounded" />
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
        Your trusted source for real Farcaster reputation data. View authentic Neynar scores, follower stats, and
        account reputation labels.
      </p>

      {/* Links */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <a
          href="https://neynar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Powered by Neynar
          <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-muted-foreground">|</span>
        <a
          href="https://farcaster.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Farcaster
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <p className="text-xs text-muted-foreground/60">Built for the Farcaster community</p>
    </footer>
  )
}
