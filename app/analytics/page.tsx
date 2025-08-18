import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ChartLineInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const expenseData = [
    { category: "Housing", amount: 1800, color: "#8884d8" },
    { category: "Food", amount: 630, color: "#82ca9d" },
    { category: "Transportation", amount: 320, color: "#ffc658" },
    { category: "Bills", amount: 275, color: "#ff7300" },
    { category: "Entertainment", amount: 180, color: "#00ff00" },
    { category: "Health", amount: 325, color: "#ff0000" },
]

const monthlyTrends = [
    { month: "Jan", income: 5200, expenses: 3950, savings: 1250 },
    { month: "Feb", income: 5200, expenses: 4100, savings: 1100 },
    { month: "Mar", income: 5650, expenses: 3850, savings: 1800 },
    { month: "Apr", income: 5200, expenses: 4200, savings: 1000 },
    { month: "May", income: 5200, expenses: 3750, savings: 1450 },
    { month: "Jun", income: 5850, expenses: 3950, savings: 1900 },
]

const chartConfig = {
    income: { label: "Income", color: "hsl(var(--chart-1))" },
    expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
    savings: { label: "Savings", color: "hsl(var(--chart-3))" },
}

export default function AnalyticsPage() {
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
                                <div className="mb-6">
                                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                                    <p className="text-muted-foreground">
                                        Deep insights into your financial patterns and trends
                                    </p>
                                </div>
                            </div>

                            <SectionCards />

                            <div className="px-4 lg:px-6">
                                <Tabs defaultValue="overview" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
                                        <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-4">
                                        <ChartLineInteractive />
                                    </TabsContent>

                                    <TabsContent value="expenses" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Expense Categories</CardTitle>
                                                <CardDescription>
                                                    Breakdown of your spending by category this month
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ChartContainer config={chartConfig} className="h-[400px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={expenseData}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                                                outerRadius={120}
                                                                fill="#8884d8"
                                                                dataKey="amount"
                                                            >
                                                                {expenseData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))}
                                                            </Pie>
                                                            <ChartTooltip content={<ChartTooltipContent />} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </ChartContainer>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="trends" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Monthly Financial Trends</CardTitle>
                                                <CardDescription>
                                                    Track your income, expenses, and savings over time
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ChartContainer config={chartConfig} className="h-[400px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={monthlyTrends}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="month" />
                                                            <YAxis />
                                                            <ChartTooltip content={<ChartTooltipContent />} />
                                                            <Bar dataKey="income" fill="var(--color-income)" />
                                                            <Bar dataKey="expenses" fill="var(--color-expenses)" />
                                                            <Bar dataKey="savings" fill="var(--color-savings)" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </ChartContainer>
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