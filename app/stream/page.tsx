"use client"

import { getAssets } from "@/lib/mock-data"
import ContentFeed from "@/components/content-feed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Clock, Zap, TrendingUp, FlameIcon as Fire, Star } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function StreamPage() {
  const assets = getAssets()
  const [activeFilter, setActiveFilter] = useState("all")

  const getFilteredAssets = () => {
    switch (activeFilter) {
      case "trending":
        return assets.filter((a) => a.trending)
      case "newest":
        return assets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "active":
        return assets.sort((a, b) => b.tradeVolume - a.tradeVolume)
      case "popular":
        return assets.sort((a, b) => (b.coinedCount || 0) - (a.coinedCount || 0))
      case "featured":
        return assets.filter((_, index) => index % 3 === 0) // Just a mock filter
      default:
        return assets
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Content Stream</h1>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search content..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <StreamFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <ContentFeed assets={getFilteredAssets()} />
      </div>
    </div>
  )
}

function StreamFilters({
  activeFilter,
  setActiveFilter,
}: { activeFilter: string; setActiveFilter: (id: string) => void }) {
  const filters = [
    { id: "all", label: "All Content" },
    { id: "trending", label: "Trending", icon: <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "newest", label: "Newest", icon: <Clock className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "active", label: "Active", icon: <Zap className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "popular", label: "Popular", icon: <Fire className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "featured", label: "Featured", icon: <Star className="h-3.5 w-3.5 mr-1.5" /> },
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
            {filter.icon}
            {filter.label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}
