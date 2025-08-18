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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "FinFlow User",
    email: "user@finflow.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Transactions", url: "/transactions", icon: IconCreditCard },
    { title: "Analytics", url: "/analytics", icon: IconChartBar },
    { title: "Accounts", url: "/accounts", icon: IconWallet },
    { title: "Budgets", url: "/budgets", icon: IconPigMoney },
    { title: "Goals", url: "/goals", icon: IconTarget },
    { title: "Investments", url: "/investments", icon: IconTrendingUp },
    { title: "Reports", url: "/reports", icon: IconReport },
  ],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Search", url: "#", icon: IconSearch },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
  <NavMain items={data.navMain} />
  <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
