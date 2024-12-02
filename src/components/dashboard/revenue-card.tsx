import { Euro } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface RevenueCardProps {
  title: string
  amount: number
  description: string
}

export function RevenueCard({ title, amount, description }: RevenueCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Euro className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}