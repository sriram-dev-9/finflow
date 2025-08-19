import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconCreditCard } from "@tabler/icons-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your currency preferences
          </p>
        </div>
      </div>
      
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Currency Settings
            </CardTitle>
            <CardDescription>
              Choose your default currency for displaying financial data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                  <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                  <SelectItem value="gbp">GBP - British Pound (£)</SelectItem>
                  <SelectItem value="cad">CAD - Canadian Dollar (C$)</SelectItem>
                  <SelectItem value="aud">AUD - Australian Dollar (A$)</SelectItem>
                  <SelectItem value="jpy">JPY - Japanese Yen (¥)</SelectItem>
                  <SelectItem value="inr">INR - Indian Rupee (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Currency Setting</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
