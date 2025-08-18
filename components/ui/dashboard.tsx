"use client"

import React from "react"
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  PiggyBank,
  Plus,
  Calendar,
  Home,
  Utensils,
  Car,
  ShoppingCart,
  Gamepad2,
  Zap,
  Heart,
  Coffee,
  MoreHorizontal,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis } from "recharts"

// --------------------------------------------------
// Personal Finance Data (static demo data)
// --------------------------------------------------
const accountBalances = [
  { account: "Checking", balance: 4750, type: "checking", change: 250 },
  { account: "Savings", balance: 15800, type: "savings", change: 800 },
  { account: "Investment", balance: 23400, type: "investment", change: 1200 },
  { account: "Credit Card", balance: -1890, type: "credit", change: -150 },
]

const monthlyFinancials = [
  { month: "Jan", income: 5200, expenses: 3800, savings: 1400, netWorth: 42000 },
  { month: "Feb", income: 5200, expenses: 4100, savings: 1100, netWorth: 43100 },
  { month: "Mar", income: 5400, expenses: 4200, savings: 1200, netWorth: 44300 },
  { month: "Apr", income: 5200, expenses: 3900, savings: 1300, netWorth: 45600 },
  { month: "May", income: 5600, expenses: 4300, savings: 1300, netWorth: 46900 },
  { month: "Jun", income: 5200, expenses: 4000, savings: 1200, netWorth: 48100 },
  { month: "Jul", income: 5400, expenses: 4100, savings: 1300, netWorth: 49400 },
  { month: "Aug", income: 5200, expenses: 3950, savings: 1250, netWorth: 50650 },
]

const expenseCategories = [
  { category: "Housing", amount: 1200, budget: 1300, color: "#8b5cf6", icon: Home, percentage: 30 },
  { category: "Food & Dining", amount: 650, budget: 700, color: "#06b6d4", icon: Utensils, percentage: 16 },
  { category: "Transportation", amount: 450, budget: 500, color: "#f59e0b", icon: Car, percentage: 11 },
  { category: "Shopping", amount: 380, budget: 400, color: "#10b981", icon: ShoppingCart, percentage: 10 },
  { category: "Entertainment", amount: 320, budget: 350, color: "#f97316", icon: Gamepad2, percentage: 8 },
  { category: "Utilities", amount: 280, budget: 300, color: "#ef4444", icon: Zap, percentage: 7 },
  { category: "Healthcare", amount: 200, budget: 250, color: "#84cc16", icon: Heart, percentage: 5 },
  { category: "Coffee & Misc", amount: 170, budget: 200, color: "#a855f7", icon: Coffee, percentage: 4 },
  { category: "Others", amount: 300, budget: 350, color: "#64748b", icon: MoreHorizontal, percentage: 8 },
]

const financialGoals = [
  { 
    goal: "Emergency Fund", 
    current: 8500, 
    target: 15000, 
    color: "#8b5cf6", 
    deadline: "Dec 2025",
    monthly: 650,
    priority: "High"
  },
  { 
    goal: "Vacation Fund", 
    current: 2800, 
    target: 5000, 
    color: "#06b6d4", 
    deadline: "Jun 2025",
    monthly: 367,
    priority: "Medium"
  },
  { 
    goal: "New Car", 
    current: 12000, 
    target: 25000, 
    color: "#f59e0b", 
    deadline: "Dec 2026",
    monthly: 650,
    priority: "Medium"
  },
  { 
    goal: "House Down Payment", 
    current: 35000, 
    target: 80000, 
    color: "#10b981", 
    deadline: "Dec 2027",
    monthly: 1250,
    priority: "High"
  },
]

const recentTransactions = [
  { id: 1, description: "Salary Deposit", amount: 5200, type: "income", date: "Aug 15", category: "Salary", account: "Checking" },
  { id: 2, description: "Rent Payment", amount: -1200, type: "expense", date: "Aug 15", category: "Housing", account: "Checking" },
  { id: 3, description: "Grocery Store", amount: -127.89, type: "expense", date: "Aug 14", category: "Food & Dining", account: "Checking" },
  { id: 4, description: "Gas Station", amount: -45.20, type: "expense", date: "Aug 14", category: "Transportation", account: "Credit Card" },
  { id: 5, description: "Netflix Subscription", amount: -15.99, type: "expense", date: "Aug 14", category: "Entertainment", account: "Credit Card" },
  { id: 6, description: "Coffee Shop", amount: -8.50, type: "expense", date: "Aug 13", category: "Coffee & Misc", account: "Credit Card" },
  { id: 7, description: "Freelance Payment", amount: 800, type: "income", date: "Aug 13", category: "Freelance", account: "Checking" },
  { id: 8, description: "Electric Bill", amount: -89.50, type: "expense", date: "Aug 12", category: "Utilities", account: "Checking" },
]

