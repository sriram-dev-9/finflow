"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconCreditCard,
  IconChartBar,
  IconDashboard,
  IconTarget,
  IconWallet,
  IconSettings,
  IconSearch,
  IconReport,
  IconPigMoney,
  IconTrendingUp,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/lib/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navMainItems = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Transactions", url: "/transactions", icon: IconCreditCard },
  { title: "Analytics", url: "/analytics", icon: IconChartBar },
  { title: "Accounts", url: "/accounts", icon: IconWallet },
  { title: "Goals", url: "/goals", icon: IconTarget },
  { title: "Reports", url: "/reports", icon: IconReport },
]

const navSecondaryItems = [
  { title: "Settings", url: "/settings", icon: IconSettings },
  { title: "Search", url: "#", icon: IconSearch },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Create user data from authenticated user
  const userData = React.useMemo(() => {
    if (!user) {
      return {
        name: "Loading...",
        email: "loading@finflow.com",
        avatar: "/avatars/default.jpg",
      }
    }

    return {
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "FinFlow User",
      email: user.email || "user@finflow.com",
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || "/avatars/default.jpg",
    }
  }, [user])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconWallet className="!size-5" />
                <span className="text-base font-semibold">FinFlow</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
