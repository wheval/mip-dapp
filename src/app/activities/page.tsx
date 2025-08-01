"use client"

import { Activities } from "@/src/components/activities"
import { activities } from "@/src/lib/mock-data"
import { toast } from "@/src/hooks/use-toast"




const transformedActivities = activities.map(activity => ({
  ...activity,
  hash: activity.txHash,
  type: activity.type === 'collection_create' || activity.type === 'collection_add' || activity.type === 'license' ? 'mint' as const : activity.type,
}))

export default function ActivitiesPage() {
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard",
    })
  }

  return (
    <Activities
      activities={transformedActivities}
      onCopyToClipboard={handleCopyToClipboard}
    />
  )
}