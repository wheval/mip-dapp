"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/src/components/header"
import { Navigation } from "@/src/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { AssetTemplate } from "@/src/components/asset-template"
import {
  Share,
  ExternalLink,
  Shield,
  Download,
  Send,
  MoreHorizontal,
  Copy,
  Calendar,
  Globe,
  FileText,
  Music,
  Play,
  Eye,
  ArrowLeft,
  Flag,
  Edit,
  UserPlus,
} from "lucide-react"
import { timelineAssets, portfolioAssets } from "@/src/lib/mock-data"
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
      return Eye
  }
}

export default function AssetPage() {
  const params = useParams()
  const router = useRouter()
  const [asset, setAsset] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const assetSlug = params.slug as string

    // Find asset in timeline or portfolio by slug
    let foundAsset = timelineAssets.find((a) => a.slug === assetSlug)
    if (!foundAsset) {
      foundAsset = portfolioAssets.find((a) => a.slug === assetSlug)
    }

    if (foundAsset) {
      setAsset(foundAsset)
      setIsOwner(foundAsset.creator?.username === "you" || foundAsset.creator === "You")
    }

    setLoading(false)
  }, [params.slug])

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied!",
      description: "Asset link copied to clipboard",
    })
  }

  const handleTransfer = () => {
    router.push(`/transfer?asset=${asset.slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <Header />
        <main className="pb-20">
          <div className="px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-96 bg-muted rounded-xl"></div>
                  <div className="space-y-4">
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <Header />
        <main className="pb-20">
          <div className="px-4 py-8">
            <div className="max-w-6xl mx-auto text-center py-16">
              <h1 className="text-2xl font-bold text-foreground mb-4">Asset Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The asset you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/")}>Back to Home</Button>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    )
  }

  const MediaIcon = getMediaIcon(asset.iptype)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">

      <main className="pb-20">
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-muted/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Media Section */}
              <div className="space-y-4">
                <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="relative group">
                    <Image
                      src={asset.image || "/placeholder.svg"}
                      alt={asset.name || asset.title}
                      width={600}
                      height={600}
                      className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {asset.animation_url && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="lg" className="rounded-full w-16 h-16 p-0">
                          <MediaIcon className="w-8 h-8" />
                        </Button>
                      </div>
                    )}

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
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleShare}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    License
                  </Button>
                  {isOwner && (
                    <>
                      <Button variant="outline" onClick={handleTransfer}>
                        <Send className="w-4 h-4 mr-2" />
                        Transfer
                      </Button>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-foreground mb-2">{asset.name || asset.title}</h1>
                      <p className="text-muted-foreground text-lg leading-relaxed">{asset.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleShare}>
                          <Share className="w-4 h-4 mr-2" />
                          Share Asset
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Explorer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Flag className="w-4 h-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Creator Info */}
                  <Card className="bg-muted/20 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={asset.creator?.avatar || "/placeholder.svg"}
                          alt={asset.creator?.name || asset.creator}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-border/50"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/creator/${asset.creator?.username || asset.creator?.id || "unknown"}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors"
                            >
                              {asset.creator?.name || asset.creator}
                            </Link>
                            {asset.creator?.verified && <Shield className="w-4 h-4 text-blue-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">Creator</p>
                        </div>
                        <Link href={`/creator/${asset.creator?.username || asset.creator?.id || "unknown"}`}>
                          <Button variant="outline" size="sm">
                            <UserPlus className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Info */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Asset Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Type</Label>
                        <div className="font-medium text-foreground">{asset.iptype}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">License</Label>
                        <div className="font-medium text-foreground">{asset.license}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Network</Label>
                        <div className="font-medium text-foreground">Starknet</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Created</Label>
                        <div className="font-medium text-foreground">{asset.timestamp || "Recently"}</div>
                      </div>
                    </div>

                    {asset.external_url && (
                      <div>
                        <Label className="text-sm text-muted-foreground">External Link</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={asset.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            View External Resource
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Protection Info */}
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Berne Convention Protection</h3>
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                          This intellectual property is protected under international copyright law with immutable
                          blockchain verification.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            181 Countries
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            50-70 Years
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            Immutable Record
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="template" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="template" className="data-[state=active]:bg-background">
                  Template
                </TabsTrigger>
                <TabsTrigger value="attributes" className="data-[state=active]:bg-background">
                  Attributes
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-background">
                  History
                </TabsTrigger>
                <TabsTrigger value="technical" className="data-[state=active]:bg-background">
                  Technical
                </TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="mt-6">
                <AssetTemplate asset={asset} />
              </TabsContent>

              <TabsContent value="attributes" className="mt-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Asset Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {asset.attributes && asset.attributes.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {asset.attributes.map((attr: any, index: number) => (
                          <div key={index} className="bg-muted/20 rounded-lg p-4">
                            <div className="text-sm text-muted-foreground mb-1">{attr.trait_type}</div>
                            <div className="font-medium text-foreground">{attr.value}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No attributes defined for this asset</p>
                      </div>
                    )}

                    {/* Tags */}
                    {asset.tags && asset.tags.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-foreground mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {asset.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Asset Created</div>
                          <div className="text-sm text-muted-foreground">Minted on Starknet</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{asset.timestamp || "Recently"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="mt-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Technical Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Token Standard</Label>
                          <div className="font-medium text-foreground">ERC-721</div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Blockchain</Label>
                          <div className="font-medium text-foreground">Starknet</div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Contract Address</Label>
                          <div className="font-mono text-sm text-foreground">0x1234...5678</div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Token ID</Label>
                          <div className="font-mono text-sm text-foreground">{asset.id}</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm text-muted-foreground">Metadata URI</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono flex-1">
                            https://api.mip.app/metadata/{asset.slug}
                          </code>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
