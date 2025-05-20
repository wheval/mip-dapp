import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { Collection } from "@/src/lib/types"

interface CollectionStatsProps {
  collection: Collection
  className?: string
}

export default function CollectionStats({ collection, className = "" }: CollectionStatsProps) {
  const stats = [
    { label: "Items", value: collection.assetCount, suffix: "" },
    { label: "Owners", value: collection.ownerCount, suffix: "" },
    { label: "Floor Price", value: collection.floorPrice, suffix: " ETH" },
    {
      label: "Volume",
      value: collection.volume,
      suffix: " ETH",
      change: collection.volumeChange,
      up: collection.volumeChange > 0,
    },
  ]

  return (
    <div className={className}>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <p className="text-2xl font-bold">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                    {stat.suffix}
                  </p>
                  {stat.change !== undefined && (
                    <Badge variant={stat.up ? "default" : "destructive"} className="text-xs">
                      {stat.up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {stat.change}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
