"use client"

import { getUserAssets, getUserCollections, getUserProfile } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Wallet, BarChart3, Grid, LayoutList } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import ContentFeed from "@/components/content-feed"
import CollectionsGrid from "@/components/collections-grid"
import Image from "next/image"

export default function PortfolioPage() {
  // Using user1 as the mock logged-in user
  const profile = getUserProfile("user1")
  const assets = getUserAssets("user1")
  const collections = getUserCollections("user1")
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  if (!profile) {
    return <div>User not found</div>
  }

  const handleCopy = () => {
    navigator.clipboard.writeText("0x1a2b3c4d5e6f7g8h9i0j")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative">
            <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden">
              <Image
                src={profile.bannerImage || "/placeholder.svg?height=400&width=1200"}
                alt={profile.displayName}
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-16 left-8 border-4 border-background rounded-xl overflow-hidden">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar || "/placeholder.svg?height=200&width=200"} alt={profile.username} />
                <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="mt-20 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{profile.displayName}</h1>
                {profile.verified && (
                  <Badge variant="secondary" className="ml-2">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <code className="bg-muted px-2 py-1 rounded text-sm">{`0x1a2b...3c4d`}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <p className="mt-4 max-w-2xl">{profile.bio || "No bio provided"}</p>

              <div className="flex flex-wrap gap-6 mt-4">
                <div>
                  <p className="font-bold">{assets.length}</p>
                  <p className="text-muted-foreground text-sm">Assets</p>
                </div>
                <div>
                  <p className="font-bold">{collections.length}</p>
                  <p className="text-muted-foreground text-sm">Collections</p>
                </div>
                <div>
                  <p className="font-bold">{profile.volume.toFixed(2)} ETH</p>
                  <p className="text-muted-foreground text-sm">Volume</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button>
                <Wallet className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>

          <div className="mt-10">
            <Tabs defaultValue="assets" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="assets">My Assets</TabsTrigger>
                  <TabsTrigger value="collections">My Collections</TabsTrigger>
                  <TabsTrigger value="analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="gap-1.5"
                  >
                    <Grid className="h-4 w-4" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="gap-1.5"
                  >
                    <LayoutList className="h-4 w-4" />
                    List
                  </Button>
                </div>
              </div>

              <TabsContent value="assets">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {assets.map((asset) => (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="relative aspect-square w-full">
                            <Image
                              src={asset.image || "/placeholder.svg?height=300&width=300"}
                              alt={asset.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium truncate">{asset.name}</h3>
                            <div className="flex justify-between items-baseline mt-1">
                              <p className="text-xs text-muted-foreground truncate">{asset.collection.name}</p>
                              <p className="text-sm font-medium">{asset.price} ETH</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <ContentFeed assets={assets} />
                )}
              </TabsContent>

              <TabsContent value="collections">
                <CollectionsGrid collections={collections} />
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-lg p-6 border">
                    <h3 className="text-lg font-medium mb-4">Trading Volume</h3>
                    <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Volume chart placeholder</p>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-6 border">
                    <h3 className="text-lg font-medium mb-4">Portfolio Value</h3>
                    <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Value chart placeholder</p>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-6 border md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Collection Distribution</h3>
                    <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Distribution chart placeholder</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
