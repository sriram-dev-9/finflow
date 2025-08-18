import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconTrendingUp, IconTrendingDown, IconPlus } from "@tabler/icons-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const portfolioData = [
  { date: "Jan", value: 45000 },
  { date: "Feb", value: 47200 },
  { date: "Mar", value: 46800 },
  { date: "Apr", value: 49100 },
  { date: "May", value: 51300 },
  { date: "Jun", value: 53650 },
]

const investments = [
  {
    name: "S&P 500 Index Fund",
    symbol: "SPY",
    value: 28500,
    change: 2.4,
    allocation: 53.2,
  },
  {
    name: "Technology ETF",
    symbol: "QQQ",
    value: 12800,
    change: -1.2,
    allocation: 23.9,
  },
  {
    name: "Bonds Fund",
    symbol: "BND",
    value: 8200,
    change: 0.8,
    allocation: 15.3,
  },
  {
    name: "International Fund",
    symbol: "VXUS",
    value: 4150,
    change: 1.6,
    allocation: 7.6,
  },
]

const chartConfig = {
  value: { label: "Portfolio Value", color: "hsl(var(--chart-1))" },
}

export default function InvestmentsPage() {
  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0)
  const totalChange = investments.reduce((sum, inv) => sum + (inv.value * inv.change / 100), 0)
  const totalChangePercent = (totalChange / totalValue) * 100

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
                    <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
                    <p className="text-muted-foreground">
                      Track and manage your investment portfolio
                    </p>
                  </div>
                  <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Investment
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {totalChangePercent >= 0 ? (
                        <IconTrendingUp className="mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <IconTrendingDown className="mr-1 h-3 w-3 text-red-500" />
                      )}
                      <span className={totalChangePercent >= 0 ? "text-green-500" : "text-red-500"}>
                        {totalChangePercent >= 0 ? "+" : ""}{totalChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Contribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1,400</div>
                    <p className="text-xs text-muted-foreground">
                      401k + IRA contributions
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12.4%</div>
                    <p className="text-xs text-muted-foreground">
                      $5,650 gain this year
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">77% Stocks</div>
                    <p className="text-xs text-muted-foreground">
                      23% bonds & alternatives
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="portfolio" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="allocation">Allocation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="portfolio" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Holdings</CardTitle>
                        <CardDescription>
                          Your current investment positions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {investments.map((investment) => (
                            <div key={investment.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{investment.name}</h3>
                                  <Badge variant="outline">{investment.symbol}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {investment.allocation}% of portfolio
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${investment.value.toLocaleString()}</div>
                                <div className={`text-sm flex items-center ${
                                  investment.change >= 0 ? "text-green-500" : "text-red-500"
                                }`}>
                                  {investment.change >= 0 ? (
                                    <IconTrendingUp className="mr-1 h-3 w-3" />
                                  ) : (
                                    <IconTrendingDown className="mr-1 h-3 w-3" />
                                  )}
                                  {investment.change >= 0 ? "+" : ""}{investment.change}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="performance" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Performance</CardTitle>
                        <CardDescription>
                          Track your portfolio value over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig} className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={portfolioData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="var(--color-value)" 
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="allocation" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Asset Allocation</CardTitle>
                        <CardDescription>
                          Recommended vs current allocation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                            <div>Asset Class</div>
                            <div>Current</div>
                            <div>Target</div>
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4 items-center">
                              <div>US Stocks</div>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{width: "53%"}}></div>
                                </div>
                                <span className="text-sm">53%</span>
                              </div>
                              <div>60%</div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 items-center">
                              <div>International</div>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-600 h-2 rounded-full" style={{width: "24%"}}></div>
                                </div>
                                <span className="text-sm">24%</span>
                              </div>
                              <div>20%</div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 items-center">
                              <div>Bonds</div>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: "15%"}}></div>
                                </div>
                                <span className="text-sm">15%</span>
                              </div>
                              <div>15%</div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 items-center">
                              <div>Alternatives</div>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-purple-600 h-2 rounded-full" style={{width: "8%"}}></div>
                                </div>
                                <span className="text-sm">8%</span>
                              </div>
                              <div>5%</div>
                            </div>
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