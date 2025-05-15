import { Card, CardContent } from "@/components/ui/card"
import { getCollectionActivity } from "@/lib/mock-data"
import LiveActivityFeed from "@/components/live-activity-feed"

interface CollectionActivityProps {
  collectionId: string
}

export default function CollectionActivity({ collectionId }: CollectionActivityProps) {
  const activity = getCollectionActivity(collectionId)

  return (
    <Card>
      <CardContent className="p-6">
        <LiveActivityFeed activity={activity} />
      </CardContent>
    </Card>
  )
}
