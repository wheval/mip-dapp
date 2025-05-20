"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Activity } from "@/src/lib/types"

interface LiveActivityFeedProps {
  activity: Activity[]
}

export default function LiveActivityFeed({ activity }: LiveActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activity.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.username} />
                  <AvatarFallback>{item.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/profile/${item.user.id}`} className="font-medium hover:underline">
                      {item.user.displayName}
                    </Link>

                    <span className="text-muted-foreground">
                      {item.type === "mint" && "minted"}
                      {item.type === "sale" && "purchased"}
                      {item.type === "listing" && "listed"}
                      {item.type === "offer" && "made an offer on"}
                    </span>

                    {item.asset && (
                      <Link href={`/assets/${item.asset.id}`} className="font-medium hover:underline">
                        {item.asset.name}
                      </Link>
                    )}

                    {item.price && (
                      <span className="text-muted-foreground">
                        for <span className="font-medium">{item.price} ETH</span>
                      </span>
                    )}

                    <Badge variant="outline" className="ml-auto">
                      {item.timeAgo}
                    </Badge>
                  </div>

                  {item.asset && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={item.asset.image || "/placeholder.svg?height=100&width=100"}
                          alt={item.asset.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.asset.name}</p>
                        <Link
                          href={`/collections/${item.asset.collection.id}`}
                          className="text-xs text-muted-foreground hover:text-primary"
                        >
                          {item.asset.collection.name}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
