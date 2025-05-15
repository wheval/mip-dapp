import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getContentById, getRelatedContent, getContentTransactions } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import ContentGrid from "@/components/content-grid"
import TransactionHistory from "@/components/transaction-history"

export default function ContentPage({ params }: { params: { id: string } }) {
  const content = getContentById(params.id)

  if (!content) {
    notFound()
  }

  const relatedContent = getRelatedContent(params.id)
  const transactions = getContentTransactions(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-square md:aspect-video w-full">
              {content.type === "image" && (
                <Image src={content.url || "/placeholder.svg"} alt={content.title} fill className="object-cover" />
              )}
              {content.type === "video" && (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <p className="text-white">Video Player Placeholder</p>
                </div>
              )}
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{content.title}</CardTitle>
                  <CardDescription>Minted on {new Date(content.createdAt).toLocaleDateString()}</CardDescription>
                </div>
                <Badge variant="outline" className="px-3">
                  {content.tokenId}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <Link href={`/profile/${content.creator.id}`} className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={content.creator.avatar || "/placeholder.svg"} alt={content.creator.username} />
                    <AvatarFallback>{content.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{content.creator.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{content.creator.username}</p>
                  </div>
                </Link>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="mb-6">{content.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  {content.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {content.comments}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Current Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{content.price} ETH</p>
                    <p className="text-sm text-muted-foreground">≈ ${(content.price * 3500).toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Creator Royalty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{content.royalty}%</p>
                    <p className="text-sm text-muted-foreground">On secondary sales</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full">Buy Now</Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="transactions" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="details">Token Details</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions">
              <TransactionHistory transactions={transactions} />
            </TabsContent>
            <TabsContent value="comments">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Comments coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Token ID</span>
                      <span className="font-medium">{content.tokenId}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Contract Address</span>
                      <span className="font-medium">0x1a2b...3c4d</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Blockchain</span>
                      <span className="font-medium">Starknet</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Token Standard</span>
                      <span className="font-medium">ERC-721</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Minted</span>
                      <span className="font-medium">{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Current Owner</span>
                      <Link href={`/profile/${content.owner.id}`} className="font-medium text-primary">
                        @{content.owner.username}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>More from this creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {relatedContent.slice(0, 4).map((item) => (
                  <Link href={`/content/${item.id}`} key={item.id} className="group">
                    <div className="relative aspect-square rounded-md overflow-hidden">
                      <Image
                        src={item.url || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="mt-1 text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.price} ETH</p>
                  </Link>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                View All
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Content Coin</CardTitle>
              <CardDescription>Trade this creator's token</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={content.creator.avatar || "/placeholder.svg"} alt={content.creator.username} />
                  <AvatarFallback>{content.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{content.creator.displayName} Coin</p>
                  <p className="text-sm text-muted-foreground">${content.creator.coinPrice}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-medium text-green-500">+{content.creator.coinChange}%</p>
                  <p className="text-xs text-muted-foreground">24h</p>
                </div>
              </div>

              <div className="h-24 w-full bg-muted rounded-md mb-4">
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Price chart placeholder</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button>Buy</Button>
                <Button variant="outline">Sell</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <ContentGrid content={relatedContent} />
      </section>
    </div>
  )
}
