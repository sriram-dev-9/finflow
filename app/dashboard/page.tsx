"use client"

import { Suspense, useEffect, useState } from "react"
import { IncomeExpensesLine, AnalyticsContext } from "@/components/analytics/finance-charts"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Skeleton } from "@/components/ui/skeleton"
import { getAnalyticsData } from "@/lib/database"

// Define the interface here for type checking
interface AnalyticsData {
  monthlyData: Array<{ date: string; income: number; expenses: number }>
  categoryData: Array<{ category: string; amount: number }>
  budgetData: Array<{ segment: string; budget: number; actual: number }>
  paymentMethodData: Array<{ method: string; count: number; percentage: number }>
  kpis: {
    totalIncome: number
    totalExpenses: number
    netSavings: number
    savingsRate: number
  }
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] w-full" />
        ))}
      </div>
      <div className="px-4 lg:px-6">
        <Skeleton className="h-[350px] w-full" />
      </div>
      <div className="px-4 lg:px-6">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnalyticsData()
        setAnalyticsData(data)
      } catch (error) {
        console.log('No analytics data available:', error)
        setAnalyticsData(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <IncomeExpensesLine />
        </div>
        <DataTable />
      </div>
    </AnalyticsContext.Provider>
  )
}
