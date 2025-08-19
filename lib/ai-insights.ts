import { GoogleGenerativeAI } from '@google/generative-ai'
import { DashboardStats } from './types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface FinancialInsight {
  title: string
  description: string
  trend: 'positive' | 'negative' | 'neutral'
  advice: string
}

export async function generateFinancialInsights(stats: DashboardStats): Promise<FinancialInsight[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `
You are a professional financial advisor. Analyze these financial statistics and provide 4 concise insights for dashboard cards:

Financial Data:
- Net Worth: $${stats.netWorth}
- Monthly Income: $${stats.monthlyIncome}
- Monthly Expenses: $${stats.monthlyExpenses}
- Savings Rate: ${stats.savingsRate.toFixed(1)}%
- Net Worth Growth: ${stats.netWorthGrowth.toFixed(1)}%
- Income Growth: ${stats.incomeGrowth.toFixed(1)}%
- Expense Growth: ${stats.expenseGrowth.toFixed(1)}%
- Savings Growth: ${stats.savingsGrowth.toFixed(1)}%

Generate exactly 4 insights in this JSON format:
[
  {
    "title": "Brief engaging title (max 4 words)",
    "description": "Short description of current situation (max 6 words)",
    "trend": "positive|negative|neutral",
    "advice": "Actionable advice (max 8 words)"
  }
]

Focus on:
1. Net Worth performance and growth
2. Income trends and stability
3. Spending patterns and control
4. Savings optimization and progress

Keep language encouraging but realistic. Use financial best practices.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0])
      return insights
    }
    
    // Fallback if parsing fails
    return generateFallbackInsights(stats)
    
  } catch (error) {
    console.error('Error generating AI insights:', error)
    return generateFallbackInsights(stats)
  }
}

function generateFallbackInsights(stats: DashboardStats): FinancialInsight[] {
  return [
    {
      title: stats.netWorthGrowth > 0 ? "Growing Wealth" : "Building Foundation",
      description: stats.netWorthGrowth > 5 ? "Excellent financial progress" : stats.netWorthGrowth > 0 ? "Steady wealth building" : "Focus on growth",
      trend: stats.netWorthGrowth > 0 ? 'positive' : 'neutral',
      advice: stats.netWorthGrowth > 0 ? "Continue current strategy" : "Increase income sources"
    },
    {
      title: stats.incomeGrowth > 0 ? "Income Rising" : "Stable Earnings",
      description: stats.incomeGrowth > 10 ? "Outstanding income growth" : stats.incomeGrowth > 0 ? "Good income trend" : "Steady income stream",
      trend: stats.incomeGrowth > 0 ? 'positive' : 'neutral',
      advice: stats.incomeGrowth > 0 ? "Maintain growth momentum" : "Explore new opportunities"
    },
    {
      title: stats.expenseGrowth <= 0 ? "Smart Spending" : "Review Expenses",
      description: stats.expenseGrowth <= -10 ? "Excellent cost control" : stats.expenseGrowth <= 0 ? "Good budget discipline" : "Rising expenses",
      trend: stats.expenseGrowth <= 0 ? 'positive' : 'negative',
      advice: stats.expenseGrowth <= 0 ? "Keep up discipline" : "Trim unnecessary costs"
    },
    {
      title: stats.savingsRate >= 20 ? "Savings Star" : "Build Savings",
      description: stats.savingsRate >= 30 ? "Exceptional savings rate" : stats.savingsRate >= 20 ? "Meeting savings goals" : "Room for improvement",
      trend: stats.savingsRate >= 20 ? 'positive' : 'neutral',
      advice: stats.savingsRate >= 20 ? "Consider investments" : "Aim for 20% rate"
    }
  ]
}
