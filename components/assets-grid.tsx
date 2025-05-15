"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Asset } from "@/lib/types"

interface AssetsGridProps {
  assets: Asset[]
}

export default function AssetsGrid({ assets }: AssetsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {assets.map((asset, index) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -5 }}
        >
          <Card className="overflow-hidden h-full hover:border-primary/50 transition-colors">
            <Link href={`/assets/${asset.id}`}>
              <div className="relative aspect-square w-full">
                <Image
                  src={asset.image || "/placeholder.svg?height=300&width=300"}
                  alt={asset.name}
                  fill
                  className="object-cover"
                />
                {asset.trending && (
                  <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">Trending</Badge>
                )}
              </div>
            </Link>

            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-1">
                <Link href={`/assets/${asset.id}`}>
                  <h3 className="font-medium truncate hover:text-primary">{asset.name}</h3>
                </Link>
              </div>

              <div className="flex justify-between items-baseline">
                <Link
                  href={`/collections/${asset.collection.id}`}
                  className="text-xs text-muted-foreground hover:text-primary truncate"
                >
                  {asset.collection.name}
                </Link>
                <p className="text-sm font-medium">{asset.price} ETH</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
