"use client"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Shield, ShieldAlert, ShieldX } from "lucide-react"

interface ReputationBadgeProps {
  reputation: "safe" | "neutral" | "risky" | "spammy"
}

export function ReputationBadge({ reputation }: ReputationBadgeProps) {
  const config = {
    safe: {
      label: "Safe Account",
      icon: ShieldCheck,
      className: "bg-primary/15 text-primary border-primary/30 shadow-primary/20",
      glow: "shadow-[0_0_20px_rgba(74,222,128,0.3)]",
    },
    neutral: {
      label: "Neutral Account",
      icon: Shield,
      className: "bg-chart-2/15 text-chart-2 border-chart-2/30 shadow-chart-2/20",
      glow: "shadow-[0_0_20px_rgba(56,189,248,0.3)]",
    },
    risky: {
      label: "Risky Account",
      icon: ShieldAlert,
      className: "bg-chart-3/15 text-chart-3 border-chart-3/30 shadow-chart-3/20",
      glow: "shadow-[0_0_20px_rgba(250,204,21,0.3)]",
    },
    spammy: {
      label: "Spammy Account",
      icon: ShieldX,
      className: "bg-destructive/15 text-destructive border-destructive/30 shadow-destructive/20",
      glow: "shadow-[0_0_20px_rgba(248,113,113,0.3)]",
    },
  }

  const { label, icon: Icon, className, glow } = config[reputation]

  return (
    <div className="flex items-center justify-center">
      <Badge variant="outline" className={`${className} ${glow} px-4 py-2 text-sm font-medium`}>
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Badge>
    </div>
  )
}
