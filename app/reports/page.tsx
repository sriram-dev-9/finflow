import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconDownload, IconFileChart, IconTrendingUp, IconTrendingDown, IconCalendar } from "@tabler/icons-react"

const reports = [
  {
    id: 1,
    title: "Monthly Income Statement",
    description: "Detailed breakdown of income and expenses",
    period: "June 2025",
    type: "Income Statement",
    lastGenerated: "2025-06-30",
  },
  {
    id: 2,
    title: "Net Worth Report",
    description: "Assets, liabilities, and net worth analysis",
    period: "Q2 2025",
    type: "Net Worth",
    lastGenerated: "2025-06-30",
  },
  {
    id: 3,
    title: "Expense Analysis",
    description: "Category-wise expense breakdown and trends",
    period: "Last 6 months",
    type: "Expense Report",
    lastGenerated: "2025-06-30",
  },
  {
    id: 4,
    title: "Investment Performance",
    description: "Portfolio performance and allocation analysis",
    period: "YTD 2025",
    type: "Investment Report",
    lastGenerated: "2025-06-30",
  },
]

const quickStats = [
  {
    title: "Total Income (June)",
    value: "$5,650",
    change: "+8.7%",
    isPositive: true,
  },
  {
    title: "Total Expenses (June)",
    value: "$3,950",
    change: "-2.1%",
    isPositive: true,
  },
  {
    title: "Net Savings (June)",
    value: "$1,700",
    change: "+42.3%",
    isPositive: true,
  },
  {
    title: "Investment Growth (YTD)",
    value: "$5,650",
    change: "+12.4%",
    isPositive: true,
  },
]

export default function ReportsPage() {
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
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground">
                      Generate and download detailed financial reports
                    </p>
                  </div>
                  <Button>
                    <IconFileChart className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
                {quickStats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      {stat.isPositive ? (
                        <IconTrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <IconTrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className={`text-xs ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from last period
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="available" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="available">Available Reports</TabsTrigger>
                    <TabsTrigger value="custom">Custom Reports</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="available" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {reports.map((report) => (
                        <Card key={report.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{report.title}</CardTitle>
                              <IconFileChart className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <CardDescription>{report.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Period:</span>
                              <span>{report.period}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Type:</span>
                              <span>{report.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Last Generated:</span>
                              <span className="flex items-center gap-1">
                                <IconCalendar className="h-3 w-3" />
                                {new Date(report.lastGenerated).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <IconDownload className="mr-2 h-3 w-3" />
                                Download
                              </Button>
                              <Button size="sm" className="flex-1">
                                Generate New
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="custom" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create Custom Report</CardTitle>
                        <CardDescription>
                          Build a custom report with specific date ranges and categories
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Report Type</label>
                            <select className="w-full p-2 border rounded-md">
                              <option>Income Statement</option>
                              <option>Expense Report</option>
                              <option>Net Worth Analysis</option>
                              <option>Cash Flow Statement</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Date Range</label>
                            <select className="w-full p-2 border rounded-md">
                              <option>Last 30 days</option>
                              <option>Last 3 months</option>
                              <option>Last 6 months</option>
                              <option>Year to date</option>
                              <option>Custom range</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Categories (Optional)</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Housing', 'Food', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping'].map((category) => (
                              <label key={category} className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{category}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full">
                          <IconFileChart className="mr-2 h-4 w-4" />
                          Generate Custom Report
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="scheduled" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Scheduled Reports</CardTitle>
                        <CardDescription>
                          Automatically generate and email reports on a schedule
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">Monthly Income Statement</h3>
                              <p className="text-sm text-muted-foreground">
                                Generated on the 1st of each month
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-green-500">Active</span>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">Quarterly Net Worth Report</h3>
                              <p className="text-sm text-muted-foreground">
                                Generated every 3 months
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-green-500">Active</span>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            <IconCalendar className="mr-2 h-4 w-4" />
                            Schedule New Report
                          </Button>
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