const upcomingBills = [
  { name: "Credit Card Payment", amount: 450, dueDate: "Aug 20", status: "upcoming", priority: "high" },
  { name: "Internet Bill", amount: 79.99, dueDate: "Aug 22", status: "upcoming", priority: "medium" },
  { name: "Phone Bill", amount: 55.00, dueDate: "Aug 25", status: "upcoming", priority: "medium" },
  { name: "Insurance Premium", amount: 185.50, dueDate: "Aug 28", status: "upcoming", priority: "high" },
  { name: "Gym Membership", amount: 29.99, dueDate: "Sep 1", status: "upcoming", priority: "low" },
]

const budgetProgress = expenseCategories.map(cat => ({
  category: cat.category,
  spent: cat.amount,
  budget: cat.budget,
  remaining: cat.budget - cat.amount,
  percentage: (cat.amount / cat.budget) * 100,
  color: cat.color,
  icon: cat.icon,
  isOverBudget: cat.amount > cat.budget
}))

// Derived / chart datasets
const balanceData = monthlyFinancials.map(m => ({
  month: m.month,
  income: m.income,
  expenses: m.expenses,
  savings: m.savings,
  netWorth: m.netWorth
}))

const categorySpending = expenseCategories.map(c => ({
  name: c.category,
  value: c.amount,
  color: c.color
}))

const monthlyGrowth = monthlyFinancials.map((m, i, arr) => {
  if (i === 0) return { month: m.month, growth: 0 }
  const prev = arr[i - 1]
  const growth = ((m.netWorth - prev.netWorth) / prev.netWorth) * 100
  return { month: m.month, growth: +growth.toFixed(2) }
})

const savingsGoals = financialGoals

const chartConfig = {
  income: { label: "Income", color: "#16a34a" },
  expenses: { label: "Expenses", color: "#dc2626" },
  savings: { label: "Savings", color: "#9333ea" },
  netWorth: { label: "Net Worth", color: "#0891b2" },
  growth: { label: "Growth %", color: "#0891b2" }
}

export default function Dashboard() {
  const totalBalance = accountBalances.reduce((sum, account) => 
    account.type !== 'credit' ? sum + account.balance : sum + account.balance, 0
  )
  const monthlyIncome = monthlyFinancials[monthlyFinancials.length - 1].income
  const monthlyExpenses = monthlyFinancials[monthlyFinancials.length - 1].expenses
  const totalSavings = accountBalances.find(acc => acc.type === 'savings')?.balance || 0
  const netWorth = monthlyFinancials[monthlyFinancials.length - 1].netWorth

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Personal Finance Dashboard
              </h1>
              <p className="text-zinc-400">
                Track your money, achieve your goals, and build wealth
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
              <Button className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>

        {/* Key Financial Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${netWorth.toLocaleString()}</div>
        <p className="text-xs text-emerald-100 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +3.2% from last month
              </p>
            </CardContent>
          </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</div>
        <p className="text-xs text-blue-100 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.3% from last month
              </p>
            </CardContent>
          </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <CreditCard className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyExpenses.toLocaleString()}</div>
        <p className="text-xs text-red-100 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -1.2% from last month
              </p>
            </CardContent>
          </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <PiggyBank className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
        <p className="text-xs text-purple-100 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.7% from last month
              </p>
            </CardContent>
          </Card>
        </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income vs Expenses Chart */}
  <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-zinc-300" />
              Income vs Expenses
            </CardTitle>
            <CardDescription>Monthly comparison over the last 8 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" tick={{ fill: '#a1a1aa' }} />
                <YAxis tick={{ fill: '#a1a1aa' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fill="#16a34a"
                  fillOpacity={0.18}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fill="#dc2626"
                  fillOpacity={0.18}
                  activeDot={{ r: 5 }}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Spending Categories */}
  <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
      <Target className="h-5 w-5 text-zinc-300" />
              Spending by Category
            </CardTitle>
            <CardDescription>Where your money goes this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Growth */}
  <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-zinc-300" />
              Monthly Growth Rate
            </CardTitle>
            <CardDescription>Your wealth growth percentage month over month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="growth"
                  stroke="#0891b2"
                  strokeWidth={2}
                  dot={{ fill: "#0891b2", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Savings Goals */}
  <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
      <Target className="h-5 w-5 text-zinc-300" />
              Savings Goals Progress
            </CardTitle>
            <CardDescription>How close you are to achieving your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savingsGoals.map((goal, index) => {
                const progress = (goal.current / goal.target) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{goal.goal}</span>
                      <span className="text-sm text-gray-600">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </span>
                    </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
            className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: goal.color 
                        }}
                      />
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {progress.toFixed(1)}% complete
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
  <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-zinc-300" />
            Recent Transactions
          </CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
























































