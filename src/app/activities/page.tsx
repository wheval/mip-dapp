"use client"

import { Activities } from "@/src/components/activities"
import { toast } from "@/src/hooks/use-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getWalletData } from "@/src/app/onboarding/_actions"
import { useActivities } from "@/src/hooks/use-activities"

export default function ActivitiesPage() {
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined)
  const startBlock = {
    mip: 1651476,
    collection: 1570147,
  }
  const router = useRouter()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const walletData = await getWalletData()
        if (!alive) return
        if (walletData?.publicKey) setUserAddress(walletData.publicKey)
      } catch (error) {
        console.error('Error loading user wallet:', error)
      }
    })()
    return () => { alive = false }
  }, [])

  const { activities, loading, error, onLoadMore } = useActivities({ userAddress, pageSize: 25, startBlock })

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied!", description: "Transaction hash copied to clipboard" })
  }

  const handleCreateNew = () => {
    router.push('/create-asset')
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Activities
        activities={activities}
        loading={loading}
        error={error}
        onCopyToClipboard={handleCopyToClipboard}
        onLoadMore={onLoadMore}
        usingMockData={false}
      />
    </div>
  )
}


