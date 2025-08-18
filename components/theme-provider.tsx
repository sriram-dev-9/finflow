"use client"

import * as React from "react"

const THEMES = [
  "black", "zinc", "slate", "stone", "gray", "neutral", 
  "red", "rose", "orange", "green", "blue", "yellow", "violet"
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Apply saved theme on mount
    const savedTheme = localStorage.getItem("finflow-theme") || "black"
    
    // Remove all theme classes first
    THEMES.forEach(theme => {
      document.documentElement.classList.remove(`theme-${theme}`)
    })
    
    // Apply saved theme (except black which is default)
    if (savedTheme !== "black") {
      document.documentElement.classList.add(`theme-${savedTheme}`)
    }
  }, [])

  return <>{children}</>
}
