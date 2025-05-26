"use client"

import { useState } from "react"
import { Header } from "@/src/components/header"
import { FloatingNavigation } from "@/src/components/floating-navigation"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import {
  MoreVertical,
  Eye,
  Send,
  TrendingUp,
  Search,
  Grid3X3,
  List,
  Download,
  Share,
  Edit,
  Trash2,
  Star,
  Users,
  Shield,
  ExternalLink,
} from "lucide-react"
import { portfolioAssets } from "@/src/lib/mock-data"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

export default function PortfolioPage() {
  const [selectedTab, setSelectedTab] = useState("owned")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")

  const ownedAssets = portfolioAssets.filter((asset) => asset.status === "owned")
  const createdAssets = portfolioAssets.filter((asset) => asset.status === "created")

  const currentAssets = selectedTab === "owned" ? ownedAssets : createdAssets

  const filteredAssets = currentAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterBy === "all" || asset.iptype.toLowerCase() === filterBy.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "type":
        return a.iptype.localeCompare(b.iptype)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">

      <main className="pb-6">
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">My IP Portfolio</h1>
                  <p className="text-muted-foreground">Manage your tokenized intellectual property</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {currentAssets.length} Assets
                  </Badge>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <Card
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {ownedAssets.length + createdAssets.length}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Assets</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">{createdAssets.length}</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Created</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{ownedAssets.length}</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Collected</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg font-bold text-orange-900 dark:text-orange-100">100%</div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">Protected</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tabs and Controls */}
            <div className="space-y-4 mb-6 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-muted/50">
                    <TabsTrigger value="owned" className="data-[state=active]:bg-background">
                      Owned ({ownedAssets.length})
                    </TabsTrigger>
                    <TabsTrigger value="created" className="data-[state=active]:bg-background">
                      Created ({createdAssets.length})
                    </TabsTrigger>
                  </TabsList>

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
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search your IP assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40 bg-background/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-full sm:w-40 bg-background/50">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="documents">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <TabsContent value="owned" className="mt-6">
                  <AssetGrid assets={sortedAssets} viewMode={viewMode} />
                </TabsContent>

                <TabsContent value="created" className="mt-6">
                  <AssetGrid assets={sortedAssets} viewMode={viewMode} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <FloatingNavigation />
    </div>
  )
}

function AssetGrid({ assets, viewMode }: { assets: any[]; viewMode: "grid" | "list" }) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <TrendingUp className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">No IP assets found</h3>
        <p className="text-muted-foreground mb-6">Start tokenizing your intellectual property or adjust your filters</p>
        <Link href="/create">
          <Button className="hover:scale-105 transition-transform">Create New IP</Button>
        </Link>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {assets.map((asset, index) => (
          <Card
            key={asset.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 group animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-0">
              <div className="flex items-center space-x-4 p-4">
                <Link href={`/asset/${asset.slug}`} className="relative flex-shrink-0">
                  <Image
                    src={asset.image || "/placeholder.svg"}
                    alt={asset.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute -top-2 -right-2 text-xs">{asset.iptype}</Badge>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/asset/${asset.slug}`}>
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors cursor-pointer">
                      {asset.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{asset.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-muted-foreground">License: {asset.license}</span>
                    <span className="text-xs text-muted-foreground">
                      Creator: {asset.creator?.name || asset.creator}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link href={`/asset/${asset.slug}`}>
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:scale-105 transition-transform">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Send className="w-4 h-4 mr-2" />
                        Transfer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset, index) => (
        <Card
          key={asset.id}
          className="overflow-hidden hover:shadow-xl transition-all duration-500 group animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative">
            <Link href={`/asset/${asset.slug}`}>
              <Image
                src={asset.image || "/placeholder.svg"}
                alt={asset.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
              />
            </Link>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-8 h-8 p-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="w-4 h-4 mr-2" />
                    Transfer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open External
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Metadata
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="absolute bottom-3 left-3">
              <Badge className="bg-background/90 text-foreground border-border/50 backdrop-blur-sm">
                {asset.iptype}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <Link href={`/asset/${asset.slug}`}>
              <h3 className="font-semibold text-foreground mb-2 truncate group-hover:text-primary transition-colors cursor-pointer">
                {asset.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{asset.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">License</span>
                <span className="font-medium text-foreground">{asset.license}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Creator</span>
                <span className="font-medium text-foreground">{asset.creator?.name || asset.creator}</span>
              </div>
            </div>

            {asset.attributes && asset.attributes.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {asset.attributes.slice(0, 2).map((attr: any, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                      {attr.trait_type}: {attr.value}
                    </Badge>
                  ))}
                  {asset.attributes.length > 2 && (
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      +{asset.attributes.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Link href={`/asset/${asset.slug}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="flex-1 hover:bg-secondary hover:scale-105 transition-all">
                <Send className="w-4 h-4 mr-1" />
                Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
