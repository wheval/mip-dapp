"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Label } from "@/src/components/ui/label"
import { Slider } from "@/src/components/ui/slider"
import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import { Badge } from "@/src/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import {
  Banknote,
  Calendar,
  Clock,
  Flame,
  Grid3X3,
  ImageIcon,
  Music,
  Tag,
  Video,
  Zap,
  RefreshCw,
  Grid,
  LayoutList,
  TrendingUp,
  FlameIcon as Fire,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/src/lib/utils"

interface FilterSidebarProps {
  onFilterChange?: (activeFiltersCount: number) => void
  viewMode: "assets" | "collections"
  onViewModeChange?: (mode: "assets" | "collections") => void
  activeFilter?: string
  onFilterChange2?: (filter: string) => void
}

export default function FilterSidebar({
  onFilterChange,
  viewMode = "assets",
  onViewModeChange,
  activeFilter = "all",
  onFilterChange2,
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 10])
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    buyNow: false,
    onAuction: false,
    new: false,
    hasOffers: false,
  })
  const [categoryFilters, setCategoryFilters] = useState<Record<string, boolean>>({
    art: false,
    collectibles: false,
    music: false,
    photography: false,
    video: false,
    utility: false,
  })
  const [collectionFilters, setCollectionFilters] = useState<Record<string, boolean>>({
    digitalDreams: false,
    cryptoPunks: false,
    abstractArt: false,
    metaverseLands: false,
  })
  const [sortOption, setSortOption] = useState("recent")

  // Count active filters
  useEffect(() => {
    const statusCount = Object.values(statusFilters).filter(Boolean).length
    const categoryCount = Object.values(categoryFilters).filter(Boolean).length
    const collectionCount = Object.values(collectionFilters).filter(Boolean).length
    const priceCount = priceRange[0] > 0 || priceRange[1] < 10 ? 1 : 0
    const sortCount = sortOption !== "recent" ? 1 : 0
    const quickFilterCount = activeFilter !== "all" ? 1 : 0

    const totalCount = statusCount + categoryCount + collectionCount + priceCount + sortCount + quickFilterCount

    if (onFilterChange) {
      onFilterChange(totalCount)
    }
  }, [statusFilters, categoryFilters, collectionFilters, priceRange, sortOption, activeFilter, onFilterChange])

  const handleStatusChange = (key: string, checked: boolean) => {
    setStatusFilters((prev) => ({ ...prev, [key]: checked }))
  }

  const handleCategoryChange = (key: string, checked: boolean) => {
    setCategoryFilters((prev) => ({ ...prev, [key]: checked }))
  }

  const handleCollectionChange = (key: string, checked: boolean) => {
    setCollectionFilters((prev) => ({ ...prev, [key]: checked }))
  }

  const resetFilters = () => {
    setStatusFilters({
      buyNow: false,
      onAuction: false,
      new: false,
      hasOffers: false,
    })
    setCategoryFilters({
      art: false,
      collectibles: false,
      music: false,
      photography: false,
      video: false,
      utility: false,
    })
    setCollectionFilters({
      digitalDreams: false,
      cryptoPunks: false,
      abstractArt: false,
      metaverseLands: false,
    })
    setPriceRange([0, 10])
    setSortOption("recent")
    if (onFilterChange2) {
      onFilterChange2("all")
    }
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    art: <ImageIcon className="h-4 w-4 mr-2" />,
    collectibles: <Grid3X3 className="h-4 w-4 mr-2" />,
    music: <Music className="h-4 w-4 mr-2" />,
    photography: <ImageIcon className="h-4 w-4 mr-2" />,
    video: <Video className="h-4 w-4 mr-2" />,
    utility: <Tag className="h-4 w-4 mr-2" />,
  }

  const sortOptions = [
    { value: "recent", label: "Recently Added", icon: <Clock className="h-4 w-4 mr-2" /> },
    { value: "price-low", label: "Price: Low to High", icon: <Banknote className="h-4 w-4 mr-2" /> },
    { value: "price-high", label: "Price: High to Low", icon: <Banknote className="h-4 w-4 mr-2" /> },
    { value: "trending", label: "Trending", icon: <Flame className="h-4 w-4 mr-2" /> },
    { value: "oldest", label: "Oldest", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { value: "most-active", label: "Most Active", icon: <Zap className="h-4 w-4 mr-2" /> },
  ]

  const quickFilters = [
    { id: "all", label: "All Assets" },
    { id: "trending", label: "Trending", icon: <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "newest", label: "Newest", icon: <Clock className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "active", label: "Active", icon: <Zap className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "popular", label: "Popular", icon: <Fire className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "featured", label: "Featured", icon: <Star className="h-3.5 w-3.5 mr-1.5" /> },
  ]

  return (
    <motion.div
      className="space-y-6 bg-card rounded-lg p-4 shadow-sm border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* View Mode Toggle */}
      <div>
        <h3 className="font-medium mb-3">View</h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "assets" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange && onViewModeChange("assets")}
            className="flex-1 gap-1.5"
          >
            <LayoutList className="h-4 w-4" />
            Assets
          </Button>
          <Button
            variant={viewMode === "collections" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange && onViewModeChange("collections")}
            className="flex-1 gap-1.5"
          >
            <Grid className="h-4 w-4" />
            Collections
          </Button>
        </div>
      </div>

      <Separator />

      {/* Quick Filters - Only show for assets view */}
      {viewMode === "assets" && (
        <>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Quick Filters</h3>
              {activeFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => onFilterChange2 && onFilterChange2("all")}
                >
                  Reset
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  className="flex items-center justify-start whitespace-nowrap"
                  onClick={() => onFilterChange2 && onFilterChange2(filter.id)}
                >
                  {filter.icon}
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />
        </>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Sort By</h3>
          {sortOption !== "recent" && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSortOption("recent")}>
              Reset
            </Button>
          )}
        </div>
        <RadioGroup value={sortOption} onValueChange={setSortOption} className="space-y-2">
          {sortOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="flex items-center cursor-pointer text-sm">
                {option.icon}
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Status</h3>
          {Object.values(statusFilters).some(Boolean) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() =>
                setStatusFilters({
                  buyNow: false,
                  onAuction: false,
                  new: false,
                  hasOffers: false,
                })
              }
            >
              Reset
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="buy-now"
              checked={statusFilters.buyNow}
              onCheckedChange={(checked) => handleStatusChange("buyNow", checked as boolean)}
            />
            <Label htmlFor="buy-now" className="flex items-center cursor-pointer">
              Buy Now
              {statusFilters.buyNow && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Active
                </Badge>
              )}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-auction"
              checked={statusFilters.onAuction}
              onCheckedChange={(checked) => handleStatusChange("onAuction", checked as boolean)}
            />
            <Label htmlFor="on-auction" className="flex items-center cursor-pointer">
              On Auction
              {statusFilters.onAuction && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Active
                </Badge>
              )}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new"
              checked={statusFilters.new}
              onCheckedChange={(checked) => handleStatusChange("new", checked as boolean)}
            />
            <Label htmlFor="new" className="flex items-center cursor-pointer">
              New
              {statusFilters.new && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Active
                </Badge>
              )}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-offers"
              checked={statusFilters.hasOffers}
              onCheckedChange={(checked) => handleStatusChange("hasOffers", checked as boolean)}
            />
            <Label htmlFor="has-offers" className="flex items-center cursor-pointer">
              Has Offers
              {statusFilters.hasOffers && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Active
                </Badge>
              )}
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Price Range</h3>
          {(priceRange[0] > 0 || priceRange[1] < 10) && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setPriceRange([0, 10])}>
              Reset
            </Button>
          )}
        </div>
        <div className="space-y-4">
          <Slider value={priceRange} max={10} step={0.1} onValueChange={setPriceRange} className="mt-6" />
          <div className="flex items-center justify-between">
            <div className="bg-muted rounded-md px-3 py-1 text-sm">{priceRange[0].toFixed(1)} ETH</div>
            <div className="bg-muted rounded-md px-3 py-1 text-sm">{priceRange[1].toFixed(1)} ETH</div>
          </div>
        </div>
      </div>

      <Separator />

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="py-3">
            <div className="flex items-center justify-between w-full pr-4">
              <span>Categories</span>
              {Object.values(categoryFilters).some(Boolean) && (
                <Badge className="ml-2">{Object.values(categoryFilters).filter(Boolean).length}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {Object.entries(categoryFilters).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => handleCategoryChange(key, checked as boolean)}
                  />
                  <Label
                    htmlFor={`category-${key}`}
                    className={cn("flex items-center capitalize cursor-pointer", value && "font-medium")}
                  >
                    {categoryIcons[key]}
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="collections" className="border-none">
          <AccordionTrigger className="py-3">
            <div className="flex items-center justify-between w-full pr-4">
              <span>Collections</span>
              {Object.values(collectionFilters).some(Boolean) && (
                <Badge className="ml-2">{Object.values(collectionFilters).filter(Boolean).length}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {Object.entries(collectionFilters).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`collection-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => handleCollectionChange(key, checked as boolean)}
                  />
                  <Label htmlFor={`collection-${key}`} className={cn("cursor-pointer", value && "font-medium")}>
                    {key === "digitalDreams" && "Digital Dreams"}
                    {key === "cryptoPunks" && "Crypto Punks"}
                    {key === "abstractArt" && "Abstract Art"}
                    {key === "metaverseLands" && "Metaverse Lands"}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1 gap-2" onClick={resetFilters}>
          <RefreshCw className="h-4 w-4" />
          Reset All
        </Button>
        <Button className="flex-1">Apply Filters</Button>
      </div>
    </motion.div>
  )
}
