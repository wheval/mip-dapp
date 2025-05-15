"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  TrendingUp,
  Clock,
  Zap,
  Filter,
  FlameIcon as Fire,
  Star,
  Banknote,
  Calendar,
  Flame,
  RefreshCw,
  ImageIcon,
  Music,
  Video,
  Grid3X3,
  Tag,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HomeSidebarProps {
  activeFilter: string
  setActiveFilter: (id: string) => void
}

export default function HomeSidebar({ activeFilter, setActiveFilter }: HomeSidebarProps) {
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
  const [sortOption, setSortOption] = useState("trending")
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Count active filters
  useEffect(() => {
    const statusCount = Object.values(statusFilters).filter(Boolean).length
    const categoryCount = Object.values(categoryFilters).filter(Boolean).length
    const priceCount = priceRange[0] > 0 || priceRange[1] < 10 ? 1 : 0
    const sortCount = sortOption !== "trending" ? 1 : 0

    setActiveFiltersCount(statusCount + categoryCount + priceCount + sortCount)
  }, [statusFilters, categoryFilters, priceRange, sortOption])

  const handleStatusChange = (key: string, checked: boolean) => {
    setStatusFilters((prev) => ({ ...prev, [key]: checked }))
  }

  const handleCategoryChange = (key: string, checked: boolean) => {
    setCategoryFilters((prev) => ({ ...prev, [key]: checked }))
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
    setPriceRange([0, 10])
    setSortOption("trending")
    setActiveFilter("trending")
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    art: <ImageIcon className="h-4 w-4 mr-2" />,
    collectibles: <Grid3X3 className="h-4 w-4 mr-2" />,
    music: <Music className="h-4 w-4 mr-2" />,
    photography: <ImageIcon className="h-4 w-4 mr-2" />,
    video: <Video className="h-4 w-4 mr-2" />,
    utility: <Tag className="h-4 w-4 mr-2" />,
  }

  const filters = [
    { id: "trending", label: "Trending", icon: <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "newest", label: "Newest", icon: <Clock className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "active", label: "Active", icon: <Zap className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "valuable", label: "Most Valuable", icon: <Filter className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "popular", label: "Popular", icon: <Fire className="h-3.5 w-3.5 mr-1.5" /> },
    { id: "featured", label: "Featured", icon: <Star className="h-3.5 w-3.5 mr-1.5" /> },
  ]

  const sortOptions = [
    { value: "trending", label: "Trending", icon: <Flame className="h-4 w-4 mr-2" /> },
    { value: "recent", label: "Recently Added", icon: <Clock className="h-4 w-4 mr-2" /> },
    { value: "price-low", label: "Price: Low to High", icon: <Banknote className="h-4 w-4 mr-2" /> },
    { value: "price-high", label: "Price: High to Low", icon: <Banknote className="h-4 w-4 mr-2" /> },
    { value: "oldest", label: "Oldest", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { value: "most-active", label: "Most Active", icon: <Zap className="h-4 w-4 mr-2" /> },
  ]

  return (
    <motion.div
      className="space-y-6 bg-card rounded-lg p-4 shadow-sm border sticky top-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Quick Filters</h3>
          {activeFilter !== "trending" && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setActiveFilter("trending")}>
              Reset
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              className="flex items-center justify-start whitespace-nowrap"
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.icon}
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Sort By</h3>
          {sortOption !== "trending" && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSortOption("trending")}>
              Reset
            </Button>
          )}
        </div>
        <RadioGroup value={sortOption} onValueChange={setSortOption} className="space-y-2">
          {sortOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
              <Label htmlFor={`sort-${option.value}`} className="flex items-center cursor-pointer text-sm">
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
              id="home-buy-now"
              checked={statusFilters.buyNow}
              onCheckedChange={(checked) => handleStatusChange("buyNow", checked as boolean)}
            />
            <Label htmlFor="home-buy-now" className="flex items-center cursor-pointer">
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
              id="home-on-auction"
              checked={statusFilters.onAuction}
              onCheckedChange={(checked) => handleStatusChange("onAuction", checked as boolean)}
            />
            <Label htmlFor="home-on-auction" className="flex items-center cursor-pointer">
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
              id="home-new"
              checked={statusFilters.new}
              onCheckedChange={(checked) => handleStatusChange("new", checked as boolean)}
            />
            <Label htmlFor="home-new" className="flex items-center cursor-pointer">
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
              id="home-has-offers"
              checked={statusFilters.hasOffers}
              onCheckedChange={(checked) => handleStatusChange("hasOffers", checked as boolean)}
            />
            <Label htmlFor="home-has-offers" className="flex items-center cursor-pointer">
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
                    id={`home-category-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => handleCategoryChange(key, checked as boolean)}
                  />
                  <Label
                    htmlFor={`home-category-${key}`}
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
      </Accordion>

      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={resetFilters}>
              <RefreshCw className="h-4 w-4" />
              Reset All
            </Button>
            <Button className="flex-1">Apply Filters</Button>
          </div>
        </>
      )}
    </motion.div>
  )
}
