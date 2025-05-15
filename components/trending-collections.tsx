"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShieldCheck, TrendingUp } from "lucide-react"
import type { Collection } from "@/lib/types"

interface TrendingCollectionsProps {
  collections: Collection[]
}

export default function TrendingCollections({ collections }: TrendingCollectionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {collections.map((collection, index) => (
        <motion.div
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Link href={`/collections/${collection.id}`}>
            <Card className="overflow-hidden h-full hover:border-primary/50 transition-colors">
              <div className="relative aspect-video w-full">
                <Image
                  src={collection.bannerImage || "/placeholder.svg?height=200&width=400"}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden border-2 border-background">
                    <Image
                      src={collection.image || "/placeholder.svg?height=100&width=100"}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-medium text-white truncate">{collection.name}</h3>
                      {collection.verified && <ShieldCheck className="h-4 w-4 text-primary-foreground" />}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {collection.volumeChange > 0 ? "+" : ""}
                        {collection.volumeChange}%
                      </Badge>
                      <span className="text-xs text-white/80">{collection.volume.toFixed(2)} ETH volume</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {collection.featuredAssets?.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="relative aspect-square rounded-md overflow-hidden">
                      <Image
                        src={asset.image || "/placeholder.svg?height=100&width=100"}
                        alt={asset.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
