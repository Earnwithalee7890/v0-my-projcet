"use client"
import { Users, UserPlus } from "lucide-react"

interface UserStatsProps {
  followers: number
  following: number
}

export function UserStats({ followers, following }: UserStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const stats = [
    { label: "Followers", value: followers, icon: Users, color: "from-primary/20 to-primary/5" },
    { label: "Following", value: following, icon: UserPlus, color: "from-chart-2/20 to-chart-2/5" },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <div key={index} className={`flex flex-col items-center p-4 rounded-xl bg-gradient-to-br ${stat.color}`}>
          <stat.icon className="w-5 h-5 mb-2 text-muted-foreground" />
          <span className="text-2xl font-bold">{formatNumber(stat.value)}</span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
