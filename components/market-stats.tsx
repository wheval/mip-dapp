"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function MarketStats() {
  const stats = [
    { label: "24h Volume", value: "12.45 ETH", change: 5.2, up: true },
    { label: "Floor Price", value: "0.85 ETH", change: 2.3, up: true },
    { label: "Assets Minted", value: "1,245", change: 12.5, up: true },
    { label: "Active Traders", value: "328", change: -3.1, up: false },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Market Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex justify-between items-center"
          >
            <span className="text-muted-foreground">{stat.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{stat.value}</span>
              <Badge variant={stat.up ? "default" : "destructive"} className="text-xs">
                {stat.up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.change}%
              </Badge>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
