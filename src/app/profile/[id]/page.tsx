"use client"

import { useState, useEffect } from "react"
import { getUserProfile, getUserAssets, getUserCollections, getUserActivity } from "@/src/lib/mock-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Separator } from "@/src/components/ui/separator"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Input } from "@/src/components/ui/input"
import { useToast } from "@/src/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion"

// Icons
import {
  ExternalLink,
  Copy,
  Grid,
  Clock,
  Package,
  Share2,
  Sparkles,
  ArrowRightLeft,
  TrendingUp,
  Heart,
  MessageSquare,
  User,
  Search,
  Plus,
  ShieldCheck,
} from "lucide-react"

// Custom Components
import AssetsGrid from "@/src/components/assets-grid"
import CollectionsGrid from "@/src/components/collections-grid"
import LiveActivityFeed from "@/src/components/live-activity-feed"
import CoinButton from "@/src/components/coin-button"

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "feed">("feed")
  const [activeSection, setActiveSection] = useState<"assets" | "collections" | "activity">("assets")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const profile = getUserProfile(params.id)

  if (!profile && !isLoading) {
    notFound()
  }

  const assets = getUserAssets(params.id)
  const collections = getUserCollections(params.id)
  const activity = getUserActivity(params.id)

  // Derived data
  const isOwnProfile = params.id === "user1" // Mock check for own profile

  // Action handlers
  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? `You are no longer following ${profile?.displayName}`
        : `You are now following ${profile?.displayName}`,
    })
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("0x1a2b3c4d5e6f7g8h9i0j")
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    })
  }

  // Filter assets based on search query
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Loading state
  if (isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {/* Simplified Profile Header */}
          <div className="mb-6">
            {/* Banner Image */}
            <div className="relative h-32 w-full rounded-xl overflow-hidden mb-4">
              <Image
                src={profile?.bannerImage || "/placeholder.svg?height=400&width=1200"}
                alt="Profile banner"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Basic Profile Info */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar className="h-20 w-20 border-4 border-background rounded-full">
                <AvatarImage src={profile?.avatar || "/placeholder.svg?height=200&width=200"} alt={profile?.username} />
                <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-2xl font-bold">{profile?.displayName}</h1>
                  {profile?.verified && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground">@{profile?.username}</div>

                <div className="flex items-center gap-2 mt-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs">0x1a2b...3c4d</code>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyAddress}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                {isOwnProfile ? (
                  <Button size="sm" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button size="sm" variant={isFollowing ? "outline" : "default"} onClick={handleFollow}>
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant={activeSection === "assets" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection("assets")}
              >
                <Grid className="h-4 w-4 mr-2" />
                Assets
              </Button>
              <Button
                variant={activeSection === "collections" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection("collections")}
              >
                <Package className="h-4 w-4 mr-2" />
                Collections
              </Button>
              <Button
                variant={activeSection === "activity" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection("activity")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Activity
              </Button>
            </div>

            {activeSection === "assets" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    className="pl-9 w-full sm:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "feed" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none border-0"
                    onClick={() => setViewMode("feed")}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none border-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Asset Stream */}
          <div className="mb-8">
            {activeSection === "assets" && (
              <>
                {filteredAssets.length === 0 ? (
                  <EmptyState
                    title="No assets found"
                    description={
                      searchQuery
                        ? "Try a different search term"
                        : "This user hasn't created or collected any assets yet."
                    }
                    icon={<Grid className="h-12 w-12 text-muted-foreground/50" />}
                    action={
                      isOwnProfile && (
                        <Button asChild>
                          <Link href="/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Asset
                          </Link>
                        </Button>
                      )
                    }
                  />
                ) : viewMode === "grid" ? (
                  <AssetsGrid assets={filteredAssets} />
                ) : (
                  <AssetsFeed assets={filteredAssets} />
                )}
              </>
            )}

            {activeSection === "collections" && (
              <>
                {collections.length === 0 ? (
                  <EmptyState
                    title="No collections yet"
                    description="This user hasn't created any collections yet."
                    icon={<Package className="h-12 w-12 text-muted-foreground/50" />}
                    action={
                      isOwnProfile && (
                        <Button asChild>
                          <Link href="/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Collection
                          </Link>
                        </Button>
                      )
                    }
                  />
                ) : (
                  <CollectionsGrid collections={collections} />
                )}
              </>
            )}

            {activeSection === "activity" && <LiveActivityFeed activity={activity} />}
          </div>

          {/* Additional Information (Moved to Bottom) */}
          <div className="space-y-4 mt-8">
            <Accordion type="single" collapsible className="w-full">
              {/* User Details */}
              <AccordionItem value="details">
                <AccordionTrigger className="text-lg font-medium">About {profile?.displayName}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <p className="text-muted-foreground">{profile?.bio || "No bio provided"}</p>

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                      </Button>

                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Profile
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Stats */}
              <AccordionItem value="stats">
                <AccordionTrigger className="text-lg font-medium">Stats</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <StatCard label="Assets" value={assets.length.toString()} />
                    <StatCard label="Collections" value={collections.length.toString()} />
                    <StatCard label="Volume" value={`${profile?.volume.toFixed(2)} ETH`} />
                    <StatCard label="Followers" value="256" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Analytics */}
              <AccordionItem value="analytics">
                <AccordionTrigger className="text-lg font-medium">Analytics</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-card rounded-lg p-4 border">
                        <h3 className="text-sm font-medium mb-3">Trading Volume</h3>
                        <div className="h-48 w-full bg-muted/30 rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">Volume chart placeholder</p>
                        </div>
                      </div>

                      <div className="bg-card rounded-lg p-4 border">
                        <h3 className="text-sm font-medium mb-3">Portfolio Value</h3>
                        <div className="h-48 w-full bg-muted/30 rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">Value chart placeholder</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <EngagementStat icon={<Heart className="h-4 w-4 text-red-500" />} label="Likes" value="1.2K" />
                      <EngagementStat
                        icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
                        label="Comments"
                        value="348"
                      />
                      <EngagementStat icon={<Share2 className="h-4 w-4 text-green-500" />} label="Shares" value="156" />
                      <EngagementStat
                        icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
                        label="Trending"
                        value="8.7"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Component for stat cards
function StatCard({ label, value, icon = null }) {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardContent className="p-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-lg font-bold">{value}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Component for engagement stats
function EngagementStat({ icon, label, value }) {
  return (
    <div className="bg-card border rounded-lg p-3">
      <div className="flex items-center gap-2">
        <div className="bg-muted/50 p-1.5 rounded-full">{icon}</div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-base font-bold">{value}</div>
        </div>
      </div>
    </div>
  )
}

// Component for empty states
function EmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="bg-muted/30 rounded-full p-5 mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-5">{description}</p>
      {action}
    </div>
  )
}

// Component for assets feed (similar to home page)
function AssetsFeed({ assets }) {
  return (
    <div className="space-y-6">
      {assets.map((asset, index) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href={`/profile/${asset.creator.id}`} className="flex items-center gap-2 group">
                <Avatar className="h-8 w-8 border border-background">
                  <AvatarImage src={asset.creator.avatar || "/placeholder.svg"} alt={asset.creator.username} />
                  <AvatarFallback>{asset.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {asset.creator.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">@{asset.creator.username}</p>
                </div>
              </Link>

              <Link href={`/collections/${asset.collection.id}`}>
                <Badge variant="outline" className="group text-xs">
                  <span className="group-hover:text-primary transition-colors">{asset.collection.name}</span>
                </Badge>
              </Link>
            </div>

            <Link href={`/assets/${asset.id}`} className="block">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4">
                <Image
                  src={asset.image || "/placeholder.svg?height=600&width=600"}
                  alt={asset.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                {asset.trending && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/90 hover:bg-primary text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}
              </div>
            </Link>

            <div className="mb-4">
              <Link href={`/assets/${asset.id}`} className="block group">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{asset.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{asset.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted/40 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Coined</span>
                </div>
                <p className="text-base font-bold">{asset.coinedCount || 0}</p>
              </div>

              <div className="bg-muted/40 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Trades</span>
                </div>
                <p className="text-base font-bold">{asset.tradeCount || 0}</p>
              </div>
            </div>

            <CoinButton asset={asset} />

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="gap-1 text-xs" asChild>
                <Link href={`/assets/${asset.id}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Component for profile skeleton loading state
function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Banner Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-32 w-full rounded-xl mb-4" />

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />

            <div className="flex-1">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>

            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Controls Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}
