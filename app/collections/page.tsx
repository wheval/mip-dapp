"use client"

import { getCollections } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Clock, Star, Sparkles, Plus, CircleDashed, X, SlidersHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import CollectionsGrid from "@/components/collections-grid"

export default function CollectionsPage() {
  const allCollections = getCollections()
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("volume")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [displayedCollections, setDisplayedCollections] = useState(allCollections)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [priceRange, setPriceRange] = useState([0, 10])
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Automatically close sidebar on mobile
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isDesktop])

  useEffect(() => {
    // Simulate loading data from an API
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = allCollections

    // Apply search filter
    if (debouncedSearchQuery) {
      filtered = filtered.filter(
        (collection) =>
          collection.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          collection.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      )
    }

    // Apply verified filter
    if (verifiedOnly) {
      filtered = filtered.filter((c) => c.verified)
    }

    // Apply category filter
    switch (activeFilter) {
      case "trending":
        filtered = filtered.sort((a, b) => b.volumeChange - a.volumeChange)
        break
      case "newest":
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime(),
        )
        break
      case "popular":
        filtered = filtered.sort((a, b) => b.volume - a.volume)
        break
      case "verified":
        filtered = filtered.filter((c) => c.verified)
        break
    }

    // Apply price range filter
    if (priceRange[0] > 0 || priceRange[1] < 10) {
      filtered = filtered.filter((c) => c.floorPrice >= priceRange[0] && c.floorPrice <= priceRange[1])
    }

    // Apply sorting
    switch (sortBy) {
      case "volume":
        filtered = filtered.sort((a, b) => b.volume - a.volume)
        break
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "items":
        filtered = filtered.sort((a, b) => b.assetCount - a.assetCount)
        break
      case "owners":
        filtered = filtered.sort((a, b) => b.ownerCount - a.ownerCount)
        break
    }

    setDisplayedCollections(filtered)

    // Count active filters
    let count = 0
    if (activeFilter !== "all") count++
    if (sortBy !== "volume") count++
    if (verifiedOnly) count++
    if (priceRange[0] > 0 || priceRange[1] < 10) count++
    setActiveFiltersCount(count)
  }, [debouncedSearchQuery, activeFilter, sortBy, allCollections, verifiedOnly, priceRange])

  const resetFilters = () => {
    setActiveFilter("all")
    setSortBy("volume")
    setVerifiedOnly(false)
    setPriceRange([0, 10])
    setSearchQuery("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">Collections</h1>
                <p className="text-muted-foreground">Discover unique digital collections from creators</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search collections..."
                    className="pl-10 pr-10"
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

                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {activeFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Filter: {activeFilter}
                    <button onClick={() => setActiveFilter("all")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {sortBy !== "volume" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Sort: {sortBy}
                    <button onClick={() => setSortBy("volume")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {verifiedOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Verified Only
                    <button onClick={() => setVerifiedOnly(false)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {(priceRange[0] > 0 || priceRange[1] < 10) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Price: {priceRange[0]}-{priceRange[1]} ETH
                    <button onClick={() => setPriceRange([0, 10])}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={resetFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
                  ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {displayedCollections.length === 0 ? (
                  <EmptyState searchQuery={searchQuery} setSearchQuery={setSearchQuery} resetFilters={resetFilters} />
                ) : (
                  <>
                    <CollectionsGrid collections={displayedCollections} />

                    {displayedCollections.length > 0 && (
                      <div className="flex justify-center mt-8">
                        <Button variant="outline" size="lg" className="gap-2">
                          <CircleDashed className="h-4 w-4" />
                          Load More
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "lg:w-72 lg:flex-shrink-0",
                !isDesktop && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
              )}
            >
              <div
                className={cn(
                  "h-full",
                  !isDesktop && "absolute right-0 top-0 h-full w-3/4 max-w-xs border-l bg-background p-6",
                )}
              >
                {!isDesktop && (
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="space-y-6 sticky top-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-3">Quick Filters</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={activeFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter("all")}
                        className="justify-start"
                      >
                        All Collections
                      </Button>
                      <Button
                        variant={activeFilter === "trending" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter("trending")}
                        className="justify-start"
                      >
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                        Trending
                      </Button>
                      <Button
                        variant={activeFilter === "newest" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter("newest")}
                        className="justify-start"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        Newest
                      </Button>
                      <Button
                        variant={activeFilter === "popular" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter("popular")}
                        className="justify-start"
                      >
                        <Star className="h-3.5 w-3.5 mr-1.5" />
                        Popular
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <h3 className="font-medium mb-3">Sort By</h3>
                    <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="volume" id="volume" />
                        <Label htmlFor="volume">Highest Volume</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="name" id="name" />
                        <Label htmlFor="name">Name (A-Z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="items" id="items" />
                        <Label htmlFor="items">Most Items</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="owners" id="owners" />
                        <Label htmlFor="owners">Most Owners</Label>
                      </div>
                    </RadioGroup>

                    <Separator className="my-4" />

                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="space-y-4">
                      <Slider value={priceRange} max={10} step={0.1} onValueChange={setPriceRange} className="mt-6" />
                      <div className="flex items-center justify-between">
                        <div className="bg-muted rounded-md px-3 py-1 text-sm">{priceRange[0].toFixed(1)} ETH</div>
                        <div className="bg-muted rounded-md px-3 py-1 text-sm">{priceRange[1].toFixed(1)} ETH</div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified-only"
                        checked={verifiedOnly}
                        onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                      />
                      <Label htmlFor="verified-only">Verified Collections Only</Label>
                    </div>

                    <Separator className="my-4" />

                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="categories" className="border-none">
                        <AccordionTrigger className="py-1">Categories</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-art" />
                              <Label htmlFor="category-art">Art</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-collectibles" />
                              <Label htmlFor="category-collectibles">Collectibles</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-photography" />
                              <Label htmlFor="category-photography">Photography</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-music" />
                              <Label htmlFor="category-music">Music</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" onClick={resetFilters}>
                        Reset
                      </Button>
                      <Button className="flex-1">Apply</Button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Create Collection</h3>
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share your creativity with the world by creating your own collection.
                    </p>
                    <Button className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Create Collection
                    </Button>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function EmptyState({
  searchQuery,
  setSearchQuery,
  resetFilters,
}: { searchQuery: string; setSearchQuery: (query: string) => void; resetFilters: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-4">
      <div className="bg-muted/30 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
        <Search className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-medium mb-2">No collections found</h3>
      {searchQuery ? (
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any collections matching "<span className="font-medium">{searchQuery}</span>".
        </p>
      ) : (
        <p className="text-muted-foreground max-w-md mx-auto">No collections match the current filter criteria.</p>
      )}
      <div className="flex gap-2 justify-center mt-6">
        {searchQuery && (
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        )}
        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>
    </motion.div>
  )
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
