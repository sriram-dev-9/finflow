import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconPlus, IconCreditCard, IconWallet, IconPigMoney, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

const accounts = [
  {
    id: 1,
    name: "Chase Checking",
    type: "Checking",
    balance: 8450.32,
    change: 245.67,
    changePercent: 3.0,
    accountNumber: "****1234",
    institution: "Chase Bank",
  },
  {
    id: 2,
    name: "High Yield Savings",
    type: "Savings",
    balance: 25680.15,
    change: 42.18,
    changePercent: 0.16,
    accountNumber: "****5678",
    institution: "Marcus by Goldman Sachs",
  },
  {
    id: 3,
    name: "Chase Freedom",
    type: "Credit Card",
    balance: -1250.45,
    change: -125.30,
    changePercent: -11.1,
    accountNumber: "****9012",
    institution: "Chase Bank",
    creditLimit: 15000,
  },
  {
    id: 4,
    name: "Emergency Fund",
    type: "Savings",
    balance: 18500.00,
    change: 500.00,
    changePercent: 2.8,
    accountNumber: "****3456",
    institution: "Ally Bank",
  },
  {
    id: 5,
    name: "Investment Account",
    type: "Investment",
    balance: 53650.25,
    change: 1250.75,
    changePercent: 2.4,
    accountNumber: "****7890",
    institution: "Vanguard",
  },
]

const getAccountIcon = (type: string) => {
  switch (type) {
    case "Checking":
      return IconWallet
    case "Savings":
      return IconPigMoney
    case "Credit Card":
      return IconCreditCard
    case "Investment":
      return IconTrendingUp
    default:
      return IconWallet
  }
}

const getAccountTypeColor = (type: string) => {
  switch (type) {
    case "Checking":
      return "default"
    case "Savings":
      return "secondary"
    case "Credit Card":
      return "destructive"
    case "Investment":
      return "default"
    default:
      return "default"
  }
}

export default function AccountsPage() {
  const totalAssets = accounts
    .filter(acc => acc.type !== "Credit Card")
    .reduce((sum, acc) => sum + acc.balance, 0)
  
  const totalLiabilities = accounts
    .filter(acc => acc.type === "Credit Card")
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
  
  const netWorth = totalAssets - totalLiabilities

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-muted-foreground">
                      Manage all your financial accounts in one place
                    </p>
                  </div>
                  <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Account
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                    <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalAssets.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Checking, savings & investments
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                    <IconTrendingDown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalLiabilities.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Credit cards & loans
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${netWorth.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Assets minus liabilities
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{accounts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Connected accounts
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="all">All Accounts</TabsTrigger>
                    <TabsTrigger value="checking">Checking</TabsTrigger>
                    <TabsTrigger value="savings">Savings</TabsTrigger>
                    <TabsTrigger value="credit">Credit Cards</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4">
                      {accounts.map((account) => {
                        const Icon = getAccountIcon(account.type)
                        const isPositiveChange = account.change >= 0
                        
                        return (
                          <Card key={account.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="p-2 bg-muted rounded-lg">
                                    <Icon className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{account.name}</h3>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={getAccountTypeColor(account.type)}>
                                        {account.type}
                                      </Badge>
                                      <span className="text-sm text-muted-foreground">
                                        {account.accountNumber}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {account.institution}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-2xl font-bold">
                                    {account.type === "Credit Card" ? "-" : ""}
                                    ${Math.abs(account.balance).toLocaleString()}
                                  </div>
                                  <div className={`text-sm flex items-center justify-end ${
                                    isPositiveChange ? "text-green-500" : "text-red-500"
                                  }`}>
                                    {isPositiveChange ? (
                                      <IconTrendingUp className="mr-1 h-3 w-3" />
                                    ) : (
                                      <IconTrendingDown className="mr-1 h-3 w-3" />
                                    )}
                                    {isPositiveChange ? "+" : ""}${Math.abs(account.change).toFixed(2)} ({account.changePercent}%)
                                  </div>
                                  {account.type === "Credit Card" && account.creditLimit && (
                                    <p className="text-xs text-muted-foreground">
                                      Limit: ${account.creditLimit.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="checking" className="space-y-4">
                    <div className="grid gap-4">
                      {accounts
                        .filter(account => account.type === "Checking")
                        .map((account) => {
                          const Icon = getAccountIcon(account.type)
                          const isPositiveChange = account.change >= 0
                          
                          return (
                            <Card key={account.id}>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-muted rounded-lg">
                                      <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">{account.name}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {account.institution} • {account.accountNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">
                                      ${account.balance.toLocaleString()}
                                    </div>
                                    <div className={`text-sm flex items-center justify-end ${
                                      isPositiveChange ? "text-green-500" : "text-red-500"
                                    }`}>
                                      {isPositiveChange ? (
                                        <IconTrendingUp className="mr-1 h-3 w-3" />
                                      ) : (
                                        <IconTrendingDown className="mr-1 h-3 w-3" />
                                      )}
                                      {isPositiveChange ? "+" : ""}${Math.abs(account.change).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="savings" className="space-y-4">
                    <div className="grid gap-4">
                      {accounts
                        .filter(account => account.type === "Savings")
                        .map((account) => {
                          const Icon = getAccountIcon(account.type)
                          const isPositiveChange = account.change >= 0
                          
                          return (
                            <Card key={account.id}>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-muted rounded-lg">
                                      <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">{account.name}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {account.institution} • {account.accountNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">
                                      ${account.balance.toLocaleString()}
                                    </div>
                                    <div className={`text-sm flex items-center justify-end ${
                                      isPositiveChange ? "text-green-500" : "text-red-500"
                                    }`}>
                                      {isPositiveChange ? (
                                        <IconTrendingUp className="mr-1 h-3 w-3" />
                                      ) : (
                                        <IconTrendingDown className="mr-1 h-3 w-3" />
                                      )}
                                      {isPositiveChange ? "+" : ""}${Math.abs(account.change).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="credit" className="space-y-4">
                    <div className="grid gap-4">
                      {accounts
                        .filter(account => account.type === "Credit Card")
                        .map((account) => {
                          const Icon = getAccountIcon(account.type)
                          const utilizationPercent = account.creditLimit 
                            ? (Math.abs(account.balance) / account.creditLimit) * 100 
                            : 0
                          
                          return (
                            <Card key={account.id}>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-muted rounded-lg">
                                      <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">{account.name}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {account.institution} • {account.accountNumber}
                                      </p>
                                      {account.creditLimit && (
                                        <p className="text-xs text-muted-foreground">
                                          {utilizationPercent.toFixed(1)}% utilization
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-red-500">
                                      ${Math.abs(account.balance).toLocaleString()}
                                    </div>
                                    {account.creditLimit && (
                                      <p className="text-sm text-muted-foreground">
                                        of ${account.creditLimit.toLocaleString()} limit
                                      </p>
                                    )}
                                  </div>
                                </div>
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
      </SidebarInset>
    </SidebarProvider>
  )
}