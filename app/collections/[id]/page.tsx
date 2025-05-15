import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getCollectionById, getAssetsByCollection } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Share2, Info, BarChart3 } from "lucide-react"
import AssetsGrid from "@/components/assets-grid"
import CollectionStats from "@/components/collection-stats"
import CollectionActivity from "@/components/collection-activity"

export default function CollectionPage({ params }: { params: { id: string } }) {
  const collection = getCollectionById(params.id)

  if (!collection) {
    notFound()
  }

  const assets = getAssetsByCollection(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative">
        <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden">
          <Image
            src={collection.bannerImage || "/placeholder.svg?height=400&width=1200"}
            alt={collection.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute -bottom-16 left-8 border-4 border-background rounded-xl overflow-hidden">
          <Avatar className="h-32 w-32">
            <AvatarImage src={collection.image || "/placeholder.svg?height=200&width=200"} alt={collection.name} />
            <AvatarFallback>{collection.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{collection.name}</h1>
            {collection.verified && (
              <Badge variant="secondary" className="ml-2">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Created by{" "}
            <Link href={`/profile/${collection.creator.id}`} className="text-primary hover:underline">
              {collection.creator.displayName}
            </Link>
          </p>
          <p className="mt-4 max-w-2xl">{collection.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </Button>
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-2" />
            Report
          </Button>
        </div>
      </div>

      <CollectionStats collection={collection} className="mt-8" />

      <Tabs defaultValue="items" className="w-full mt-8">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="items">Items ({assets.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <AssetsGrid assets={assets} />
        </TabsContent>

        <TabsContent value="activity">
          <CollectionActivity collectionId={collection.id} />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-medium mb-4">Price History</h3>
              <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Price chart placeholder</p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-medium mb-4">Volume History</h3>
              <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Volume chart placeholder</p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Ownership Distribution</h3>
              <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Distribution chart placeholder</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
