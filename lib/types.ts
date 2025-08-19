export interface Account {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description?: string
  date: string
  account_id?: string
  created_at: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  netWorth: number
  savingsRate: number
  monthlyIncome: number
  monthlyExpenses: number
  // Growth percentages compared to previous month
  netWorthGrowth: number
  incomeGrowth: number
  expenseGrowth: number
  savingsGrowth: number
}

export interface ChartDataPoint {
  date: string
  income: number
  expenses: number
  balance: number
}
