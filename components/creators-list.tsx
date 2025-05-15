import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { User } from "@/lib/types"

interface CreatorsListProps {
  creators: User[]
}

export default function CreatorsList({ creators }: CreatorsListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {creators.map((creator) => (
        <Card key={creator.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.username} />
                <AvatarFallback>{creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <Link href={`/profile/${creator.id}`} className="font-medium hover:underline">
                  {creator.displayName}
                </Link>
                <p className="text-sm text-muted-foreground truncate">@{creator.username}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs">{creator.followers.toLocaleString()} followers</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs">{creator.contentCount} minted</span>
                </div>
              </div>

              <Button size="sm" variant="outline">
                Follow
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
