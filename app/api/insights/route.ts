import { NextRequest, NextResponse } from 'next/server'
import { generateFinancialInsights } from '@/lib/ai-insights'
import { getDashboardStats } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get the dashboard stats
    const stats = await getDashboardStats()
    
    // Generate AI insights
    const insights = await generateFinancialInsights(stats)
    
    return NextResponse.json({ insights, stats })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get stats from the request body
    const stats = await request.json()
    
    console.log('AI getting stats:', stats)
    
    // Generate AI insights using the provided stats
    const insights = await generateFinancialInsights(stats)
    
    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
