"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const THEMES = [
  { name: "Black (Default)", value: "default", description: "Your beautiful black theme" },
  { name: "Zinc", value: "zinc", description: "Neutral gray accent" },
  { name: "Red", value: "red", description: "Bold red accent" },
  { name: "Orange", value: "orange", description: "Vibrant orange accent" },
  { name: "Amber", value: "amber", description: "Warm amber accent" },
  { name: "Yellow", value: "yellow", description: "Bright yellow accent" },
  { name: "Lime", value: "lime", description: "Fresh lime accent" },
  { name: "Green", value: "green", description: "Natural green accent" },
  { name: "Emerald", value: "emerald", description: "Rich emerald accent" },
  { name: "Teal", value: "teal", description: "Cool teal accent" },
  { name: "Cyan", value: "cyan", description: "Electric cyan accent" },
  { name: "Sky", value: "sky", description: "Sky blue accent" },
  { name: "Blue", value: "blue", description: "Classic blue accent" },
  { name: "Indigo", value: "indigo", description: "Deep indigo accent" },
  { name: "Violet", value: "violet", description: "Purple violet accent" },
  { name: "Purple", value: "purple", description: "Royal purple accent" },
  { name: "Fuchsia", value: "fuchsia", description: "Bright fuchsia accent" },
  { name: "Pink", value: "pink", description: "Playful pink accent" },
  { name: "Rose", value: "rose", description: "Elegant rose accent" },
]

export function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = React.useState("default")

  React.useEffect(() => {
    // Get current theme from localStorage or document class
    const savedTheme = localStorage.getItem("finflow-theme") || "default"
    setCurrentTheme(savedTheme)
  }, [])

  const applyTheme = (theme: string) => {
    // Remove all existing theme classes
    THEMES.forEach(({ value }) => {
      document.documentElement.classList.remove(`theme-${value}`)
    })

    // Apply new theme class (except for black which is the default)
    if (theme !== "black") {
      document.documentElement.classList.add(`theme-${theme}`)
    }

    // Save to localStorage
    localStorage.setItem("finflow-theme", theme)
    setCurrentTheme(theme)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Choose your preferred color scheme for the interface
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {THEMES.map((theme) => (
            <button
              key={theme.value}
              onClick={() => applyTheme(theme.value)}
              className={cn(
                "group flex flex-col gap-2 rounded-lg border-2 p-3 text-left transition-colors hover:bg-muted/50",
                currentTheme === theme.value
                  ? "border-primary bg-muted/50"
                  : "border-muted hover:border-muted-foreground/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{theme.name}</div>
                {currentTheme === theme.value && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {theme.description}
              </div>
              <div className="flex h-6 gap-1 overflow-hidden rounded">
                <div className="h-full flex-1 bg-zinc-900" />
                <div
                  className={cn(
                    "h-full flex-1",
                    theme.value === "default" && "bg-white",
                    theme.value === "zinc" && "bg-zinc-500",
                    theme.value === "red" && "bg-red-500",
                    theme.value === "orange" && "bg-orange-500",
                    theme.value === "amber" && "bg-amber-500",
                    theme.value === "yellow" && "bg-yellow-500",
                    theme.value === "lime" && "bg-lime-500",
                    theme.value === "green" && "bg-green-500",
                    theme.value === "emerald" && "bg-emerald-500",
                    theme.value === "teal" && "bg-teal-500",
                    theme.value === "cyan" && "bg-cyan-500",
                    theme.value === "sky" && "bg-sky-500",
                    theme.value === "blue" && "bg-blue-500",
                    theme.value === "indigo" && "bg-indigo-500",
                    theme.value === "violet" && "bg-violet-500",
                    theme.value === "purple" && "bg-purple-500",
                    theme.value === "fuchsia" && "bg-fuchsia-500",
                    theme.value === "pink" && "bg-pink-500",
                    theme.value === "rose" && "bg-rose-500"
                  )}
                />
                <div className="h-full flex-1 bg-zinc-800" />
              </div>
            </button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Your theme preference will be saved and applied across all pages.
        </div>
      </CardContent>
    </Card>
  )
}
