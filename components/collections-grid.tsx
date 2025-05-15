"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShieldCheck, Users, Grid, ArrowRight, Coins, Paintbrush, ImageIcon } from "lucide-react"
import type { Collection } from "@/lib/types"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CollectionsGridProps {
  collections: Collection[]
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "stream">("stream")

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <div className="flex bg-muted/40 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0 rounded-md", viewMode === "stream" && "bg-background shadow-sm")}
            onClick={() => setViewMode("stream")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-list"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3" y1="6" y2="6" />
              <line x1="3" x2="3" y1="12" y2="12" />
              <line x1="3" x2="3" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Stream view</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0 rounded-md", viewMode === "grid" && "bg-background shadow-sm")}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {collections.map((collection, index) => (
          <CollectionItem key={collection.id} collection={collection} index={index} viewMode={viewMode} />
        ))}
      </div>
    </div>
  )
}

function CollectionItem({
  collection,
  index,
  viewMode,
}: {
  collection: Collection
  index: number
  viewMode: "grid" | "stream"
}) {
  // Generate a random number for coined count between 100-5000
  const coinedCount = Math.floor(Math.random() * 4900) + 100

  // Generate random categories for the collection
  const categories = [
    "Art",
    "Photography",
    "Music",
    "Video",
    "3D",
    "Animation",
    "Illustration",
    "Pixel Art",
    "Abstract",
    "Portrait",
    "Landscape",
  ]

  const randomCategories = Array.from(
    { length: Math.floor(Math.random() * 2) + 1 },
    () => categories[Math.floor(Math.random() * categories.length)],
  ).filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={cn(
          "overflow-hidden hover:border-primary/50 transition-colors shadow-sm hover:shadow-md",
          viewMode === "grid" ? "p-0" : "p-4",
        )}
      >
        <div className={cn("flex gap-4", viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row")}>
          {/* Collection Banner/Thumbnail */}
          <div
            className={cn(
              "relative overflow-hidden",
              viewMode === "grid"
                ? "w-full pt-[56.25%]" // 16:9 aspect ratio for grid
                : "w-full sm:w-64 h-40 sm:h-auto rounded-md", // Fixed width for stream
            )}
          >
            <Link href={`/collections/${collection.id}`} className="block absolute inset-0">
              <Image
                src={collection.bannerImage || "/placeholder.svg?height=200&width=400"}
                alt={collection.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-500",
                  viewMode === "stream" && "hover:scale-105",
                )}
              />
            </Link>

            {/* Collection Logo - Only show on grid view */}
            {viewMode === "grid" && (
              <div className="absolute -bottom-6 left-4">
                <div className="h-12 w-12 rounded-md overflow-hidden border-2 border-background bg-background">
                  <Image
                    src={collection.image || "/placeholder.svg?height=100&width=100"}
                    alt={`${collection.name} logo`}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collection Info */}
          <div className={cn("flex-1 min-w-0", viewMode === "grid" ? "p-4 pt-6" : "pt-0")}>
            <div className="flex items-start gap-3">
              {/* Collection Logo - Only show on stream view */}
              {viewMode === "stream" && (
                <div className="relative flex-shrink-0 hidden sm:block">
                  <div className="h-12 w-12 rounded-md overflow-hidden border border-muted bg-background">
                    <Image
                      src={collection.image || "/placeholder.svg?height=100&width=100"}
                      alt={`${collection.name} logo`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 min-w-0">
                {/* Collection Title and Verification */}
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className={cn("font-medium truncate", viewMode === "grid" ? "text-base" : "text-lg")}>
                    {collection.name}
                  </h3>
                  {collection.verified && <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />}
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-2 mb-2">
                  <Link href={`/profile/${collection.creator.id}`} className="flex items-center gap-1.5 group">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={collection.creator.avatar || "/placeholder.svg"}
                        alt={collection.creator.username}
                      />
                      <AvatarFallback>{collection.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                      {collection.creator.name || collection.creator.username}
                    </span>
                  </Link>

                  <span className="text-xs text-muted-foreground">Creator</span>
                </div>

                {/* Collection Categories */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {randomCategories.map((category, i) => (
                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Collection Stats */}
                <div
                  className={cn(
                    "grid gap-4 mb-4",
                    viewMode === "grid" ? "grid-cols-3" : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium">{collection.assetCount}</span>
                    <span className="text-xs text-muted-foreground">items</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium">{collection.ownerCount}</span>
                    <span className="text-xs text-muted-foreground">owners</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium">{coinedCount}</span>
                    <span className="text-xs text-muted-foreground">coined</span>
                  </div>

                  {viewMode === "stream" && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Paintbrush className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 1}</span>
                        <span className="text-xs text-muted-foreground">creators</span>
                      </div>

                      <div className="hidden md:flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M12 2v20" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 5) + 1}</span>
                        <span className="text-xs text-muted-foreground">drops</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Collection Description - Only on stream view */}
                {viewMode === "stream" && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 hidden sm:block">
                    {collection.description ||
                      `A unique collection of digital ${randomCategories.join(" and ")} created by talented artists from around the world. Explore the collection to discover amazing digital creations.`}
                  </p>
                )}

                {/* Action Button */}
                <Button variant="outline" size="sm" className="w-full sm:w-auto group" asChild>
                  <Link href={`/collections/${collection.id}`}>
                    View Collection
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
