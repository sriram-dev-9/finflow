"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { IconDownload, IconFileSpreadsheet, IconChartLine, IconPigMoney } from "@tabler/icons-react"
import { getDashboardStats } from "@/lib/database"
import { DashboardStats } from "@/lib/types"
import { useCurrency } from "@/lib/currency-context"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const { formatCurrency } = useCurrency()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const generateIncomeStatement = async () => {
    if (!stats) return
    
    setGeneratingReport('income')
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const reportData = `
INCOME STATEMENT
Generated on: ${formatDate(new Date())}
Period: Current Month

REVENUE:
Monthly Income: ${formatCurrency(stats.monthlyIncome)}
Other Income: ${formatCurrency(0)}
Total Income: ${formatCurrency(stats.monthlyIncome)}

EXPENSES:
Monthly Expenses: ${formatCurrency(stats.monthlyExpenses)}
Total Expenses: ${formatCurrency(stats.monthlyExpenses)}

NET INCOME: ${formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
Savings Rate: ${stats.savingsRate.toFixed(1)}%

GROWTH METRICS:
Net Worth Growth: ${stats.netWorthGrowth.toFixed(1)}%
Income Growth: ${stats.incomeGrowth.toFixed(1)}%
Expense Growth: ${stats.expenseGrowth.toFixed(1)}%
`
    
    // Download as text file
    const blob = new Blob([reportData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `income-statement-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setGeneratingReport(null)
  }

  const generateCashFlow = async () => {
    if (!stats) return
    
    setGeneratingReport('cashflow')
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const reportData = `
CASH FLOW STATEMENT
Generated on: ${formatDate(new Date())}
Period: Current Month

CASH FLOWS FROM OPERATING ACTIVITIES:
Net Income: ${formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
Monthly Income: ${formatCurrency(stats.monthlyIncome)}
Monthly Expenses: ${formatCurrency(-stats.monthlyExpenses)}
Net Operating Cash Flow: ${formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}

CASH FLOWS FROM INVESTING ACTIVITIES:
Investment Activity: ${formatCurrency(0)}

CASH FLOWS FROM FINANCING ACTIVITIES:
Financing Activity: ${formatCurrency(0)}

NET CHANGE IN CASH: ${formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
Current Net Worth: ${formatCurrency(stats.netWorth)}

LIQUIDITY ANALYSIS:
Savings Rate: ${stats.savingsRate.toFixed(1)}%
Monthly Surplus: ${formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
`
    
    const blob = new Blob([reportData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cash-flow-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setGeneratingReport(null)
  }

  const generateCategoryAnalysis = async () => {
    if (!stats) return
    
    setGeneratingReport('category')
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const reportData = `
CATEGORY ANALYSIS REPORT
Generated on: ${formatDate(new Date())}
Period: Current Month

INCOME ANALYSIS:
Total Monthly Income: ${formatCurrency(stats.monthlyIncome)}
Primary Income Sources: Job/Salary

EXPENSE BREAKDOWN:
Total Monthly Expenses: ${formatCurrency(stats.monthlyExpenses)}

ESTIMATED CATEGORY BREAKDOWN:
Housing (30%): ${formatCurrency(stats.monthlyExpenses * 0.3)}
Food (15%): ${formatCurrency(stats.monthlyExpenses * 0.15)}
Transportation (15%): ${formatCurrency(stats.monthlyExpenses * 0.15)}
Utilities (10%): ${formatCurrency(stats.monthlyExpenses * 0.1)}
Entertainment (10%): ${formatCurrency(stats.monthlyExpenses * 0.1)}
Healthcare (10%): ${formatCurrency(stats.monthlyExpenses * 0.1)}
Other (10%): ${formatCurrency(stats.monthlyExpenses * 0.1)}

SAVINGS ANALYSIS:
Monthly Savings: ${formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
Savings Rate: ${stats.savingsRate.toFixed(1)}%
Recommended Savings Rate: 20%
Status: ${stats.savingsRate >= 20 ? 'Excellent' : stats.savingsRate >= 10 ? 'Good' : 'Needs Improvement'}

RECOMMENDATIONS:
${stats.savingsRate >= 20 ? '✓ Excellent savings rate - keep it up!' : '• Consider increasing your savings rate to 20%'}
${stats.expenseGrowth <= 0 ? '✓ Good expense control this month' : '• Monitor expense growth'}
${stats.incomeGrowth > 0 ? '✓ Income is growing' : '• Look for opportunities to increase income'}
`
    
    const blob = new Blob([reportData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `category-analysis-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setGeneratingReport(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download financial reports
          </p>
          {stats && (
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline">
                Net Worth: {formatCurrency(stats.netWorth)}
              </Badge>
              <Badge variant="outline">
                Monthly Income: {formatCurrency(stats.monthlyIncome)}
              </Badge>
              <Badge variant="outline">
                Savings Rate: {stats.savingsRate.toFixed(1)}%
              </Badge>
            </div>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <IconFileSpreadsheet className="h-5 w-5 text-blue-600" />
                <CardTitle>Income Statement</CardTitle>
              </div>
              <CardDescription>
                View your income and expenses over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Income:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(stats.monthlyIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Expenses:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(stats.monthlyExpenses)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Net Income:</span>
                    <span className={stats.monthlyIncome - stats.monthlyExpenses > 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
                    </span>
                  </div>
                </div>
              )}
              <Button 
                onClick={generateIncomeStatement} 
                disabled={generatingReport === 'income'}
                className="w-full"
              >
                {generatingReport === 'income' ? (
                  "Generating..."
                ) : (
                  <>
                    <IconDownload className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <IconChartLine className="h-5 w-5 text-green-600" />
                <CardTitle>Cash Flow</CardTitle>
              </div>
              <CardDescription>
                Track money in and out of your accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Operating Cash Flow:</span>
                    <span className="font-medium">
                      {formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Net Worth:</span>
                    <span className="font-medium">
                      {formatCurrency(stats.netWorth)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Growth Rate:</span>
                    <span className={`font-medium ${stats.netWorthGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.netWorthGrowth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
              <Button 
                onClick={generateCashFlow} 
                disabled={generatingReport === 'cashflow'}
                className="w-full"
              >
                {generatingReport === 'cashflow' ? (
                  "Generating..."
                ) : (
                  <>
                    <IconDownload className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <IconPigMoney className="h-5 w-5 text-purple-600" />
                <CardTitle>Category Analysis</CardTitle>
              </div>
              <CardDescription>
                Detailed breakdown by spending categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Savings Rate:</span>
                    <span className="font-medium">
                      {stats.savingsRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Surplus:</span>
                    <span className="font-medium">
                      {formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={stats.savingsRate >= 20 ? "default" : "secondary"} className="text-xs">
                      {stats.savingsRate >= 20 ? 'Excellent' : stats.savingsRate >= 10 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>
              )}
              <Button 
                onClick={generateCategoryAnalysis} 
                disabled={generatingReport === 'category'}
                className="w-full"
              >
                {generatingReport === 'category' ? (
                  "Generating..."
                ) : (
                  <>
                    <IconDownload className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}