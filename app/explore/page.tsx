"use client"

import { getAssets, getCollections } from "@/lib/mock-data"
import ContentFeed from "@/components/content-feed"
import CollectionsGrid from "@/components/collections-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, X } from "lucide-react"
import FilterSidebar from "@/components/filter-sidebar"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export default function ExplorePage() {
  const assets = getAssets()
  const collections = getCollections()
  const [viewMode, setViewMode] = useState<"assets" | "collections">("assets")
  const [activeFilter, setActiveFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true)
    } else {
      setSidebarOpen(false)
    }
  }, [isDesktop])

  const getFilteredAssets = () => {
    let filtered = assets

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (asset) => asset.name.toLowerCase().includes(query) || asset.creator.name.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    switch (activeFilter) {
      case "trending":
        return filtered.filter((a) => a.trending)
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "active":
        return filtered.sort((a, b) => b.tradeVolume - a.tradeVolume)
      case "popular":
        return filtered.sort((a, b) => (b.coinedCount || 0) - (a.coinedCount || 0))
      case "featured":
        return filtered.filter((_, index) => index % 3 === 0) // Just a mock filter
      default:
        return filtered
    }
  }

  const filteredAssets = getFilteredAssets()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Explore</h1>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search assets and collections..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="relative"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sidebarOpen ? "Hide filters" : "Show filters"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main content - takes full width when sidebar is closed */}
          <div
            className={cn("transition-all duration-300 ease-in-out", sidebarOpen ? "lg:col-span-8" : "lg:col-span-12")}
          >
            {viewMode === "assets" ? (
              <>
                <ContentFeed assets={filteredAssets} />
                {filteredAssets.length === 0 && (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-2">No assets found matching your criteria</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveFilter("all")
                        setSearchQuery("")
                        setActiveFiltersCount(0)
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <CollectionsGrid collections={collections} />
            )}
          </div>

          {/* Sidebar - conditionally rendered */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="lg:col-span-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="sticky top-20">
                  <div className="flex items-center justify-between mb-4 lg:hidden">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <FilterSidebar
                    onFilterChange={(count) => setActiveFiltersCount(count)}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    activeFilter={activeFilter}
                    onFilterChange2={setActiveFilter}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
