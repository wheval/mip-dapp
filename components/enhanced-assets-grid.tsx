"use client"

import type React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Eye, Sparkles, Clock } from "lucide-react"
import type { Asset } from "@/lib/types"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface EnhancedAssetsGridProps {
  assets: Asset[]
}

export default function EnhancedAssetsGrid({ assets }: EnhancedAssetsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {assets.map((asset, index) => (
        <AssetCard key={asset.id} asset={asset} index={index} />
      ))}
    </div>
  )
}

function AssetCard({ asset, index }: { asset: Asset; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate purchase process
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Purchase successful!",
        description: `You've purchased ${asset.name} for ${asset.price} ETH`,
        variant: "default",
      })
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          <Link href={`/assets/${asset.id}`}>
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={asset.image || "/placeholder.svg?height=300&width=300"}
                alt={asset.name}
                fill
                className="object-cover transition-transform duration-500"
                style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
              />

              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300"
                style={{ opacity: isHovered ? 1 : 0 }}
              />

              {asset.trending && (
                <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
          </Link>

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/assets/${asset.id}`} className="z-10">
              <Button variant="secondary" size="sm" className="gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>View</span>
              </Button>
            </Link>

            <Button variant="default" size="sm" className="gap-1 z-10" onClick={handleBuyNow} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Buying...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Buy Now</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-1">
            <Link href={`/assets/${asset.id}`} className="group">
              <h3 className="font-medium text-lg group-hover:text-primary transition-colors line-clamp-1">
                {asset.name}
              </h3>
            </Link>
          </div>

          <Link
            href={`/collections/${asset.collection.id}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {asset.collection.name}
          </Link>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{asset.description}</p>
        </CardContent>

        <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="text-lg font-bold">{asset.price} ETH</p>
          </div>

          <div className="flex items-center text-muted-foreground text-xs">
            <Clock className="h-3 w-3 mr-1" />
            <span>Listed recently</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
