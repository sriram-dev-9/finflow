'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { IconTarget, IconPlus, IconEdit, IconTrash, IconCalendar, IconTrendingUp } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const goals = [
  {
    id: 1,
    title: "Emergency Fund",
    description: "Build 6 months of expenses",
    target: 24000,
    current: 18500,
    deadline: "2025-12-31",
    category: "Safety",
    priority: "High",
  },
  {
    id: 2,
    title: "House Down Payment",
    description: "Save for 20% down payment",
    target: 80000,
    current: 32000,
    deadline: "2026-06-30",
    category: "Major Purchase",
    priority: "High",
  },
  {
    id: 3,
    title: "Vacation Fund",
    description: "European vacation for two",
    target: 8000,
    current: 3200,
    deadline: "2025-08-15",
    category: "Lifestyle",
    priority: "Medium",
  },
  {
    id: 4,
    title: "New Car",
    description: "Replace current vehicle",
    target: 35000,
    current: 12000,
    deadline: "2025-10-01",
    category: "Transportation",
    priority: "Medium",
  },
  {
    id: 5,
    title: "Retirement Boost",
    description: "Extra retirement savings",
    target: 50000,
    current: 15000,
    deadline: "2025-12-31",
    category: "Retirement",
    priority: "Low",
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "destructive"
    case "Medium": return "default"
    case "Low": return "secondary"
    default: return "default"
  }
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "bg-green-500"
  if (percentage >= 50) return "bg-yellow-500"
  return "bg-blue-500"
}

export default function GoalsPage() {
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0)
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0)
  const overallProgress = (totalCurrent / totalTarget) * 100

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
                <p className="text-muted-foreground">
                  Track progress towards your financial objectives
                </p>
              </div>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </div>
          </div>
              
              <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
                    <IconTarget className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{goals.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Active financial goals
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Target</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalTarget.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Combined goal amount
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalCurrent.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {overallProgress.toFixed(1)}% of total goals
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">On Track</CardTitle>
                    <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3 of 5</div>
                    <p className="text-xs text-muted-foreground">
                      Goals meeting timeline
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="all">All Goals</TabsTrigger>
                    <TabsTrigger value="high">High Priority</TabsTrigger>
                    <TabsTrigger value="progress">By Progress</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {goals.map((goal) => {
                        const progress = (goal.current / goal.target) * 100
                        const remaining = goal.target - goal.current
                        const daysUntilDeadline = Math.ceil(
                          (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        )
                        
                        return (
                          <Card key={goal.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{goal.title}</CardTitle>
                                <Badge variant={getPriorityColor(goal.priority)}>
                                  {goal.priority}
                                </Badge>
                              </div>
                              <CardDescription>{goal.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>${goal.current.toLocaleString()}</span>
                                  <span>${goal.target.toLocaleString()}</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{progress.toFixed(1)}% complete</span>
                                  <span>${remaining.toLocaleString()} remaining</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1">
                                  <IconCalendar className="h-3 w-3" />
                                  <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                                </div>
                                <span className={`${daysUntilDeadline < 90 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                  {daysUntilDeadline} days left
                                </span>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  Edit Goal
                                </Button>
                                <Button size="sm" className="flex-1">
                                  Add Funds
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="high" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {goals
                        .filter(goal => goal.priority === "High")
                        .map((goal) => {
                          const progress = (goal.current / goal.target) * 100
                          const remaining = goal.target - goal.current
                          
                          return (
                            <Card key={goal.id}>
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                                  <Badge variant="destructive">High Priority</Badge>
                                </div>
                                <CardDescription>{goal.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>${goal.current.toLocaleString()}</span>
                                    <span>${goal.target.toLocaleString()}</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{progress.toFixed(1)}% complete</span>
                                    <span>${remaining.toLocaleString()} remaining</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="progress" className="space-y-4">
                    <div className="grid gap-4">
                      {goals
                        .sort((a, b) => (b.current / b.target) - (a.current / a.target))
                        .map((goal) => {
                          const progress = (goal.current / goal.target) * 100
                          
                          return (
                            <Card key={goal.id}>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    <h3 className="font-medium">{goal.title}</h3>
                                    <p className="text-sm text-muted-foreground">{goal.category}</p>
                                  </div>
                                  <div className="text-right space-y-1">
                                    <div className="font-medium">{progress.toFixed(1)}%</div>
                                    <div className="text-sm text-muted-foreground">
                                      ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <Progress value={progress} className="mt-3 h-2" />
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
  )
}

