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

const AnalyticsContext = createContext<AnalyticsData | null>(null)

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
const incomeExpenseSeries = [
  { date: "2024-01-01", income: 5200, expenses: 4100 },
  { date: "2024-02-01", income: 5250, expenses: 4300 },
  { date: "2024-03-01", income: 5225, expenses: 4150 },
  { date: "2024-04-01", income: 5300, expenses: 4400 },
  { date: "2024-05-01", income: 5350, expenses: 4500 },
  { date: "2024-06-01", income: 5400, expenses: 4600 },
]

// Monthly expenses by category for bar & pie
const categoryExpenseData = [
  { category: "Housing", amount: 1800 },
  { category: "Food", amount: 710 },
  { category: "Transportation", amount: 320 },
  { category: "Bills & Utilities", amount: 275 },
  { category: "Insurance", amount: 400 },
  { category: "Entertainment", amount: 130 },
  { category: "Debt", amount: 350 },
]

// Radar chart compares planned (budget) vs actual for key groups
const budgetVsActual = [
  { segment: "Housing", budget: 1800, actual: 1820 },
  { segment: "Food", budget: 700, actual: 710 },
  { segment: "Transport", budget: 300, actual: 320 },
  { segment: "Bills", budget: 280, actual: 275 },
  { segment: "Insurance", budget: 400, actual: 400 },
  { segment: "Debt", budget: 350, actual: 350 },
]

// Radial chart: payment method share (synthetic count of transactions)
const paymentMethodShare = [
  { method: "Bank", value: 28, fill: "var(--color-bank)" },
  { method: "Credit", value: 22, fill: "var(--color-credit)" },
  { method: "Debit", value: 18, fill: "var(--color-debit)" },
  { method: "AutoPay", value: 16, fill: "var(--color-autopay)" },
  { method: "Other", value: 8, fill: "var(--color-other)" },
]

// Stacked bar: weekly savings vs discretionary spend
const weeklySavingsStack = [
  { week: "W1", savings: 500, discretionary: 320 },
  { week: "W2", savings: 450, discretionary: 380 },
  { week: "W3", savings: 480, discretionary: 360 },
  { week: "W4", savings: 525, discretionary: 410 },
]

/* --------------------------------- Configs -------------------------------- */
const incomeExpenseConfig = {
  income: { label: "Income", color: "hsl(var(--chart-2))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

const netWorthAreaConfig = {
  net: { label: "Net Savings" },
  income: { label: "Income", color: "var(--chart-2)" },
  expenses: { label: "Expenses", color: "var(--chart-1)" },
} satisfies ChartConfig

const categoryConfig = {
  amount: { label: "Amount" },
  Housing: { label: "Housing", color: "var(--chart-1)" },
  Food: { label: "Food", color: "var(--chart-2)" },
  Transportation: { label: "Transport", color: "var(--chart-3)" },
  "Bills & Utilities": { label: "Bills", color: "var(--chart-4)" },
  Insurance: { label: "Insurance", color: "var(--chart-5)" },
  Entertainment: { label: "Fun", color: "var(--chart-2)" },
  Debt: { label: "Debt", color: "var(--chart-3)" },
} satisfies ChartConfig

const budgetActualConfig = {
  budget: { label: "Budget", color: "var(--chart-3)" },
  actual: { label: "Actual", color: "var(--chart-2)" },
} satisfies ChartConfig

const paymentConfig = {
  value: { label: "Transactions" },
  bank: { label: "Bank", color: "var(--chart-1)" },
  credit: { label: "Credit", color: "var(--chart-2)" },
  debit: { label: "Debit", color: "var(--chart-3)" },
  autopay: { label: "AutoPay", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig

const weeklyStackConfig = {
  savings: { label: "Savings", color: "var(--chart-2)" },
  discretionary: { label: "Discretionary", color: "var(--chart-1)" },
} satisfies ChartConfig

/* ------------------------------- Helper Utils ----------------------------- */

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" })
}

/* ----------------------------- Chart Components --------------------------- */

export function IncomeExpensesLine({ data }: { data?: Array<{ date: string; income: number; expenses: number }> }) {
  const contextData = useAnalyticsData()
  // Use context data first, then provided data, then fallback to static data
  const chartData = contextData?.monthlyData?.length ? contextData.monthlyData : 
                   (data && data.length > 0 ? data : incomeExpenseSeries)

  return (
    <Card className="py-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Income vs Expenses</CardTitle>
        <CardDescription>Monthly trend</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={incomeExpenseConfig} className="h-[220px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => new Date(v).toLocaleDateString(undefined,{month:'short'})} />
            <ChartTooltip content={<ChartTooltipContent className="w-[140px]" nameKey="views" />} />
            <Line dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2} dot={false} />
            <Line dataKey="income" type="monotone" stroke="var(--color-income)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
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
                  <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v)=> new Date(v).toLocaleDateString(undefined,{month:'short'})} />
              <ChartTooltip content={<ChartTooltipContent className="w-[150px]" />} />
              <Area dataKey="net" type="natural" stroke="var(--color-income)" fill="url(#fillNet)" />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function CategoryExpensesBar() {
  const contextData = useAnalyticsData()
  const expenseData = contextData?.categoryData?.length ? contextData.categoryData : categoryExpenseData
  
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
  const expenseData = contextData?.categoryData?.length ? contextData.categoryData : categoryExpenseData
  
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
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base">Budget vs Actual</CardTitle>
        <CardDescription>Key segments</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={budgetActualConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={budgetVsActual} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
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
  const id = "payment-radial"
  return (
    <Card className="flex flex-col">
      <ChartStyle id={id} config={paymentConfig} />
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base">Payment Methods</CardTitle>
        <CardDescription>Transaction share</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer id={id} config={paymentConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={paymentMethodShare} innerRadius={30} outerRadius={110}>
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
  return (
    <Card className="py-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Savings vs Spend</CardTitle>
        <CardDescription>Current month</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={weeklyStackConfig} className="h-[220px] w-full">
          <BarChart data={weeklySavingsStack} accessibilityLayer margin={{ left: 8, right: 8 }}>
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
