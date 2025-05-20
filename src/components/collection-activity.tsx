import { Card, CardContent } from "@/src/components/ui/card"
import { getCollectionActivity } from "@/src/lib/mock-data"
import LiveActivityFeed from "@/src/components/live-activity-feed"

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
