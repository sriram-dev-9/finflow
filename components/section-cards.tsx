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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function formatPercentage(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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

  // Calculate growth percentages (simplified - in a real app you'd compare to previous period)
  const netWorthGrowth = 3.2 // You could calculate this by comparing to previous month
  const incomeGrowth = 2.3
  const expenseGrowth = -1.2
  const savingsGrowth = 4.1

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
            {netWorthGrowth >= 0 ? 'Growing steadily this month' : 'Declined this month'} 
            {netWorthGrowth >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Total income minus expenses
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
            {incomeGrowth >= 0 ? 'Income increased this month' : 'Income decreased this month'} 
            {incomeGrowth >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Current month earnings
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
            {expenseGrowth <= 0 ? 'Spending decreased' : 'Spending increased'} 
            {expenseGrowth <= 0 ? <IconTrendingDown className="size-4" /> : <IconTrendingUp className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {expenseGrowth <= 0 ? 'Good budget control' : 'Review spending habits'}
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
            {stats.savingsRate >= 20 ? 'Excellent savings progress' : stats.savingsRate >= 10 ? 'Good savings rate' : 'Consider saving more'} 
            {stats.savingsRate >= 20 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {stats.savingsRate >= 20 ? 'Above recommended 20%' : stats.savingsRate >= 10 ? 'Target 20% savings rate' : 'Recommended: 20%+'}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
