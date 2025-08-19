"use client"

import * as React from "react"
import { useEffect, useState, useContext, createContext } from "react"
import {
  Bar, BarChart, CartesianGrid, XAxis, LineChart, Line, AreaChart, Area, PieChart, Pie, Label, RadarChart, PolarAngleAxis, PolarGrid, Radar, RadialBarChart, RadialBar,
} from "recharts"
import { TrendingUp } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle, type ChartConfig } from "@/components/ui/chart"

// Context for analytics data
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

export const AnalyticsContext = createContext<AnalyticsData | null>(null)

export function useAnalyticsData() {
  return useContext(AnalyticsContext)
}

/* -------------------------------------------------------------------------- */
/*                                Chart Types                                 */
/* -------------------------------------------------------------------------- */

interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string | null
  date: string
  account_id: string
  created_at: string
}

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

/* -------------------------------------------------------------------------- */
/*                                Shared Data                                 */
/* -------------------------------------------------------------------------- */

// Simple month labels for some charts
const months = ["Jan","Feb","Mar","Apr","May","Jun"]

// Income / Expenses daily-ish sample for line + area (synthetic)
/* --------------------------------- Configs -------------------------------- */
const incomeExpenseConfig = {
  income: {
    label: "Income",
    color: "#22c55e",
  },
  expenses: {
    label: "Expenses",
    color: "#ef4444",
  },
} satisfies ChartConfig

const netWorthAreaConfig = {
  net: { label: "Net Savings" },
  income: { label: "Income", color: "#22c55e" },
  expenses: { label: "Expenses", color: "#ef4444" },
} satisfies ChartConfig

const categoryConfig = {
  amount: { label: "Amount" },
  Housing: { label: "Housing", color: "#3b82f6" },
  Food: { label: "Food", color: "#ef4444" },
  Transportation: { label: "Transport", color: "#f59e0b" },
  "Bills & Utilities": { label: "Bills", color: "#8b5cf6" },
  Insurance: { label: "Insurance", color: "#06b6d4" },
  Entertainment: { label: "Fun", color: "#f97316" },
  Debt: { label: "Debt", color: "#ec4899" },
} satisfies ChartConfig

const budgetActualConfig = {
  budget: { label: "Budget", color: "#64748b" },
  actual: { label: "Actual", color: "#22c55e" },
} satisfies ChartConfig

const paymentConfig = {
  value: { label: "Transactions" },
  bank: { label: "Bank", color: "#3b82f6" },
  credit: { label: "Credit", color: "#ef4444" },
  debit: { label: "Debit", color: "#22c55e" },
  autopay: { label: "AutoPay", color: "#f59e0b" },
  other: { label: "Other", color: "#8b5cf6" },
} satisfies ChartConfig

const weeklyStackConfig = {
  savings: { label: "Savings", color: "#22c55e" },
  discretionary: { label: "Discretionary", color: "#3b82f6" },
} satisfies ChartConfig

/* ------------------------------- Helper Utils ----------------------------- */

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" })
}

/* ----------------------------- Chart Components --------------------------- */

