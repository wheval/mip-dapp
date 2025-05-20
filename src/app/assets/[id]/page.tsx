"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { getAssetById, getAssetHistory, getRelatedAssets, getAssetOffers } from "@/src/lib/mock-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ExternalLink,
  Share2,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  Heart,
  MessageCircle,
  Bookmark,
  Eye,
  Calendar,
  Tag,
  BarChart3,
  Clock,
  Zap,
  Info,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  TrendingUp,
} from "lucide-react"
import AssetProperties from "@/src/components/asset-properties"
import AssetHistory from "@/src/components/asset-history"
import ContentFeed from "@/src/components/content-feed"
import { Separator } from "@/src/components/ui/separator"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import CoinButton from "@/src/components/coin-button"
import AssetOffers from "@/src/components/asset-offers"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip"
import { useToast } from "@/src/components/ui/use-toast"

export default function AssetPage() {
  const params = useParams()
  const assetId = params.id as string
  const asset = getAssetById(assetId)
  const { toast } = useToast()
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(42)

  if (!asset) {
    notFound()
  }

  const history = getAssetHistory(assetId)
  const relatedAssets = getRelatedAssets(assetId)
  const offers = getAssetOffers(assetId)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("0x1a2b3c4d5e6f7g8h9i0j")
    setIsCopied(true)
    toast({
      title: "Address copied to clipboard",
      description: "The contract address has been copied to your clipboard.",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    toast({
      title: "Share options",
      description: "Sharing options would appear here in a production environment.",
    })
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Removed from saved items" : "Added to saved items",
      description: isSaved
        ? "This asset has been removed from your saved items."
        : "This asset has been added to your saved items.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Explore
            </Link>
            <span>/</span>
            <Link href={`/collections/${asset.collection.id}`} className="hover:text-foreground transition-colors">
              {asset.collection.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{asset.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left column - Asset image and properties */}
            <div className="lg:col-span-3 space-y-6">
              {/* Asset image with zoom functionality */}
              <Card className="overflow-hidden border shadow-sm relative group">
                <div
                  className={`relative ${isImageZoomed ? "aspect-auto h-[600px]" : "aspect-square"} w-full transition-all duration-300 cursor-zoom-in`}
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                >
                  <Image
                    src={asset.image || "/placeholder.svg?height=600&width=600"}
                    alt={asset.name}
                    fill
                    className={`object-contain transition-transform duration-500 ${isImageZoomed ? "scale-110" : ""}`}
                  />

                  {/* Zoom indicator */}
                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-4 w-4" />
                  </div>

                  {asset.trending && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary/90 hover:bg-primary">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* Asset navigation - Previous/Next */}
              <div className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Asset properties */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Properties</h3>
                  <Badge variant="outline" className="text-xs">
                    {asset.properties.length} properties
                  </Badge>
                </div>
                <AssetProperties properties={asset.properties} />
              </div>

              {/* Asset details tabs */}
              <Tabs defaultValue="history" className="w-full mt-6">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="history">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Transaction History
                  </TabsTrigger>
                  <TabsTrigger value="offers">
                    <Tag className="h-4 w-4 mr-2" />
                    Offers
                  </TabsTrigger>
                  <TabsTrigger value="related">
                    <Sparkles className="h-4 w-4 mr-2" />
                    More From Collection
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="history">
                  <AssetHistory history={history} />
                </TabsContent>

                <TabsContent value="offers">
                  <AssetOffers assetId={assetId} />
                </TabsContent>

                <TabsContent value="related">
                  <ContentFeed assets={relatedAssets.slice(0, 4)} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Asset details and actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Collection info */}
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/collections/${asset.collection.id}`} className="flex items-center gap-2 group">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={asset.collection.image || "/placeholder.svg"} alt={asset.collection.name} />
                    <AvatarFallback>{asset.collection.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm group-hover:text-primary transition-colors">{asset.collection.name}</span>
                </Link>
                {asset.collection.verified && (
                  <Badge variant="secondary" className="h-5 px-1">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    <span className="text-xs">Verified</span>
                  </Badge>
                )}
              </div>

              {/* Asset title */}
              <h1 className="text-3xl font-bold">{asset.name}</h1>

              {/* Creator and owner info */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Created by</span>
                  <Link href={`/profile/${asset.creator.id}`} className="flex items-center gap-2 hover:text-primary">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={asset.creator.avatar || "/placeholder.svg"} alt={asset.creator.username} />
                      <AvatarFallback>{asset.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{asset.creator.displayName}</span>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Owned by</span>
                  <Link href={`/profile/${asset.owner.id}`} className="flex items-center gap-2 hover:text-primary">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={asset.owner.avatar || "/placeholder.svg"} alt={asset.owner.username} />
                      <AvatarFallback>{asset.owner.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{asset.owner.displayName}</span>
                  </Link>
                </div>
              </div>

              {/* Asset stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Coined</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-2xl font-bold">{asset.coinedCount || 0}</p>
                    <Badge className="ml-2 bg-primary/10 text-primary border-primary/20 text-xs">
                      <Zap className="h-3 w-3 mr-0.5" />
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Trades</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-2xl font-bold">{asset.tradeCount || 0}</p>
                    <Badge className="ml-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      +12%
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Price history chart placeholder */}
              <Card className="overflow-hidden border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      Price History
                    </h3>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        1D
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        1W
                      </Button>
                      <Button variant="default" size="sm" className="h-7 px-2 text-xs">
                        1M
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        All
                      </Button>
                    </div>
                  </div>
                  <div className="h-40 w-full bg-muted/30 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Price chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Coin Button */}
              <Card className="shadow-sm border-0 overflow-hidden">
                <CardContent className="p-0">
                  <CoinButton asset={asset} size="large" />
                </CardContent>
              </Card>

              {/* Social actions */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    className={`gap-1 ${isLiked ? "bg-red-500 hover:bg-red-600 text-white border-red-500" : ""}`}
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    <span>{likeCount}</span>
                  </Button>

                  <Button variant="outline" size="sm" className="gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>Comment</span>
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>

                  <Button variant={isSaved ? "default" : "outline"} size="sm" className="gap-1" onClick={handleSave}>
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    <span>{isSaved ? "Saved" : "Save"}</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Asset description */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Description</h3>
                <p className="text-muted-foreground">{asset.description}</p>
              </div>

              <Separator />

              {/* Token info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Token Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Created</span>
                    </div>
                    <span className="font-medium">{new Date(asset.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Token ID</span>
                    </div>
                    <span className="font-medium">{asset.tokenId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Contract Address</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <code className="bg-muted px-2 py-0.5 rounded text-xs">0x1a2b...3c4d</code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyAddress}>
                              {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Copy contract address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Token Standard</span>
                    </div>
                    <span className="font-medium">ERC-721</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Blockchain</span>
                    </div>
                    <span className="font-medium">Starknet</span>
                  </div>
                </div>
              </div>

              {/* External links */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View on Explorer</span>
                </Button>

                <Button variant="outline" size="sm" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Metadata</span>
                </Button>

                <Button variant="outline" size="sm" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Original</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
