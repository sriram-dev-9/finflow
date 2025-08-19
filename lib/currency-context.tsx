"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Currency = "usd" | "eur" | "gbp" | "cad" | "aud" | "jpy" | "inr"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (amount: number) => string
  getCurrencySymbol: () => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const currencyConfig = {
  usd: { symbol: "$", locale: "en-US", code: "USD" },
  eur: { symbol: "€", locale: "de-DE", code: "EUR" },
  gbp: { symbol: "£", locale: "en-GB", code: "GBP" },
  cad: { symbol: "C$", locale: "en-CA", code: "CAD" },
  aud: { symbol: "A$", locale: "en-AU", code: "AUD" },
  jpy: { symbol: "¥", locale: "ja-JP", code: "JPY" },
  inr: { symbol: "₹", locale: "en-IN", code: "INR" },
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("usd")

  useEffect(() => {
    // Load currency from localStorage on mount
    const savedCurrency = localStorage.getItem("finflow-currency") as Currency
    if (savedCurrency && currencyConfig[savedCurrency]) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("finflow-currency", newCurrency)
  }

  const formatCurrency = (amount: number) => {
    const config = currencyConfig[currency]
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
    }).format(amount)
  }

  const getCurrencySymbol = () => {
    return currencyConfig[currency].symbol
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