export function IncomeExpensesLine({ data }: { data?: Array<{ date: string; income: number; expenses: number }> }) {
  const contextData = useAnalyticsData()
  // Use context data first, then provided data
  const chartData = contextData?.monthlyData?.length ? contextData.monthlyData : 
                   (data && data.length > 0 ? data : [])

  // Debug logging
  console.log('IncomeExpensesLine - chartData:', chartData)
  console.log('IncomeExpensesLine - contextData:', contextData)

  return (
    <Card className="py-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Income vs Expenses</CardTitle>
        <CardDescription>Monthly trend</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground">
            No transaction data available
          </div>
        ) : (
          <ChartContainer config={incomeExpenseConfig} className="h-[220px] w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                tickFormatter={(v) => new Date(v).toLocaleDateString(undefined,{month:'short'})} 
              />
              <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />} 
              />
              <Line 
                dataKey="expenses" 
                type="monotone" 
                stroke="var(--color-expenses)" 
                strokeWidth={2} 
                dot={false} 
              />
              <Line 
                dataKey="income" 
                type="monotone" 
                stroke="var(--color-income)" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function NetSavingsArea() {
  const contextData = useAnalyticsData()
  
  // derive cumulative savings from context data
  const areaData = contextData?.monthlyData?.map((d, idx) => {
    const slice = contextData.monthlyData.slice(0, idx + 1)
    const net = slice.reduce((acc, cur) => acc + (cur.income - cur.expenses), 0)
    return { ...d, net }
  }) || []
  return (
    <Card className="py-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Cumulative Net Savings</CardTitle>
        <CardDescription>Income minus expenses</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        {areaData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground">
            No transaction data available
          </div>
        ) : (
          <ChartContainer config={netWorthAreaConfig} className="h-[220px] w-full">
            <AreaChart data={areaData} margin={{ left: 8, right: 8 }}>
              <defs>
                <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v)=> new Date(v).toLocaleDateString(undefined,{month:'short'})} />
              <ChartTooltip content={<ChartTooltipContent className="w-[150px]" />} />
              <Area dataKey="net" type="natural" stroke="#22c55e" fill="url(#fillNet)" />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function CategoryExpensesBar() {
  const contextData = useAnalyticsData()
  const expenseData = contextData?.categoryData || []
  
  if (expenseData.length === 0) {
    return (
      <Card className="py-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Expenses by Category</CardTitle>
          <CardDescription>Current month</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <div className="flex items-center justify-center h-[220px] text-muted-foreground">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="py-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Expenses by Category</CardTitle>
        <CardDescription>Current month</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={categoryConfig} className="h-[220px] w-full">
          <BarChart data={expenseData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={6} />
            <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
            <Bar dataKey="amount" fill="var(--color-Housing)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function CategoryExpensesPie() {
  const contextData = useAnalyticsData()
  const expenseData = contextData?.categoryData || []
  
  const total = expenseData.reduce((a,c)=>a+c.amount,0)
  const pieData = expenseData.map(d => ({ name: d.category, value: d.amount, fill: `var(--color-${d.category.replace(/[^A-Za-z]/g,'')})` }))
  const config: ChartConfig = pieData.reduce((acc,cur)=>{ acc[cur.name as keyof ChartConfig] = { label: cur.name }; return acc }, { value: { label: "Value" }} as any)
  const id = "expense-pie"
  
  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Expense Allocation</CardTitle>
          <CardDescription>Category share</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[260px] text-muted-foreground">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="flex flex-col">
      <ChartStyle id={id} config={config} />
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Expense Allocation</CardTitle>
        <CardDescription>Category share</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer id={id} config={config} className="mx-auto aspect-square w-full max-w-[260px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="name" />} />
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
              <Label content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                        {Math.round((pieData[0].value/total)*100)}%
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy||0)+20} className="fill-muted-foreground text-xs">Top Cat.</tspan>
                    </text>
                  )
                }
              }} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function BudgetRadar() {
  const contextData = useAnalyticsData()
  const budgetData = contextData?.budgetData || []
  
  if (budgetData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-base">Budget vs Actual</CardTitle>
          <CardDescription>Key segments</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No budget data available
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base">Budget vs Actual</CardTitle>
        <CardDescription>Key segments</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={budgetActualConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={budgetData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" nameKey="segment" />} />
            <PolarAngleAxis dataKey="segment" tickLine={false} />
            <PolarGrid />
            <Radar dataKey="budget" fill="var(--color-budget)" fillOpacity={0.4} />
            <Radar dataKey="actual" fill="var(--color-actual)" fillOpacity={0.6} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 text-xs">
        <div className="flex items-center gap-1 font-medium"><TrendingUp className="size-3" /> Stable performance</div>
        <div className="text-muted-foreground">Most categories on target</div>
      </CardFooter>
    </Card>
  )
}

export function PaymentMethodsRadial() {
  const contextData = useAnalyticsData()
  const paymentData = contextData?.paymentMethodData || []
  
  // Convert to the format expected by RadialBarChart
  const chartData = paymentData.map((item, index) => ({
    method: item.method,
    value: item.percentage,
    fill: `var(--color-method-${index + 1})`
  }))
  
  const id = "payment-radial"
  
  if (paymentData.length === 0) {
    return (
      <Card className="flex flex-col">
        <ChartStyle id={id} config={paymentConfig} />
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-base">Payment Methods</CardTitle>
          <CardDescription>Transaction share</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No payment data available
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="flex flex-col">
      <ChartStyle id={id} config={paymentConfig} />
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base">Payment Methods</CardTitle>
        <CardDescription>Transaction share</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer id={id} config={paymentConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="method" />} />
            <RadialBar dataKey="value" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 text-xs">
        <div className="flex items-center gap-1 font-medium"><TrendingUp className="size-3" /> Bank transfers lead</div>
        <div className="text-muted-foreground">Diverse payment mix</div>
      </CardFooter>
    </Card>
  )
}

export function WeeklySavingsStacked() {
  const contextData = useAnalyticsData()
  
  // Since we don't have weekly data, we'll show a message or use simplified monthly data
  // In a real implementation, you'd process transactions by weeks
  const hasData = contextData?.monthlyData && contextData.monthlyData.length > 0
  
  if (!hasData) {
    return (
      <Card className="py-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Weekly Savings vs Spend</CardTitle>
          <CardDescription>Current month</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <div className="flex items-center justify-center h-[220px] text-muted-foreground">
            Weekly data not available
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Convert monthly data to a simplified weekly format (just for display)
  const weeklyData = contextData.monthlyData.slice(-4).map((item, index) => ({
    week: `Week ${index + 1}`,
    savings: Math.max(0, item.income - item.expenses),
    discretionary: Math.abs(item.expenses) * 0.3 // Approximate discretionary spending
  }))
  
  return (
    <Card className="py-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Savings vs Spend</CardTitle>
        <CardDescription>Recent months approximation</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={weeklyStackConfig} className="h-[220px] w-full">
          <BarChart data={weeklyData} accessibilityLayer margin={{ left: 8, right: 8 }}>
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <Bar dataKey="savings" stackId="a" fill="var(--color-savings)" radius={[0,0,4,4]} />
            <Bar dataKey="discretionary" stackId="a" fill="var(--color-discretionary)" radius={[4,4,0,0]} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

/* ------------------------------- KPI Component ---------------------------- */

type TransactionData = { id:number; header:string; type:string; target:string }

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

export function AnalyticsKPIs({ data }: { data: AnalyticsData | TransactionData[] | null }) {
  let kpis
  
  if (!data) {
    // Fallback demo data
    kpis = [
      { label: "Total Income", value: "$5,200" },
      { label: "Total Expenses", value: "$4,100" },
      { label: "Net Savings", value: "$1,100" },
      { label: "Savings Rate", value: "21.2%" },
    ]
  } else if (Array.isArray(data)) {
    // Legacy format (TransactionData[])
    const numeric = data.map(t => ({ ...t, value: Number(t.target.replace(/[^0-9.]/g, "")) }))
    const incomeTotal = numeric.filter(t => ["Income","Savings","Investment"].includes(t.type)).reduce((a,c)=>a+c.value,0)
    const expenseTotal = numeric.filter(t => !["Income","Savings","Investment"].includes(t.type)).reduce((a,c)=>a+c.value,0)
    const net = incomeTotal - expenseTotal
    const savingsRate = incomeTotal ? (net / incomeTotal) * 100 : 0
    kpis = [
      { label: "Total Income", value: formatCurrency(incomeTotal) },
      { label: "Total Expenses", value: formatCurrency(expenseTotal) },
      { label: "Net Savings", value: formatCurrency(net) },
      { label: "Savings Rate", value: savingsRate.toFixed(1) + "%" },
    ]
  } else {
    // New analytics format
    kpis = [
      { label: "Total Income", value: formatCurrency(data.kpis.totalIncome) },
      { label: "Total Expenses", value: formatCurrency(data.kpis.totalExpenses) },
      { label: "Net Savings", value: formatCurrency(data.kpis.netSavings) },
      { label: "Savings Rate", value: data.kpis.savingsRate.toFixed(1) + "%" },
    ]
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
      {kpis.map(k => (
        <Card key={k.label} className="py-2">
          <CardHeader className="pb-1">
            <CardDescription>{k.label}</CardDescription>
            <CardTitle className="text-2xl">{k.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

/* --------------------------- Aggregated Export Set ------------------------ */
export function FinanceChartsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <IncomeExpensesLine />
      <NetSavingsArea />
      <CategoryExpensesBar />
      <CategoryExpensesPie />
      <BudgetRadar />
      <PaymentMethodsRadial />
      <WeeklySavingsStacked />
    </div>
  )
}
