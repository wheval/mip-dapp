"use client"

import React, { useState, useEffect, useCallback } from "react"
import { CollectionCard } from "@/src/components/collection-card"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { 
    Search, 
    Grid3X3, 
    List, 
    TrendingUp, 
    FolderOpen, 
    Eye, 
    Heart, 
    Plus, 
    Filter,
    AlertCircle,
    RefreshCw
} from "lucide-react"
import { useCollections, type CollectionFilters } from "@/src/hooks/use-collections"
import type { Collection } from "@/src/types/asset"
import Link from "next/link"

export interface IPCollectionBrowserProps {
    // Display Configuration
    title?: string
    subtitle?: string
    showHeader?: boolean
    showStats?: boolean
    showFilters?: boolean
    showTabs?: boolean
    showCreateButton?: boolean
    showViewToggle?: boolean
    
    // Data Configuration
    enableRealData?: boolean
    userAddress?: string
    limit?: number
    
    // Layout Configuration
    variant?: "full" | "compact" | "minimal"
    viewMode?: "grid" | "list"
    gridCols?: "1" | "2" | "3" | "4" | "5"
    
    // Feature Configuration
    enableSearch?: boolean
    enableSorting?: boolean
    enableCategoryFilter?: boolean
    enablePagination?: boolean
    enableInfiniteScroll?: boolean
    
    // Styling
    className?: string
    cardVariant?: "default" | "featured" | "compact"
    
    // Callbacks
    onCollectionClick?: (collection: Collection) => void
    onCreateClick?: () => void
    onFilterChange?: (filters: CollectionFilters) => void
    
    // Initial State
    initialFilters?: CollectionFilters
    initialViewMode?: "grid" | "list"
    initialTab?: "all" | "featured"
}

