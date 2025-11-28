import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { headers } from "next/headers"
import ContextProvider from "@/context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const appUrl = process.env.NEXT_PUBLIC_URL || "https://truescore.vercel.app"

export const metadata: Metadata = {
  title: "TrueScore - Your Real Neynar Reputation",
  description: "View your real Neynar score, engagement analytics, and account reputation on Farcaster",
  generator: "v0.app",
  openGraph: {
    title: "TrueScore",
    description: "Your Real Neynar Reputation Score",
    images: [`${appUrl}/og-image.jpg`],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/og-image.jpg`,
    "fc:frame:button:1": "View My Score",
    "fc:frame:post_url": `${appUrl}/api/frame`,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersObj = await headers()
  const cookies = headersObj.get("cookie")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
        <Analytics />
      </body>
    </html>
  )
}
