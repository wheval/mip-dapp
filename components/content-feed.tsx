"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Share2, Sparkles, ArrowRightLeft, ExternalLink } from "lucide-react"
import type { Asset } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import CoinButton from "@/components/coin-button"

interface ContentFeedProps {
  assets: Asset[]
}

export default function ContentFeed({ assets }: ContentFeedProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {assets.map((asset, index) => (
        <ContentCard key={asset.id} asset={asset} index={index} />
      ))}
    </div>
  )
}

function ContentCard({ asset, index }: { asset: Asset; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/profile/${asset.creator.id}`} className="flex items-center gap-2 group">
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src={asset.creator.avatar || "/placeholder.svg"} alt={asset.creator.username} />
              <AvatarFallback>{asset.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">{asset.creator.displayName}</p>
              <p className="text-xs text-muted-foreground">@{asset.creator.username}</p>
            </div>
          </Link>

          <Link href={`/collections/${asset.collection.id}`}>
            <Badge variant="outline" className="group">
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
                <Badge className="bg-primary/90 hover:bg-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              </div>
            )}
          </div>
        </Link>

        <div className="mb-4">
          <Link href={`/assets/${asset.id}`} className="block group">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{asset.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{asset.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/40 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Coined</span>
            </div>
            <p className="text-lg font-bold">{asset.coinedCount || 0}</p>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <ArrowRightLeft className="h-4 w-4" />
              <span className="font-medium">Trades</span>
            </div>
            <p className="text-lg font-bold">{asset.tradeCount || 0}</p>
          </div>
        </div>

        {/* New Coin Button Component */}
        <CoinButton asset={asset} />

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <Link href={`/assets/${asset.id}`}>
              <ExternalLink className="h-4 w-4" />
              <span>View Details</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
