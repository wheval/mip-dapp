"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/src/components/header"
import { Navigation } from "@/src/components/navigation"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer"
import {
  ArrowLeft,
  MapPin,
  Globe,
  Calendar,
  Eye,
  Heart,
  Briefcase,
  Share,
  MoreHorizontal,
  Search,
  ExternalLink,
  Twitter,
  Instagram,
  Copy,
  UserPlus,
  UserMinus,
  MessageCircle,
  Shield,
  TrendingUp,
  Info,
  Users,
  Star,
  Play,
  FileText,
  Music,
} from "lucide-react"
import { creators, timelineAssets } from "@/src/lib/mock-data"
import { toast } from "@/src/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

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

export default function CreatorPage() {
  const params = useParams()
  const router = useRouter()
  const [creator, setCreator] = useState<any>(null)
  const [creatorAssets, setCreatorAssets] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = params.username as string

    // Find creator by username
    const foundCreator = creators.find((c) => c.username === username)

    if (foundCreator) {
      setCreator(foundCreator)

      // Get creator's assets from timeline
      const assets = timelineAssets.filter(
        (asset) => asset.creator?.username === username || asset.creator?.id === foundCreator.id,
      )
      setCreatorAssets(assets)
    }

    setLoading(false)
  }, [params.username])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? `You unfollowed ${creator.name}` : `You are now following ${creator.name}`,
    })
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast({
      title: "Profile link copied!",
      description: "Creator profile link copied to clipboard",
    })
  }

  const filteredAssets = creatorAssets.filter((asset) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
 
        <main className="pb-20">
          <div className="px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <Header />
        <main className="pb-20">
          <div className="px-4 py-8">
            <div className="max-w-2xl mx-auto text-center py-16">
              <h1 className="text-2xl font-bold text-foreground mb-4">Creator Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The creator you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/")}>Back to Home</Button>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <Header />
      <main className="pb-20">
        <div className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-muted/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Creator Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <Image
                    src={creator.avatar || "/placeholder.svg"}
                    alt={creator.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-border/50 shadow-lg"
                  />
                  {creator.verified && (
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-background">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-foreground">{creator.name}</h1>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                          <Info className="w-4 h-4" />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle className="text-center">Creator Information</DrawerTitle>
                            <DrawerDescription className="text-center">
                              Learn more about {creator.name}
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4 pb-8">
                            <div className="space-y-6">
                              {/* Avatar and Basic Info */}
                              <div className="text-center">
                                <Image
                                  src={creator.avatar || "/placeholder.svg"}
                                  alt={creator.name}
                                  width={100}
                                  height={100}
                                  className="w-25 h-25 rounded-full object-cover mx-auto mb-4 ring-4 ring-border/50"
                                />
                                <h3 className="text-xl font-bold text-foreground mb-1">{creator.name}</h3>
                                <p className="text-muted-foreground mb-2">@{creator.username}</p>
                                {creator.verified && (
                                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verified Creator
                                  </Badge>
                                )}
                              </div>

                              {/* Bio */}
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">About</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">{creator.bio}</p>
                              </div>

                              {/* Stats */}
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-foreground">
                                    {creator.followers.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Followers</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-foreground">
                                    {creator.following.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Following</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-foreground">{creator.assets}</div>
                                  <div className="text-xs text-muted-foreground">Assets</div>
                                </div>
                              </div>

                              {/* Additional Info */}
                              <div className="space-y-3">
                                {creator.location && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-foreground">{creator.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 text-sm">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-foreground">Joined {creator.joined}</span>
                                </div>
                                {creator.website && (
                                  <a
                                    href={creator.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-sm text-primary hover:underline"
                                  >
                                    <Globe className="w-4 h-4" />
                                    <span>Website</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>

                              {/* Social Links */}
                              {(creator.twitter || creator.instagram) && (
                                <div>
                                  <h4 className="font-semibold text-foreground mb-3">Social Media</h4>
                                  <div className="space-y-2">
                                    {creator.twitter && (
                                      <a
                                        href={`https://twitter.com/${creator.twitter.replace("@", "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                      >
                                        <Twitter className="w-4 h-4" />
                                        <span>{creator.twitter}</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                    {creator.instagram && (
                                      <a
                                        href={`https://instagram.com/${creator.instagram.replace("@", "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                      >
                                        <Instagram className="w-4 h-4" />
                                        <span>{creator.instagram}</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="space-y-3">
                                <Button
                                  onClick={handleFollow}
                                  variant={isFollowing ? "outline" : "default"}
                                  className="w-full"
                                >
                                  {isFollowing ? (
                                    <>
                                      <UserMinus className="w-4 h-4 mr-2" />
                                      Unfollow
                                    </>
                                  ) : (
                                    <>
                                      <UserPlus className="w-4 h-4 mr-2" />
                                      Follow
                                    </>
                                  )}
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button variant="outline" size="sm">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={handleShare}>
                                    <Share className="w-4 h-4 mr-2" />
                                    Share
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                  <p className="text-muted-foreground mb-3">@{creator.username}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{creator.followers.toLocaleString()} followers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{creatorAssets.length} assets</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    className="w-20"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-1" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-20">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleShare}>
                        <Share className="w-4 h-4 mr-2" />
                        Share Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Bio */}
              <p className="text-foreground leading-relaxed mb-6">{creator.bio}</p>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 text-center">
                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {creator.totalViews?.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Views</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-red-900 dark:text-red-100">
                      {creator.totalLikes?.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300">Likes</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">{creatorAssets.length}</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Assets</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      {Math.floor(Math.random() * 100)}%
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Engagement</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>

                <div className="flex space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 bg-background/50">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-32 bg-background/50">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="publications">Publications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Timeline Assets */}
            <div className="space-y-8">
              {sortedAssets.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">No assets found</h3>
                  <p className="text-muted-foreground mb-6">
                    This creator hasn't published any assets yet or they don't match your filters
                  </p>
                </div>
              ) : (
                sortedAssets.map((asset, index) => (
                  <Card
                    key={asset.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
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
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">{asset.timestamp}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-9 h-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

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
                          {asset.attributes.slice(0, 4).map((attr: any, index: number) => (
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
                        {asset.tags.slice(0, 4).map((tag: string) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  )
}
