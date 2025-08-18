"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { seedSampleData, clearAllData } from '@/lib/seed'

export function DevTools() {
  const [loading, setLoading] = useState(false)

  const handleSeedData = async () => {
    try {
      setLoading(true)
      await seedSampleData()
      toast.success('Sample data seeded successfully!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to seed data')
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = async () => {
    try {
      setLoading(true)
      await clearAllData()
      toast.success('All data cleared successfully!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to clear data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Development Tools</CardTitle>
        <CardDescription>
          Tools for testing the application with sample data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleSeedData} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Seeding...' : 'Seed Sample Data'}
        </Button>
        <Button 
          onClick={handleClearData} 
          disabled={loading}
          variant="destructive"
          className="w-full"
        >
          {loading ? 'Clearing...' : 'Clear All Data'}
        </Button>
      </CardContent>
    </Card>
  )
}
