"use client"

import { Suspense, useEffect, useState } from "react"
import { AnalyticsKPIs, FinanceChartsGrid, AnalyticsContext } from "@/components/analytics/finance-charts"
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

function AnalyticsContent() {
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
		return (
			<div className="px-4 lg:px-6">
				<div className="grid gap-4 md:grid-cols-4 mb-6">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
					))}
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
					))}
				</div>
			</div>
		)
	}

	if (!analyticsData) {
		return (
			<div className="px-4 lg:px-6">
				<div className="text-center py-12">
					<h3 className="text-lg font-semibold mb-2">No Transaction Data</h3>
					<p className="text-muted-foreground mb-4">
						Add some transactions to see your financial analytics and charts.
					</p>
					<a href="/transactions" className="text-primary hover:underline">
						Go to Transactions →
					</a>
				</div>
			</div>
		)
	}

	return (
		<AnalyticsContext.Provider value={analyticsData}>
			<div className="px-4 lg:px-6">
				<AnalyticsKPIs data={analyticsData} />
				<FinanceChartsGrid />
			</div>
		</AnalyticsContext.Provider>
	)
}

export default function AnalyticsPage() {
	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div className="px-4 lg:px-6">
				<div className="mb-6">
					<h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
					<p className="text-muted-foreground">
						Financial performance overview & detailed breakdowns
					</p>
				</div>
			</div>
			<AnalyticsContent />
		</div>
	)
}