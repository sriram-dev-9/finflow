import { DevTools } from '@/components/dev-tools'

export default function SetupPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to FinFlow!</h1>
        <p className="text-muted-foreground">
          Get started by seeding some sample data to explore the dashboard features.
        </p>
      </div>
      <DevTools />
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          After seeding data, navigate to the <a href="/dashboard" className="text-primary hover:underline">dashboard</a> to see your financial overview.
        </p>
      </div>
    </div>
  )
}
