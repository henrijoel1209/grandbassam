import { RevenueCard } from "./revenue-card"

export function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <RevenueCard
        title="Recettes Totales"
        amount={1250000}
        description="Recettes totales collectées ce mois"
      />
      <RevenueCard
        title="Taxes Commerciales"
        amount={450000}
        description="Taxes des commerçants et artisans"
      />
      <RevenueCard
        title="Taxes Publicitaires"
        amount={280000}
        description="Recettes des taxes publicitaires"
      />
      <RevenueCard
        title="Recettes du Marché"
        amount={520000}
        description="Recettes collectées au marché"
      />
    </div>
  )
}