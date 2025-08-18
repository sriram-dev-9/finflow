"use client"

import * as React from "react"
import {
  IconCreditCard,
  IconChartBar,
  IconDashboard,
  IconReportMoney,
  IconTarget,
  IconTrendingUp,
  IconWallet,
  IconCoin,
  IconSettings,
  IconHelp,
  IconSearch,
  IconBell,
  IconFileChart,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
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
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: IconCreditCard,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Investments",
      url: "#",
      icon: IconTrendingUp,
    },
    {
      title: "Goals",
      url: "#",
      icon: IconTarget,
    },
  ],
  navClouds: [
    {
      title: "Accounts",
      icon: IconWallet,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Checking",
          url: "#",
        },
        {
          title: "Savings",
          url: "#",
        },
        {
          title: "Credit Cards",
          url: "#",
        },
      ],
    },
    {
      title: "Budgets",
      icon: IconReportMoney,
      url: "#",
      items: [
        {
          title: "Monthly Budget",
          url: "#",
        },
        {
          title: "Budget Categories",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      icon: IconFileChart,
      url: "#",
      items: [
        {
          title: "Income Statement",
          url: "#",
        },
        {
          title: "Expense Report",
          url: "#",
        },
        {
          title: "Net Worth",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Financial Reports",
      url: "#",
      icon: IconFileChart,
    },
    {
      name: "Tax Documents",
      url: "#",
      icon: IconReportMoney,
    },
    {
      name: "Notifications",
      url: "#",
      icon: IconBell,
    },
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
              <a href="/">
                <IconWallet className="!size-5" />
                <span className="text-base font-semibold">FinFlow</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
