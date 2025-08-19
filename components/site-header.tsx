"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconSettings, IconChartBar } from "@tabler/icons-react"

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard"
    case "/transactions":
      return "Transactions"
    case "/analytics":
      return "Analytics"
    case "/investments":
      return "Investments"
    case "/goals":
      return "Goals"
    case "/accounts":
      return "Accounts"
    case "/budgets":
      return "Budgets"
    case "/reports":
      return "Reports"
    case "/settings":
      return "Settings"
    default:
      return "FinFlow"
  }
}

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/analytics">
              <IconChartBar className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <IconSettings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
