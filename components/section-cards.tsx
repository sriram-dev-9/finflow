"use client"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getDashboardStats } from "@/lib/database"
import { DashboardStats } from "@/lib/types"
import { FinancialInsight } from "@/lib/ai-insights"
import { useCurrency } from "@/lib/currency-context"

function formatPercentage(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [insights, setInsights] = useState<FinancialInsight[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { formatCurrency } = useCurrency()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // First get the working stats
        const statsData = await getDashboardStats()
        setStats(statsData)
        
        // Then try to get AI insights using the same stats
        try {
          const response = await fetch('/api/insights', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(statsData)
          })
          if (response.ok) {
            const data = await response.json()
            setInsights(data.insights)
          }
        } catch (aiError) {
          console.log('AI insights failed, using fallback descriptions')
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card col-span-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              {error || 'Failed to load dashboard stats'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Use dynamic growth percentages from the database
  const netWorthGrowth = stats.netWorthGrowth
  const incomeGrowth = stats.incomeGrowth
  const expenseGrowth = stats.expenseGrowth
  const savingsGrowth = stats.savingsGrowth

  // Get AI insights or use fallback descriptions
  const getCardContent = (cardIndex: number, fallbackTitle: string, fallbackDesc: string) => {
    if (insights && insights[cardIndex]) {
      const insight = insights[cardIndex]
      return {
        title: insight.title,
        description: insight.description,
        advice: insight.advice,
        trend: insight.trend
      }
    }
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      advice: fallbackTitle,
      trend: 'neutral' as const
    }
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Net Worth</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.netWorth)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {netWorthGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {formatPercentage(netWorthGrowth)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getCardContent(0, 
              netWorthGrowth > 5 ? 'Excellent financial growth' : netWorthGrowth > 0 ? 'Growing steadily this month' : 'Declined this month',
              netWorthGrowth > 5 ? 'Outstanding progress' : netWorthGrowth > 0 ? 'Building wealth' : 'Focus needed'
            ).title}
            {netWorthGrowth >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {getCardContent(0, '', '').description || (stats.netWorth > 10000 ? 'Strong financial foundation' : stats.netWorth > 0 ? 'Building wealth progressively' : 'Focus on increasing income')}
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Income</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.monthlyIncome)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {incomeGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {formatPercentage(incomeGrowth)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getCardContent(1, 
              incomeGrowth > 10 ? 'Outstanding income boost' : incomeGrowth > 0 ? 'Income increased this month' : 'Income decreased',
              incomeGrowth > 10 ? 'Excellent growth' : incomeGrowth > 0 ? 'Good trend' : 'Needs attention'
            ).title}
            {incomeGrowth >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {getCardContent(1, '', '').description || (stats.monthlyIncome > 5000 ? 'Excellent monthly earnings' : stats.monthlyIncome > 2000 ? 'Good income stream' : 'Building income sources')}
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Expenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.monthlyExpenses)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {expenseGrowth <= 0 ? <IconTrendingDown /> : <IconTrendingUp />}
              {formatPercentage(Math.abs(expenseGrowth))}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getCardContent(2, 
              expenseGrowth < -10 ? 'Excellent cost reduction' : expenseGrowth <= 0 ? 'Spending decreased' : 'Spending increased',
              expenseGrowth < -10 ? 'Great control' : expenseGrowth <= 0 ? 'Good discipline' : 'Monitor closely'
            ).title}
            {expenseGrowth <= 0 ? <IconTrendingDown className="size-4" /> : <IconTrendingUp className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {getCardContent(2, '', '').description || (expenseGrowth <= 0 ? 'Great budget discipline' : expenseGrowth < 15 ? 'Monitor spending patterns' : 'Review budget immediately')}
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Savings Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.savingsRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {savingsGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {formatPercentage(savingsGrowth)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getCardContent(3, 
              savingsGrowth > 20 ? 'Outstanding savings improvement' : savingsGrowth > 0 ? 'Savings rate improved' : 'Savings declined',
              savingsGrowth > 20 ? 'Exceptional progress' : savingsGrowth > 0 ? 'Good improvement' : 'Needs focus'
            ).title}
            {savingsGrowth >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {getCardContent(3, '', '').description || (stats.savingsRate >= 30 ? 'Exceptional financial discipline' : stats.savingsRate >= 20 ? 'Meeting financial goals' : stats.savingsRate >= 10 ? 'On track, aim for 20%+' : 'Focus on reducing expenses')}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
