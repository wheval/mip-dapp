"use client"

import { IPCollectionBrowser } from "@/src/components/ip-collection-browser"
import { useRouter } from "next/navigation"
import type { Collection } from "@/src/types/asset"

export default function CollectionsPage() {
  const router = useRouter()

  const handleCollectionClick = (collection: Collection) => {
    router.push(`/collection/${collection.slug}`)
  }

  const handleCreateClick = () => {
    router.push("/create-collection")
  }

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
              enableRealData={false} // Set to true when MIP Protocol is deployed
              variant="full"
              gridCols="3"
              cardVariant="default" // Force all cards to use default variant for consistency
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
