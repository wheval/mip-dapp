"use client"

import { IPCollectionBrowser } from "@/src/components/ip-collection-browser"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { Collection } from "@/src/types/asset"
import { getWalletData } from "@/src/app/onboarding/_actions"

export default function CollectionsPage() {
  const router = useRouter()
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined)

  const handleCollectionClick = (collection: Collection) => {
    router.push(`/collection/${collection.slug}`)
  }

  const handleCreateClick = () => {
    router.push("/create-collection")
  }

  // Load user wallet data on component mount
  useEffect(() => {
    const loadUserWallet = async () => {
      try {
        const walletData = await getWalletData()
        if (walletData?.publicKey) {
          setUserAddress(walletData.publicKey)
        }
      } catch (error) {
        console.error('Error loading user wallet:', error)
        // User not logged in or no wallet created - this is fine
      }
    }

    loadUserWallet()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <main className="pb-6">
        <div className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <IPCollectionBrowser
              title="IP Collections"
              subtitle="Discover curated collections of programmable intellectual property"
              onCollectionClick={handleCollectionClick}
              onCreateClick={handleCreateClick}
              userAddress={userAddress}
              variant="full"
              gridCols="3"
              cardVariant="default" 
              showHeader={true}
              showStats={true}
              showTabs={true}
              showFilters={true}
              showCreateButton={true}
              showViewToggle={true}
              enableSearch={true}
              enableSorting={true}
              enableCategoryFilter={true}
              enablePagination={true}
              className="animate-fade-in-up"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
