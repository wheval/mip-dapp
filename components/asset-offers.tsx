import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getAssetOffers } from "@/lib/mock-data"

interface AssetOffersProps {
  assetId: string
}

export default function AssetOffers({ assetId }: AssetOffersProps) {
  const offers = getAssetOffers(assetId)

  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No offers yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0 divide-y">
        {offers.map((offer) => (
          <div key={offer.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={offer.user.avatar || "/placeholder.svg"} alt={offer.user.username} />
                  <AvatarFallback>{offer.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-1">
                    <Link href={`/profile/${offer.user.id}`} className="font-medium hover:underline">
                      {offer.user.displayName}
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground">Expires in {offer.expiresIn}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium">{offer.amount} ETH</p>
                  <p className="text-xs text-muted-foreground">≈ ${(offer.amount * 3500).toLocaleString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Decline
                  </Button>
                  <Button size="sm">Accept</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
