"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const THEMES = [
  { name: "Black", value: "black", description: "Pure black theme" },
  { name: "Zinc", value: "zinc", description: "Clean and minimal" },
  { name: "Slate", value: "slate", description: "Subtle and sophisticated" },
  { name: "Stone", value: "stone", description: "Warm and natural" },
  { name: "Gray", value: "gray", description: "Balanced neutral" },
  { name: "Neutral", value: "neutral", description: "Modern grayscale" },
  { name: "Red", value: "red", description: "Bold and energetic" },
  { name: "Rose", value: "rose", description: "Elegant and refined" },
  { name: "Orange", value: "orange", description: "Vibrant and warm" },
  { name: "Green", value: "green", description: "Fresh and natural" },
  { name: "Blue", value: "blue", description: "Classic and trustworthy" },
  { name: "Yellow", value: "yellow", description: "Bright and optimistic" },
  { name: "Violet", value: "violet", description: "Creative and unique" },
]

export function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = React.useState("black")

  React.useEffect(() => {
    // Get current theme from localStorage or document class
    const savedTheme = localStorage.getItem("finflow-theme") || "black"
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
                <div
                  className={cn(
                    "h-full flex-1",
                    theme.value === "black" && "bg-zinc-900",
                    theme.value === "zinc" && "bg-zinc-100",
                    theme.value === "slate" && "bg-slate-100",
                    theme.value === "stone" && "bg-stone-100",
                    theme.value === "gray" && "bg-gray-100",
                    theme.value === "neutral" && "bg-neutral-100",
                    theme.value === "red" && "bg-red-50",
                    theme.value === "rose" && "bg-rose-50",
                    theme.value === "orange" && "bg-orange-50",
                    theme.value === "green" && "bg-green-50",
                    theme.value === "blue" && "bg-blue-50",
                    theme.value === "yellow" && "bg-yellow-50",
                    theme.value === "violet" && "bg-violet-50"
                  )}
                />
                <div
                  className={cn(
                    "h-full flex-1",
                    theme.value === "black" && "bg-zinc-800",
                    theme.value === "zinc" && "bg-zinc-200",
                    theme.value === "slate" && "bg-slate-200",
                    theme.value === "stone" && "bg-stone-200",
                    theme.value === "gray" && "bg-gray-200",
                    theme.value === "neutral" && "bg-neutral-200",
                    theme.value === "red" && "bg-red-500",
                    theme.value === "rose" && "bg-rose-500",
                    theme.value === "orange" && "bg-orange-500",
                    theme.value === "green" && "bg-green-500",
                    theme.value === "blue" && "bg-blue-500",
                    theme.value === "yellow" && "bg-yellow-500",
                    theme.value === "violet" && "bg-violet-500"
                  )}
                />
                <div
                  className={cn(
                    "h-full flex-1",
                    theme.value === "black" && "bg-zinc-700",
                    theme.value === "zinc" && "bg-zinc-500",
                    theme.value === "slate" && "bg-slate-500",
                    theme.value === "stone" && "bg-stone-500",
                    theme.value === "gray" && "bg-gray-500",
                    theme.value === "neutral" && "bg-neutral-500",
                    theme.value === "red" && "bg-red-700",
                    theme.value === "rose" && "bg-rose-700",
                    theme.value === "orange" && "bg-orange-700",
                    theme.value === "green" && "bg-green-700",
                    theme.value === "blue" && "bg-blue-700",
                    theme.value === "yellow" && "bg-yellow-700",
                    theme.value === "violet" && "bg-violet-700"
                  )}
                />
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
