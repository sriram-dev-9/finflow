"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive line chart"

const chartData = [
  { date: "2024-01-01", income: 5200, expenses: 3800 },
  { date: "2024-01-02", income: 5200, expenses: 3850 },
  { date: "2024-01-03", income: 5200, expenses: 3900 },
  { date: "2024-01-04", income: 5200, expenses: 3750 },
  { date: "2024-01-05", income: 5200, expenses: 3800 },
  { date: "2024-01-06", income: 5200, expenses: 3820 },
  { date: "2024-01-07", income: 5200, expenses: 3780 },
  { date: "2024-01-08", income: 5200, expenses: 3850 },
  { date: "2024-01-09", income: 5200, expenses: 3900 },
  { date: "2024-01-10", income: 5200, expenses: 3750 },
  { date: "2024-01-11", income: 5200, expenses: 3800 },
  { date: "2024-01-12", income: 5200, expenses: 3820 },
  { date: "2024-01-13", income: 5200, expenses: 3780 },
  { date: "2024-01-14", income: 5200, expenses: 3850 },
  { date: "2024-01-15", income: 5200, expenses: 3900 },
  { date: "2024-01-16", income: 5200, expenses: 3750 },
  { date: "2024-01-17", income: 5200, expenses: 3850 },
  { date: "2024-01-18", income: 5200, expenses: 4100 },
  { date: "2024-01-19", income: 5200, expenses: 3650 },
  { date: "2024-01-20", income: 5200, expenses: 3750 },
  { date: "2024-01-21", income: 5200, expenses: 3800 },
  { date: "2024-01-22", income: 5200, expenses: 3700 },
  { date: "2024-01-23", income: 5200, expenses: 3950 },
  { date: "2024-01-24", income: 5200, expenses: 4050 },
  { date: "2024-01-25", income: 5200, expenses: 3850 },
  { date: "2024-01-26", income: 5200, expenses: 3650 },
  { date: "2024-01-27", income: 5200, expenses: 4150 },
  { date: "2024-01-28", income: 5200, expenses: 3750 },
  { date: "2024-01-29", income: 5200, expenses: 3900 },
  { date: "2024-01-30", income: 5200, expenses: 4200 },
  { date: "2024-02-01", income: 5200, expenses: 3800 },
  { date: "2024-02-02", income: 5200, expenses: 4000 },
  { date: "2024-02-03", income: 5200, expenses: 3700 },
  { date: "2024-02-04", income: 5200, expenses: 4100 },
  { date: "2024-02-05", income: 5200, expenses: 4200 },
  { date: "2024-02-06", income: 5200, expenses: 4300 },
  { date: "2024-02-07", income: 5200, expenses: 3950 },
  { date: "2024-02-08", income: 5200, expenses: 3800 },
  { date: "2024-02-09", income: 5200, expenses: 3750 },
  { date: "2024-02-10", income: 5200, expenses: 4000 },
  { date: "2024-02-11", income: 5200, expenses: 3900 },
  { date: "2024-02-12", income: 5200, expenses: 3850 },
  { date: "2024-02-13", income: 5200, expenses: 3700 },
  { date: "2024-02-14", income: 5200, expenses: 4250 },
  { date: "2024-02-15", income: 5200, expenses: 4100 },
  { date: "2024-02-16", income: 5200, expenses: 4000 },
  { date: "2024-02-17", income: 5200, expenses: 4150 },
  { date: "2024-02-18", income: 5200, expenses: 3950 },
  { date: "2024-02-19", income: 5200, expenses: 3750 },
  { date: "2024-02-20", income: 5200, expenses: 3850 },
  { date: "2024-02-21", income: 5200, expenses: 3650 },
  { date: "2024-02-22", income: 5200, expenses: 3600 },
  { date: "2024-02-23", income: 5200, expenses: 3950 },
  { date: "2024-02-24", income: 5200, expenses: 3850 },
  { date: "2024-02-25", income: 5200, expenses: 3900 },
  { date: "2024-02-26", income: 5200, expenses: 3700 },
  { date: "2024-02-27", income: 5200, expenses: 4200 },
  { date: "2024-02-28", income: 5200, expenses: 3800 },
  { date: "2024-03-01", income: 5200, expenses: 3650 },
  { date: "2024-03-02", income: 5200, expenses: 3950 },
  { date: "2024-03-03", income: 5200, expenses: 3850 },
  { date: "2024-03-04", income: 5200, expenses: 3800 },
  { date: "2024-03-05", income: 5200, expenses: 4100 },
  { date: "2024-03-06", income: 5200, expenses: 3700 },
  { date: "2024-03-06", income: 5200, expenses: 3700 },
  { date: "2024-03-07", income: 5200, expenses: 3950 },
  { date: "2024-03-08", income: 5200, expenses: 4000 },
  { date: "2024-03-09", income: 5200, expenses: 3850 },
  { date: "2024-03-10", income: 5200, expenses: 4200 },
  { date: "2024-03-11", income: 5200, expenses: 3750 },
  { date: "2024-03-12", income: 5200, expenses: 3650 },
  { date: "2024-03-13", income: 5200, expenses: 4150 },
  { date: "2024-03-14", income: 5200, expenses: 3600 },
  { date: "2024-03-15", income: 5200, expenses: 4100 },
]

const chartConfig = {
  cash_flow: {
    label: "Cash Flow",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ChartLineInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-03-15") // Use the end of our data range
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Your cash flow for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months cash flow</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart 
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey="expenses"
              type="monotone"
              stroke="var(--color-expenses)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="income"
              type="monotone"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
