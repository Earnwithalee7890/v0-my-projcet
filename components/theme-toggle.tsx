"use client"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

interface ThemeToggleProps {
  theme: "light" | "dark"
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle} className="rounded-full">
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
