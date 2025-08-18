"use client"

import * as React from "react"

const THEMES = [
  "default", "zinc", "red", "orange", "amber", "yellow", "lime", 
  "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", 
  "violet", "purple", "fuchsia", "pink", "rose"
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Apply saved theme on mount
    const savedTheme = localStorage.getItem("finflow-theme") || "default"
    
    // Remove all theme classes first
    THEMES.forEach(theme => {
      document.documentElement.classList.remove(`theme-${theme}`)
    })
    
    // Apply saved theme (except default which uses the base black theme)
    if (savedTheme !== "default") {
      document.documentElement.classList.add(`theme-${savedTheme}`)
    }
  }, [])

  return <>{children}</>
}