export function IPCollectionBrowser({
    title = "IP Collections",
    subtitle = "Discover curated collections of programmable intellectual property",
    showHeader = true,
    showStats = true,
    showFilters = true,
    showTabs = true,
    showCreateButton = true,
    showViewToggle = true,
    enableRealData = false,
    userAddress,
    limit = 20,
    variant = "full",
    viewMode: initialViewMode = "grid",
    gridCols = "3",
    enableSearch = true,
    enableSorting = true,
    enableCategoryFilter = true,
    enablePagination = true,
    enableInfiniteScroll = false,
    className = "",
    cardVariant = "default",
    onCollectionClick,
    onCreateClick,
    onFilterChange,
    initialFilters = {},
    initialTab = "all"
}: IPCollectionBrowserProps) {
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || "")
    const [sortBy, setSortBy] = useState(initialFilters.sortBy || "recent")
    const [filterBy, setFilterBy] = useState(initialFilters.category || "all")
    const [viewMode, setViewMode] = useState(initialViewMode)
    const [selectedTab, setSelectedTab] = useState(initialTab)
    const [currentFilters, setCurrentFilters] = useState<CollectionFilters>(initialFilters)

    const {
        collections,
        filteredCollections,
        featuredCollections,
        isLoading,
        error,
        page,
        hasMore,
        totalAssets,
        totalViews,
        totalLikes,
        refetch,
        loadMore,
        setFilters,
        setPage
    } = useCollections({
        filters: currentFilters,
        limit,
        enableRealData,
        userAddress
    })

    // Update filters when local state changes
    useEffect(() => {
        const newFilters: CollectionFilters = {
            search: searchQuery || undefined,
            sortBy,
            category: filterBy !== "all" ? filterBy : undefined,
            featured: selectedTab === "featured" ? true : undefined
        }
        setCurrentFilters(newFilters)
        setFilters(newFilters)
        onFilterChange?.(newFilters)
    }, [searchQuery, sortBy, filterBy, selectedTab, setFilters, onFilterChange])

    // Get current collections based on tab
    const currentCollections = selectedTab === "featured" ? featuredCollections : filteredCollections

    // Handle collection click
    const handleCollectionClick = useCallback((collection: Collection) => {
        onCollectionClick?.(collection)
    }, [onCollectionClick])

    // Handle create click
    const handleCreateClick = useCallback(() => {
        onCreateClick?.()
    }, [onCreateClick])

    // Handle load more
    const handleLoadMore = useCallback(() => {
        if (enablePagination && hasMore) {
            loadMore()
        }
    }, [enablePagination, hasMore, loadMore])

    // Grid column classes
    const gridColsClass = {
        "1": "grid-cols-1",
        "2": "grid-cols-1 sm:grid-cols-2",
        "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        "5": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    }

    // Render loading skeleton
    const renderLoadingSkeleton = () => (
        <div className={`grid gap-6 ${gridColsClass[gridCols]}`}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-40" />
                    <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    // Render error state
    const renderError = () => (
        <Alert className="animate-fade-in-up">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={refetch}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
            </AlertDescription>
        </Alert>
    )

    // Render empty state
    const renderEmptyState = () => (
        <div className="text-center py-16 animate-fade-in-up">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <FolderOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">No collections found</h3>
            <p className="text-muted-foreground mb-6">
                {selectedTab === "featured" 
                    ? "No featured collections available" 
                    : "Start creating collections or adjust your filters"}
            </p>
            {showCreateButton && (
                <Button onClick={handleCreateClick} className="hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Collection
                </Button>
            )}
        </div>
    )

    // Render collection grid
    const renderCollectionGrid = () => {
        if (viewMode === "list") {
            return (
                <div className="space-y-4">
                    {currentCollections.map((collection, index) => (
                        <div key={collection.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <div onClick={() => handleCollectionClick(collection)}>
                                <CollectionCard collection={collection} variant="compact" />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        // Determine card variant based on prop configuration
        const getCardVariant = (collection: Collection) => {
            // If cardVariant is explicitly set, use it consistently
            if (cardVariant === "featured") {
                return "featured"
            }
            if (cardVariant === "compact") {
                return "compact"
            }
            // For default, respect individual collection featured status only if cardVariant is not explicitly set to "default"
            if (cardVariant === "default") {
                return "default" // Force consistent default variant
            }
            // Fallback to original behavior if no specific variant is set
            return collection.isFeatured ? "featured" : "default"
        }

        return (
            <div className={`grid gap-6 ${gridColsClass[gridCols]}`}>
                {currentCollections.map((collection, index) => (
                    <div key={collection.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <div onClick={() => handleCollectionClick(collection)}>
                            <CollectionCard 
                                collection={collection} 
                                variant={getCardVariant(collection)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Render stats cards
    const renderStats = () => {
        if (!showStats) return null

        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4 text-center">
                        <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {collections.length}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">Collections</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <div className="text-lg font-bold text-green-900 dark:text-green-100">
                            {totalAssets.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">Total Assets</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4 text-center">
                        <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                            {totalViews.toLocaleString()}
                        </div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">Total Views</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4 text-center">
                        <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                        <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
                            {totalLikes.toLocaleString()}
                        </div>
                        <div className="text-xs text-orange-700 dark:text-orange-300">Total Likes</div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Render header
    const renderHeader = () => {
        if (!showHeader) return null

        return (
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {collections.length} Collections
                        </Badge>
                        {showCreateButton && (
                            <Button onClick={handleCreateClick} className="hover:scale-105 transition-transform">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Collection
                            </Button>
                        )}
                    </div>
                </div>
                {renderStats()}
            </div>
        )
    }

    // Render filters
    const renderFilters = () => {
        if (!showFilters) return null

        return (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {enableSearch && (
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search collections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background/50"
                        />
                    </div>
                )}

                {enableSorting && (
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-40 bg-background/50">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Recent</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="assets">Most Assets</SelectItem>
                            <SelectItem value="views">Most Viewed</SelectItem>
                            <SelectItem value="likes">Most Liked</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {enableCategoryFilter && (
                    <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-full sm:w-40 bg-background/50">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="digital art">Digital Art</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="publications">Publications</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="patents">Patents</SelectItem>
                            <SelectItem value="ai art">AI Art</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>
        )
    }

    // Render view toggle
    const renderViewToggle = () => {
        if (!showViewToggle) return null

        return (
            <div className="flex items-center space-x-2">
                <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="w-9 h-9 p-0 hover:scale-105 transition-transform"
                >
                    <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="w-9 h-9 p-0 hover:scale-105 transition-transform"
                >
                    <List className="w-4 h-4" />
                </Button>
            </div>
        )
    }

    // Render tabs
    const renderTabs = () => {
        if (!showTabs) return null

        return (
            <Tabs value={selectedTab} onValueChange={setSelectedTab as any} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-muted/50">
                        <TabsTrigger value="all" className="data-[state=active]:bg-background">
                            All Collections ({collections.length})
                        </TabsTrigger>
                        <TabsTrigger value="featured" className="data-[state=active]:bg-background">
                            Featured ({featuredCollections.length})
                        </TabsTrigger>
                    </TabsList>
                    {renderViewToggle()}
                </div>
                {renderFilters()}
            </Tabs>
        )
    }

    // Render load more button
    const renderLoadMore = () => {
        if (!enablePagination || !hasMore || isLoading) return null

        return (
            <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore} variant="outline" className="hover:scale-105 transition-transform">
                    Load More Collections
                </Button>
            </div>
        )
    }

    // Main render
    return (
        <div className={`w-full ${className}`}>
            {renderHeader()}
            
            {variant === "minimal" ? (
                <div className="space-y-6">
                    {error && renderError()}
                    {isLoading && renderLoadingSkeleton()}
                    {!isLoading && !error && currentCollections.length === 0 && renderEmptyState()}
                    {!isLoading && !error && currentCollections.length > 0 && renderCollectionGrid()}
                    {renderLoadMore()}
                </div>
            ) : (
                <div className="space-y-6">
                    {renderTabs()}
                    <div className="mt-6">
                        {error && renderError()}
                        {isLoading && renderLoadingSkeleton()}
                        {!isLoading && !error && currentCollections.length === 0 && renderEmptyState()}
                        {!isLoading && !error && currentCollections.length > 0 && renderCollectionGrid()}
                        {renderLoadMore()}
                    </div>
                </div>
            )}
        </div>
    )
}

// Export additional components for specific use cases
export function CompactCollectionBrowser(props: Partial<IPCollectionBrowserProps>) {
    return (
        <IPCollectionBrowser
            {...props}
            variant="compact"
            showHeader={false}
            showStats={false}
            showTabs={false}
            showCreateButton={false}
            gridCols="2"
        />
    )
}

export function MinimalCollectionBrowser(props: Partial<IPCollectionBrowserProps>) {
    return (
        <IPCollectionBrowser
            {...props}
            variant="minimal"
            showHeader={false}
            showStats={false}
            showTabs={false}
            showFilters={false}
            showCreateButton={false}
            showViewToggle={false}
            gridCols="3"
        />
    )
}

export function DashboardCollectionBrowser(props: Partial<IPCollectionBrowserProps>) {
    return (
        <IPCollectionBrowser
            {...props}
            variant="full"
            title="Your Collections"
            subtitle="Manage your IP collections and assets"
            showCreateButton={true}
            enableRealData={true}
            gridCols="3"
        />
    )
} 