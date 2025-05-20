"use client"

import { getLiveActivity } from "@/src/lib/mock-data"
import LiveActivityFeed from "@/src/components/live-activity-feed"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useState } from "react"
import { motion } from "framer-motion"

export default function ActivityPage() {
  const allActivity = getLiveActivity()
  const [activeFilter, setActiveFilter] = useState("all")

  const getFilteredActivity = () => {
    switch (activeFilter) {
      case "sales":
        return allActivity.filter((a) => a.type === "sale")
      case "mints":
        return allActivity.filter((a) => a.type === "mint")
      case "listings":
        return allActivity.filter((a) => a.type === "listing")
      case "offers":
        return allActivity.filter((a) => a.type === "offer")
      case "coins":
        return allActivity.filter((a) => a.type === "coin")
      default:
        return allActivity
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Activity</h1>
            <p className="text-muted-foreground mt-1">Track all transactions and events on the platform</p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search by asset, collection or user..." className="pl-10" />
            </div>
            <Select defaultValue="24h">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ActivityFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <LiveActivityFeed activity={getFilteredActivity()} />
      </div>
    </div>
  )
}

function ActivityFilters({
  activeFilter,
  setActiveFilter,
}: { activeFilter: string; setActiveFilter: (id: string) => void }) {
  const filters = [
    { id: "all", label: "All Activity" },
    { id: "sales", label: "Sales" },
    { id: "mints", label: "Mints" },
    { id: "listings", label: "Listings" },
    { id: "offers", label: "Offers" },
    { id: "coins", label: "Coins" },
  ]

  return (
    <motion.div
      className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {filters.map((filter, index) => (
        <motion.div
          key={filter.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Button
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            className="flex items-center whitespace-nowrap"
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}
