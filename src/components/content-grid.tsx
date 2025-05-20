import { Card, CardContent } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import type { Content } from "@/src/lib/types"

interface ContentGridProps {
  content: Content[]
}

export default function ContentGrid({ content }: ContentGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {content.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <Link href={`/content/${item.id}`}>
            <div className="relative aspect-square w-full">
              {item.type === "image" && (
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              )}
              {item.type === "video" && (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <p className="text-white">Video</p>
                </div>
              )}
            </div>
          </Link>

          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/content/${item.id}`} className="font-medium truncate hover:underline">
                {item.title}
              </Link>
              <div className="text-sm font-medium">{item.price} ETH</div>
            </div>

            <Link href={`/profile/${item.creator.id}`} className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={item.creator.avatar || "/placeholder.svg"} alt={item.creator.username} />
                <AvatarFallback>{item.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">@{item.creator.username}</span>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
