import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconPlus, IconAlertTriangle, IconCheckCircle, IconTrendingUp } from "@tabler/icons-react"

const budgetCategories = [
  {
    id: 1,
    name: "Housing",
    budgeted: 1800,
    spent: 1800,
    remaining: 0,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Food & Dining",
    budgeted: 600,
    spent: 485,
    remaining: 115,
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Transportation",
    budgeted: 400,
    spent: 320,
    remaining: 80,
    color: "bg-yellow-500",
  },
  {
    id: 4,
    name: "Utilities",
    budgeted: 200,
    spent: 180,
    remaining: 20,
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Entertainment",
    budgeted: 300,
    spent: 385,
    remaining: -85,
    color: "bg-red-500",
  },
  {
    id: 6,
    name: "Healthcare",
    budgeted: 250,
    spent: 125,
    remaining: 125,
    color: "bg-indigo-500",
  },
  {
    id: 7,
    name: "Shopping",
    budgeted: 400,
    spent: 520,
    remaining: -120,
    color: "bg-pink-500",
  },
  {
    id: 8,
    name: "Savings",
    budgeted: 1000,
    spent: 1000,
    remaining: 0,
    color: "bg-emerald-500",
  },
]

const getBudgetStatus = (spent: number, budgeted: number) => {
  const percentage = (spent / budgeted) * 100
  if (percentage > 100) return { status: "Over Budget", variant: "destructive" as const }
  if (percentage > 80) return { status: "Near Limit", variant: "default" as const }
  return { status: "On Track", variant: "secondary" as const }
}

export default function BudgetsPage() {
  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalRemaining = totalBudgeted - totalSpent
  const overBudgetCategories = budgetCategories.filter(cat => cat.remaining < 0).length

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
                    <p className="text-muted-foreground">
                      Track your spending against your monthly budget
                    </p>
                  </div>
                  <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Monthly budget allocation
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {((totalSpent / totalBudgeted) * 100).toFixed(1)}% of budget used
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${Math.abs(totalRemaining).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {totalRemaining >= 0 ? 'Left to spend' : 'Over budget'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Categories</CardTitle>
                    {overBudgetCategories > 0 ? (
                      <IconAlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <IconCheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overBudgetCategories}</div>
                    <p className="text-xs text-muted-foreground">
                      Over budget this month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4">
                      {budgetCategories.map((category) => {
                        const percentage = Math.min((category.spent / category.budgeted) * 100, 100)
                        const { status, variant } = getBudgetStatus(category.spent, category.budgeted)
                        
                        return (
                          <Card key={category.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                                  <h3 className="font-medium">{category.name}</h3>
                                  <Badge variant={variant}>{status}</Badge>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">
                                    ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                                  </div>
                                  <div className={`text-sm ${category.remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {category.remaining >= 0 ? '$' + category.remaining : '-$' + Math.abs(category.remaining)} remaining
                                  </div>
                                </div>
                              </div>
                              <Progress 
                                value={percentage} 
                                className={`h-2 ${category.remaining < 0 ? '[&>div]:bg-red-500' : ''}`}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>{percentage.toFixed(1)}% used</span>
                                <span>{category.remaining < 0 ? 'Over by ' + Math.abs(category.remaining) : category.remaining + ' left'}</span>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="categories" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {budgetCategories
                        .sort((a, b) => (b.spent / b.budgeted) - (a.spent / a.budgeted))
                        .map((category) => {
                          const percentage = (category.spent / category.budgeted) * 100
                          const { status, variant } = getBudgetStatus(category.spent, category.budgeted)
                          
                          return (
                            <Card key={category.id}>
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                                    {category.name}
                                  </CardTitle>
                                  <Badge variant={variant}>{status}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-2xl font-bold">${category.spent.toLocaleString()}</span>
                                  <span className="text-muted-foreground">of ${category.budgeted.toLocaleString()}</span>
                                </div>
                                <Progress value={Math.min(percentage, 100)} className="h-2" />
                                <div className="flex justify-between text-sm">
                                  <span>{percentage.toFixed(1)}% used</span>
                                  <span className={category.remaining >= 0 ? 'text-green-500' : 'text-red-500'}>
                                    {category.remaining >= 0 ? '+' : ''}${category.remaining}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="trends" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Budget Performance Trends</CardTitle>
                        <CardDescription>
                          How your spending compares to budget over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                            <div>Month</div>
                            <div>Budget vs Actual</div>
                            <div>Variance</div>
                          </div>
                          <div className="space-y-3">
                            {['January', 'February', 'March', 'April', 'May', 'June'].map((month, index) => {
                              const budgetAmount = 4950
                              const actualAmount = [4800, 5100, 4750, 5200, 4900, 5015][index]
                              const variance = actualAmount - budgetAmount
                              const isOver = variance > 0
                              
                              return (
                                <div key={month} className="grid grid-cols-3 gap-4 items-center py-2 border-b">
                                  <div>{month}</div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${isOver ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{width: `${Math.min((actualAmount / budgetAmount) * 100, 100)}%`}}
                                      ></div>
                                    </div>
                                    <span className="text-sm">${actualAmount}</span>
                                  </div>
                                  <div className={`text-sm ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                                    {isOver ? '+' : ''}${variance}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}