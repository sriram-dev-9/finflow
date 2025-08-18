"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  Cell,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer 
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PiggyBank, 
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Edit3,
  AlertCircle,
  CheckCircle,
  Clock,
  Wallet,
  Home,
  Car,
  ShoppingCart,
  Coffee,
  Utensils,
  Zap,
  Gamepad2,
  Heart,
  MoreHorizontal
} from "lucide-react"

// Personal Finance Data
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
  { category: "Housing", amount: 1200, budget: 1300, color: "#8b5cf6", percentage: 30 },
  { category: "Food & Dining", amount: 650, budget: 700, color: "#06b6d4", percentage: 16 },
  { category: "Transportation", amount: 450, budget: 500, color: "#f59e0b", percentage: 11 },
  { category: "Shopping", amount: 380, budget: 400, color: "#10b981", percentage: 10 },
  { category: "Entertainment", amount: 320, budget: 350, color: "#f97316", percentage: 8 },
  { category: "Utilities", amount: 280, budget: 300, color: "#ef4444", percentage: 7 },
  { category: "Healthcare", amount: 200, budget: 250, color: "#84cc16", percentage: 5 },
  { category: "Others", amount: 470, budget: 550, color: "#64748b", percentage: 12 },
]

const financialGoals = [
  { 
    goal: "Emergency Fund", 
    current: 8500, 
    target: 15000, 
    color: "#8b5cf6", 
    deadline: "Dec 2025",
    priority: "High"
  },
  { 
    goal: "Vacation Fund", 
    current: 2800, 
    target: 5000, 
    color: "#06b6d4", 
    deadline: "Jun 2025",
    priority: "Medium"
  },
  { 
    goal: "New Car", 
    current: 12000, 
    target: 25000, 
    color: "#f59e0b", 
    deadline: "Dec 2026",
    priority: "Medium"
  },
  { 
    goal: "House Down Payment", 
    current: 35000, 
    target: 80000, 
    color: "#10b981", 
    deadline: "Dec 2027",
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
  isOverBudget: cat.amount > cat.budget
}))

const chartConfig = {
  income: { label: "Income", color: "#10b981" },
  expenses: { label: "Expenses", color: "#ef4444" },
  savings: { label: "Savings", color: "#8b5cf6" },
  netWorth: { label: "Net Worth", color: "#06b6d4" }
}

export default function PersonalFinanceDashboard() {
  const totalBalance = accountBalances.reduce((sum, account) => 
    account.type !== 'credit' ? sum + account.balance : sum + account.balance, 0
  )
  const monthlyIncome = monthlyFinancials[monthlyFinancials.length - 1].income
  const monthlyExpenses = monthlyFinancials[monthlyFinancials.length - 1].expenses
  const totalSavings = accountBalances.find(acc => acc.type === 'savings')?.balance || 0
  const netWorth = monthlyFinancials[monthlyFinancials.length - 1].netWorth

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div
        className="absolute right-0 top-0 h-1/2 w-1/2"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(155, 135, 245, 0.15) 0%, rgba(13, 10, 25, 0) 60%)",
        }}
      />
      <div
        className="absolute left-0 top-0 h-1/2 w-1/2 -scale-x-100"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(155, 135, 245, 0.15) 0%, rgba(13, 10, 25, 0) 60%)",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Personal Finance Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
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

        {/* Account Balances, Bills, and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Account Balances */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-500" />
                Account Balances
              </CardTitle>
              <CardDescription>Your current account overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accountBalances.map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-slate-700/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        account.type === 'checking' ? 'bg-blue-500' :
                        account.type === 'savings' ? 'bg-green-500' :
                        account.type === 'investment' ? 'bg-purple-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{account.account}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          {account.change > 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                          )}
                          ${Math.abs(account.change)} this month
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${
                      account.balance < 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'
                    }`}>
                      ${account.balance.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Bills */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Upcoming Bills
              </CardTitle>
              <CardDescription>Bills due in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBills.map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-slate-700/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        bill.priority === 'high' ? 'bg-red-500' :
                        bill.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{bill.name}</p>
                        <p className="text-xs text-gray-600">Due {bill.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${bill.amount}</p>
                      <Badge variant={bill.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {bill.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>Manage your finances quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Income
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Target className="h-4 w-4 mr-2" />
                  Set Goal
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 - Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expenses Trend */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Income vs Expenses Trend
              </CardTitle>
              <CardDescription>Monthly financial flow over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <AreaChart data={monthlyFinancials}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stackId="2"
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Spending by Category
              </CardTitle>
              <CardDescription>Where your money goes this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ category, percentage }: any) => `${category} ${percentage}%`}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress & Financial Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Budget Progress */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                Budget Progress
              </CardTitle>
              <CardDescription>Track your spending against budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetProgress.map((budget, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{budget.category}</span>
                      <span className="text-sm text-gray-600">
                        ${budget.spent} / ${budget.budget}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          budget.isOverBudget ? 'bg-red-500' : ''
                        }`}
                        style={{ 
                          width: `${Math.min(budget.percentage, 100)}%`,
                          backgroundColor: budget.isOverBudget ? '#ef4444' : budget.color 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={budget.isOverBudget ? 'text-red-500' : 'text-gray-500'}>
                        {budget.percentage.toFixed(1)}% used
                      </span>
                      <span className="text-gray-500">
                        ${budget.remaining} remaining
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Goals */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Financial Goals Progress
              </CardTitle>
              <CardDescription>Track your progress toward financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialGoals.map((goal, index) => {
                  const progress = (goal.current / goal.target) * 100
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{goal.goal}</span>
                          <Badge variant={goal.priority === 'High' ? 'destructive' : 'secondary'} className="ml-2 text-xs">
                            {goal.priority}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600">
                          ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: goal.color 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          {progress.toFixed(1)}% complete
                        </span>
                        <span className="text-gray-500">
                          Due {goal.deadline}
                        </span>
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
              <Calendar className="h-5 w-5 text-blue-500" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest financial activity - click to edit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-700/40 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex gap-2 text-sm text-gray-600">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.account}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`font-bold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                    <Edit3 className="h-4 w-4 text-gray-400 hover:text-gray-600" />
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
