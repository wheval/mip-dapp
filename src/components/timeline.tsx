"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible"
import { AssetFilterDrawer, type FilterState } from "@/src/components/asset-filter-drawer"
import {
  Share,
  MoreHorizontal,
  Shield,
  ExternalLink,
  Sparkles,
  X,
  ChevronDown,
  CheckCircle,
  XCircle,
  Globe,
  Eye,
  Copy,
  Send,
  Loader2,
  UserPlus,
  Calendar,
  Hash,
  Network,
  Award,
} from "lucide-react"
import { timelineAssets } from "@/src/lib/mock-data"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

const getLicenseColor = (licenseType: string) => {
  switch (licenseType) {
    case "all-rights":
      return "bg-red-500 text-white"
    case "creative-commons":
      return "bg-green-500 text-white"
    case "open-source":
      return "bg-blue-500 text-white"
    case "custom":
      return "bg-purple-500 text-white"
    default:
      return "bg-gray-500 text-white"
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

const ASSETS_PER_PAGE = 10

export function Timeline() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const filteredAssets = useMemo(() => {
    let filtered = [...timelineAssets]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (asset) =>
          asset.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          asset.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          asset.creator.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          asset.tags.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Asset type filter
    if (filters.assetTypes.length > 0) {
      filtered = filtered.filter((asset) => filters.assetTypes.includes(asset.type.toLowerCase()))
    }

    // License filter
    if (filters.licenses.length > 0) {
      filtered = filtered.filter((asset) => {
        const assetLicense = asset.licenseType.toLowerCase().replace(/\s+/g, "-")
        return filters.licenses.some((license) => assetLicense.includes(license) || license.includes(assetLicense))
      })
    }

    // Verified creators filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter((asset) => asset.creator.verified)
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((asset) =>
        filters.tags.some((tag) => asset.tags.toLowerCase().includes(tag.toLowerCase())),
      )
    }

    // Sort
    switch (filters.sortBy) {
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "popular":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      case "trending":
        filtered.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
        break
      default:
        break
    }

    return filtered
  }, [filters])

  const paginatedAssets = useMemo(() => {
    return filteredAssets.slice(0, currentPage * ASSETS_PER_PAGE)
  }, [filteredAssets, currentPage])

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

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const nextPage = currentPage + 1
    const totalAvailable = filteredAssets.length
    const nextPageAssets = totalAvailable - currentPage * ASSETS_PER_PAGE

    if (nextPageAssets <= 0) {
      setHasMore(false)
    } else {
      setCurrentPage(nextPage)
    }

    setIsLoading(false)
  }, [currentPage, filteredAssets.length, isLoading, hasMore])

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMore])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setHasMore(true)
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

  const toggleExpanded = (assetId: string) => {
    setExpandedAssets((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(assetId)) {
        newSet.delete(assetId)
      } else {
        newSet.add(assetId)
      }
      return newSet
    })
  }

  const handleShare = (asset: any) => {
    const url = `${window.location.origin}/asset/${asset.slug}`
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="space-y-6">
     
     
      {/* Header */}
      <div className="text-center space-y-4">
        
      </div>
     

      {/* Timeline Feed */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No assets found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your filters to discover more IP assets</p>
          <Button onClick={clearFilters} variant="outline">
            <Sparkles className="w-4 h-4 mr-2" />
            Explore All Assets
          </Button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {paginatedAssets.map((asset, index) => (
            <Card
              key={asset.id}
              className="overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 group"
            >
              <Collapsible open={expandedAssets.has(asset.id)} onOpenChange={() => toggleExpanded(asset.id)}>
                {/* Asset Media - Top */}
                <Link href={`/asset/${asset.slug}`}>
                  <div className="relative">
                    <Image
                      src={asset.mediaUrl || "/placeholder.svg"}
                      alt={asset.title}
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover cursor-pointer"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getLicenseColor(asset.licenseType)} text-xs`}>
                        {asset.licenseType.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Link>

                {/* Main Content */}
                <CardContent className="p-4">
                  {/* Title & Description */}
                  <div className="space-y-3 mb-4">
                    <Link href={`/asset/${asset.slug}`}>
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                        {asset.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">{asset.description}</p>
                  </div>

                  {/* Type & Author */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Link href={`/creator/${asset.creator.username}`}>
                        <Image
                          src={asset.creator.avatar || "/placeholder.svg"}
                          alt={asset.creator.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-border/50"
                        />
                      </Link>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/creator/${asset.creator.username}`}
                            className="font-medium text-sm text-foreground hover:text-primary transition-colors"
                          >
                            {asset.creator.name}
                          </Link>
                          {asset.creator.verified && <Shield className="w-3 h-3 text-blue-500" />}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">{asset.timestamp}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {asset.type}
                          </Badge>
                          
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(asset)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="w-4 h-4 mr-2" />
                          License Asset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Explorer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(asset)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>


                  

                      {asset.externalUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <a href={asset.externalUrl} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-1" />
                            External
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">

                      <Link href={`/asset/${asset.slug}`}>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>

                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm">
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${expandedAssets.has(asset.id) ? "rotate-180" : ""}`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  {/* Dashboard-Style Expandable Details */}
                  <CollapsibleContent className="mt-4">
                    <div className="pt-4 border-t border-border/30">
                      {/* Dashboard Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Creator Card */}
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <UserPlus className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Creator
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Image
                              src={asset.creator.avatar || "/placeholder.svg"}
                              alt={asset.creator.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{asset.creator.name}</p>
                              <p className="text-xs text-muted-foreground truncate">@{asset.creator.username}</p>
                            </div>
                          </div>
                        </div>

                        {/* Protection Status */}
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Protection
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{asset.protectionStatus}</p>
                            <p className="text-xs text-muted-foreground">v{asset.ipVersion}</p>
                          </div>
                        </div>

                        {/* Network Info */}
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Network className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Network
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{asset.blockchain}</p>
                            <p className="text-xs text-muted-foreground font-mono">#{asset.tokenId || asset.id}</p>
                          </div>
                        </div>

                        {/* Registration */}
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Registered
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{asset.registrationDate}</p>
                            <p className="text-xs text-muted-foreground">{asset.protectionDuration}</p>
                          </div>
                        </div>
                      </div>

                      {/* License Permissions - Compact */}
                      <div className="bg-muted/30 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Award className="w-4 h-4 text-orange-500" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            License Permissions
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="flex justify-center mb-1">
                              {asset.commercialUse ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <p className="text-xs font-medium text-foreground">Commercial</p>
                          </div>
                          <div className="text-center">
                            <div className="flex justify-center mb-1">
                              {asset.modifications ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <p className="text-xs font-medium text-foreground">Modify</p>
                          </div>
                          <div className="text-center">
                            <div className="flex justify-center mb-1">
                              {asset.attribution ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <p className="text-xs font-medium text-foreground">Attribution</p>
                          </div>
                        </div>
                      </div>

                      {/* Tags - Compact */}
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Hash className="w-4 h-4 text-cyan-500" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Tags
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.split(", ").map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Collapsible>
            </Card>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading more assets...</span>
              </div>
            </div>
          )}

          {/* End of results */}
          {!hasMore && paginatedAssets.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">You've reached the end of the timeline</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
