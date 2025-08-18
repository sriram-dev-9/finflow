import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import data from "../dashboard/data.json"
import { AnalyticsKPIs, FinanceChartsGrid } from "@/components/analytics/finance-charts"

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
						<div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
							<div>
								<h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
								<p className="text-muted-foreground">
									Financial performance overview & detailed breakdowns
								</p>
							</div>
							<AnalyticsKPIs data={data as any} />
							<FinanceChartsGrid />
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}