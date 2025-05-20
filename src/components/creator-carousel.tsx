"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import Link from "next/link"
import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import type { User } from "@/src/lib/types"

interface CreatorCarouselProps {
  creators: User[]
}

export default function CreatorCarousel({ creators }: CreatorCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (!carouselRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    const scrollAmount = 300
    const newScrollLeft =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 py-2 px-1"
        onScroll={checkScrollButtons}
      >
        {creators.map((creator) => (
          <motion.div
            key={creator.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-shrink-0 w-[180px]"
          >
            <Card className="overflow-hidden h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.username} />
                    <AvatarFallback>{creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {creator.verified && (
                    <Badge className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Badge>
                  )}
                </div>

                <Link href={`/profile/${creator.id}`} className="font-medium hover:underline">
                  {creator.displayName}
                </Link>
                <p className="text-xs text-muted-foreground mb-2">@{creator.username}</p>

                <div className="flex items-center justify-center gap-2 text-xs mb-3">
                  <span>{creator.followers.toLocaleString()} followers</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{creator.contentCount} minted</span>
                </div>

                <Button size="sm" className="w-full">
                  Follow
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
