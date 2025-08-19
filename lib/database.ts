import { supabase } from './supabase'
import { Transaction, Account, DashboardStats, ChartDataPoint } from './types'

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function updateAccount(id: string, updates: Partial<Account>) {
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteAccount(id: string) {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getTransactions(limit?: number): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export async function getTransactionsByDateRange(
  startDate: string, 
  endDate: string
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  // Previous month dates
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  // Get all transactions for current month
  const monthlyTransactions = await getTransactionsByDateRange(
    currentMonthStart.toISOString().split('T')[0],
    currentMonthEnd.toISOString().split('T')[0]
  )
  
  // Get all transactions for previous month
  const prevMonthTransactions = await getTransactionsByDateRange(
    prevMonthStart.toISOString().split('T')[0],
    prevMonthEnd.toISOString().split('T')[0]
  )
  
  // Get all transactions for net worth calculation
  const allTransactions = await getTransactions()
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const prevMonthIncome = prevMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const prevMonthExpenses = prevMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const totalIncome = allTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const totalExpenses = allTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const netWorth = totalIncome - totalExpenses
  const prevNetWorth = prevMonthIncome - prevMonthExpenses
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0
  const prevSavingsRate = prevMonthIncome > 0 ? ((prevMonthIncome - prevMonthExpenses) / prevMonthIncome) * 100 : 0
  
  // Calculate growth percentages
  const netWorthGrowth = prevNetWorth !== 0 ? ((netWorth - prevNetWorth) / Math.abs(prevNetWorth)) * 100 : 0
  const incomeGrowth = prevMonthIncome !== 0 ? ((monthlyIncome - prevMonthIncome) / prevMonthIncome) * 100 : 0
  const expenseGrowth = prevMonthExpenses !== 0 ? ((monthlyExpenses - prevMonthExpenses) / prevMonthExpenses) * 100 : 0
  const savingsGrowth = prevSavingsRate !== 0 ? ((savingsRate - prevSavingsRate) / Math.abs(prevSavingsRate)) * 100 : 0
  
  return {
    totalIncome,
    totalExpenses,
    netWorth,
    savingsRate,
    monthlyIncome,
    monthlyExpenses,
    netWorthGrowth,
    incomeGrowth,
    expenseGrowth,
    savingsGrowth
  }
}

export async function getChartData(days: number = 90): Promise<ChartDataPoint[]> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const transactions = await getTransactionsByDateRange(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  )
  
  // Group transactions by date
  const dataMap = new Map<string, { income: number; expenses: number }>()
  
  // Initialize all dates in range with 0 values
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    dataMap.set(dateStr, { income: 0, expenses: 0 })
  }
  
  // Aggregate transactions by date
  transactions.forEach(transaction => {
    const date = transaction.date
    const existing = dataMap.get(date) || { income: 0, expenses: 0 }
    
    if (transaction.type === 'income') {
      existing.income += Number(transaction.amount)
    } else {
      existing.expenses += Number(transaction.amount)
    }
    
    dataMap.set(date, existing)
  })
  
  // Convert to array and calculate running balance
  let runningBalance = 0
  const chartData: ChartDataPoint[] = []
  
  for (const [date, values] of dataMap) {
    runningBalance += values.income - values.expenses
    chartData.push({
      date,
      income: values.income,
      expenses: values.expenses,
      balance: runningBalance
    })
  }
  
  return chartData
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: user.id
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function createAccount(name: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('accounts')
    .insert({
      name,
      user_id: user.id
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getTransactionsByCategory(): Promise<Array<{
  category: string;
  amount: number;
  count: number;
  type: 'income' | 'expense';
}>> {
  const { data, error } = await supabase
    .from('transactions')
    .select('category, amount, type')
  
  if (error) throw error
  
  const categoryMap = new Map()
  
  data?.forEach(transaction => {
    const key = `${transaction.category}-${transaction.type}`
    if (categoryMap.has(key)) {
      const existing = categoryMap.get(key)
      existing.amount += Math.abs(transaction.amount)
      existing.count += 1
    } else {
      categoryMap.set(key, {
        category: transaction.category,
        amount: Math.abs(transaction.amount),
        count: 1,
        type: transaction.type
      })
    }
  })
  
  return Array.from(categoryMap.values())
}

export async function getMonthlyTrends(): Promise<Array<{
  month: string;
  income: number;
  expenses: number;
  net: number;
}>> {
  const { data, error } = await supabase
    .from('transactions')
    .select('date, amount, type')
    .order('date', { ascending: true })
  
  if (error) throw error
  
  const monthlyMap = new Map()
  
  data?.forEach(transaction => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthKey,
        income: 0,
        expenses: 0,
        net: 0
      })
    }
    
    const monthData = monthlyMap.get(monthKey)
    const amount = Math.abs(transaction.amount)
    
    if (transaction.type === 'income') {
      monthData.income += amount
    } else {
      monthData.expenses += amount
    }
    
    monthData.net = monthData.income - monthData.expenses
  })
  
  return Array.from(monthlyMap.values()).slice(-6) // Last 6 months
}

// Analytics functions
export async function getAnalyticsData() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Get all transactions for the user
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (error) throw error

  // Process data for analytics
  const monthlyData = processMonthlyData(transactions || [])
  const categoryData = processCategoryData(transactions || [])
  const budgetData = processBudgetData(transactions || [])
  const paymentMethodData = processPaymentMethodData(transactions || [])
  const kpis = calculateKPIs(transactions || [])

  return {
    monthlyData,
    categoryData,
    budgetData,
    paymentMethodData,
    kpis
  }
}

function processMonthlyData(transactions: Transaction[]) {
  const monthlyMap = new Map()
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { date: monthKey, income: 0, expenses: 0 })
    }
    
    const monthData = monthlyMap.get(monthKey)
    if (transaction.type.toLowerCase() === 'income') {
      monthData.income += transaction.amount
    } else {
      monthData.expenses += Math.abs(transaction.amount)
    }
  })
  
  return Array.from(monthlyMap.values()).slice(-6) // Last 6 months
}

function processCategoryData(transactions: Transaction[]) {
  const categoryMap = new Map()
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const amount = Math.abs(transaction.amount)
      if (categoryMap.has(transaction.category)) {
        categoryMap.set(transaction.category, categoryMap.get(transaction.category) + amount)
      } else {
        categoryMap.set(transaction.category, amount)
      }
    })
  
  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 7) // Top 7 categories
}

function processBudgetData(transactions: Transaction[]) {
  // For now, we'll create mock budget data based on actual spending
  // In a real app, you'd have a budgets table
  const categoryData = processCategoryData(transactions)
  
  return categoryData.map(item => ({
    segment: item.category,
    budget: Math.round(item.amount * 1.1), // 10% buffer
    actual: item.amount
  }))
}

function processPaymentMethodData(transactions: Transaction[]) {
  // Since we don't have payment method in our schema, we'll simulate it
  const methods = ['Card', 'Bank Transfer', 'Cash', 'Digital Wallet']
  const total = transactions.length
  
  return methods.map((method, index) => ({
    method,
    count: Math.floor(total / 4) + (index === 0 ? total % 4 : 0),
    percentage: Math.round((100 / 4) + (index === 0 ? (total % 4) * 25 / total : 0))
  }))
}

function calculateKPIs(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0
  
  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate
  }
}
