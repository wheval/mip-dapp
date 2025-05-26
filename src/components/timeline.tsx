"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { AssetFilterDrawer, type FilterState } from "@/src/components/asset-filter-drawer"
import { Share, MoreHorizontal, ExternalLink, Shield, Play, FileText, Music, X, Sparkles } from "lucide-react"
import { timelineAssets } from "@/src/lib/mock-data"
import Image from "next/image"
import Link from "next/link"

const getMediaIcon = (iptype: string) => {
  switch (iptype.toLowerCase()) {
    case "audio":
      return Music
    case "video":
      return Play
    case "documents":
    case "publications":
    case "posts":
      return FileText
    default:
      return ExternalLink
  }
}

const defaultFilters: FilterState = {
  search: "",
  assetTypes: [],
  licenses: [],
  verifiedOnly: false,
  dateRange: "all",
  sortBy: "recent",
  tags: [],
  priceRange: [0, 100],
}

export function Timeline() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const filteredAssets = useMemo(() => {
    let filtered = [...timelineAssets]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          asset.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          asset.creator.name.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Asset type filter
    if (filters.assetTypes.length > 0) {
      filtered = filtered.filter((asset) => filters.assetTypes.includes(asset.iptype.toLowerCase()))
    }

    // License filter
    if (filters.licenses.length > 0) {
      filtered = filtered.filter((asset) => {
        const assetLicense = asset.license.toLowerCase().replace(/\s+/g, "-")
        return filters.licenses.some((license) => assetLicense.includes(license) || license.includes(assetLicense))
      })
    }

    // Verified creators filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter((asset) => asset.creator.verified)
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((asset) => filters.tags.some((tag) => asset.tags.includes(tag)))
    }

    // Sort
    switch (filters.sortBy) {
      case "alphabetical":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "popular":
        // Mock popularity sort
        filtered.sort(() => Math.random() - 0.5)
        break
      case "trending":
        // Mock trending sort
        filtered.sort(() => Math.random() - 0.5)
        break
      default:
        // Keep original order for "recent"
        break
    }

    return filtered
  }, [filters])

  const activeFilterCount = useMemo(() => {
    return [
      filters.search && 1,
      filters.assetTypes.length,
      filters.licenses.length,
      filters.verifiedOnly && 1,
      filters.dateRange !== "all" && 1,
      filters.sortBy !== "recent" && 1,
      filters.tags.length,
    ]
      .filter(Boolean)
      .reduce((a, b) => (a as number) + (b as number), 0)
  }, [filters])

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "search":
        setFilters((prev) => ({ ...prev, search: "" }))
        break
      case "assetType":
        setFilters((prev) => ({
          ...prev,
          assetTypes: prev.assetTypes.filter((t) => t !== value),
        }))
        break
      case "license":
        setFilters((prev) => ({
          ...prev,
          licenses: prev.licenses.filter((l) => l !== value),
        }))
        break
      case "verified":
        setFilters((prev) => ({ ...prev, verifiedOnly: false }))
        break
      case "tag":
        setFilters((prev) => ({
          ...prev,
          tags: prev.tags.filter((t) => t !== value),
        }))
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter Controls */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold text-foreground">IP Timeline</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">Latest intellectual property from creators worldwide</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AssetFilterDrawer
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
            onClearFilters={clearFilters}
          />
          <span className="text-sm text-muted-foreground">
            {filteredAssets.length} asset{filteredAssets.length !== 1 ? "s" : ""}
          </span>
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Search: "{filters.search}"
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 ml-1 hover:bg-primary/20"
                onClick={() => removeFilter("search")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          {filters.assetTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 ml-1 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => removeFilter("assetType", type)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}

          {filters.licenses.map((license) => (
            <Badge
              key={license}
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
            >
              {license.toUpperCase()}
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 ml-1 hover:bg-green-200 dark:hover:bg-green-800"
                onClick={() => removeFilter("license", license)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}

          {filters.verifiedOnly && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800"
            >
              Verified Only
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 ml-1 hover:bg-purple-200 dark:hover:bg-purple-800"
                onClick={() => removeFilter("verified")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          {filters.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800"
            >
              #{tag}
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 ml-1 hover:bg-orange-200 dark:hover:bg-orange-800"
                onClick={() => removeFilter("tag", tag)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExternalLink className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">No assets found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your filters to discover more IP assets</p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredAssets.map((asset, index) => (
            <Card
              key={asset.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Creator Info */}
              <CardContent className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Link href={`/creator/${asset.creator.username}`}>
                        <Image
                          src={asset.creator.avatar || "/placeholder.svg"}
                          alt={asset.creator.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-border/50 cursor-pointer hover:scale-105 transition-transform"
                        />
                      </Link>
                      {asset.creator.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/creator/${asset.creator.username}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {asset.creator.name}
                        </Link>
                      </div>
                      <p className="text-sm text-muted-foreground">{asset.timestamp}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>

              {/* Asset Media */}
              <Link href={`/asset/${asset.slug}`}>
                <div className="relative overflow-hidden cursor-pointer">
                  <Image
                    src={asset.image || "/placeholder.svg"}
                    alt={asset.name}
                    width={600}
                    height={400}
                    className="w-full h-72 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/90 text-foreground border-border/50 backdrop-blur-sm">
                      {asset.iptype}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="secondary"
                      className="bg-background/90 text-foreground border-border/50 backdrop-blur-sm"
                    >
                      {asset.license}
                    </Badge>
                  </div>

                  {asset.animation_url && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="secondary" size="sm" className="bg-background/90 backdrop-blur-sm">
                        {(() => {
                          const Icon = getMediaIcon(asset.iptype)
                          return <Icon className="w-4 h-4" />
                        })()}
                      </Button>
                    </div>
                  )}
                </div>
              </Link>

              {/* Asset Info */}
              <CardContent className="p-6">
                <Link href={`/asset/${asset.slug}`}>
                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors cursor-pointer">
                    {asset.name}
                  </h2>
                </Link>
                <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{asset.description}</p>

                {/* Attributes */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Attributes</h4>
                  <div className="flex flex-wrap gap-2">
                    {asset.attributes.slice(0, 4).map((attr, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {attr.trait_type}: {attr.value}
                      </Badge>
                    ))}
                    {asset.attributes.length > 4 && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                        +{asset.attributes.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {asset.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-secondary/50">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center space-x-3">
                    <Link href={`/asset/${asset.slug}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>

                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    {asset.license}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
