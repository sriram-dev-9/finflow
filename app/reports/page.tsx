export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download financial reports
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Income Statement</h3>
            <p className="text-muted-foreground mb-4">
              View your income and expenses over time
            </p>
            <button className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2">
              Generate Report
            </button>
          </div>
          
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Cash Flow</h3>
            <p className="text-muted-foreground mb-4">
              Track money in and out of your accounts
            </p>
            <button className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2">
              Generate Report
            </button>
          </div>
          
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Category Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Detailed breakdown by spending categories
            </p>
            <button className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}