"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { ExternalLink, Users, BarChart3, ShieldCheck, Info, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Collection } from "@/lib/types"

interface FeaturedCollectionBannerProps {
  collection: Collection
}

export default function FeaturedCollectionBanner({ collection }: FeaturedCollectionBannerProps) {
  const stats = [
    {
      label: "Floor Price",
      value: `${collection.floorPrice} ETH`,
      icon: <BarChart3 className="h-4 w-4 text-primary" />,
    },
    {
      label: "Items",
      value: collection.assetCount.toLocaleString(),
      icon: <Info className="h-4 w-4 text-primary" />,
    },
    {
      label: "Owners",
      value: collection.ownerCount.toLocaleString(),
      icon: <Users className="h-4 w-4 text-primary" />,
    },
    {
      label: "Volume",
      value: `${collection.volume.toFixed(2)} ETH`,
      change: collection.volumeChange,
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors relative">
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <Image
            src={collection.bannerImage || "/placeholder.svg?height=400&width=1200"}
            alt={collection.name}
            fill
            className="object-cover blur-sm opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-20 w-20 md:h-28 md:w-28 rounded-lg overflow-hidden border-4 border-background bg-muted shadow-lg"
              >
                <Image
                  src={collection.image || "/placeholder.svg?height=200&width=200"}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                    Featured Collection
                  </Badge>
                  {collection.verified && (
                    <Badge className="bg-green-500 text-white">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{collection.name}</h2>

                <div className="flex items-center gap-2">
                  <span className="text-white/70 text-sm">Created by</span>
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={collection.creator.avatar || "/placeholder.svg"}
                        alt={collection.creator.username}
                      />
                      <AvatarFallback>{collection.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Link href={`/profile/${collection.creator.id}`} className="group">
                      <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                        {collection.creator.displayName}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-white/80 max-w-2xl mb-4 line-clamp-2 hidden md:block">{collection.description}</p>

            <div className="flex flex-wrap gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                  className="bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 flex flex-col justify-center"
                >
                  <div className="flex items-center gap-1 mb-1">
                    {stat.icon}
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{stat.value}</span>
                    {stat.change !== undefined && (
                      <span className={`text-xs ${stat.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {stat.change >= 0 ? "+" : ""}
                        {stat.change}%
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="ml-auto"
              >
                <Button asChild className="h-full">
                  <Link href={`/collections/${collection.id}`}>View Collection</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
