import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Transaction } from "@/lib/types"
import { Coins, ArrowRightLeft } from "lucide-react"

interface AssetHistoryProps {
  history: Transaction[]
}

export default function AssetHistory({ history }: AssetHistoryProps) {
  return (
    <Card>
      <CardContent className="p-0 divide-y">
        {history.map((transaction) => (
          <div key={transaction.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={transaction.user.avatar || "/placeholder.svg"} alt={transaction.user.username} />
                  <AvatarFallback>{transaction.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-1">
                    <Link href={`/profile/${transaction.user.id}`} className="font-medium hover:underline">
                      {transaction.user.displayName}
                    </Link>
                    <span className="text-muted-foreground">
                      {transaction.type === "mint" && "minted"}
                      {transaction.type === "sale" && "purchased"}
                      {transaction.type === "listing" && "listed"}
                      {transaction.type === "coin" && (
                        <span className="flex items-center">
                          <Coins className="h-3.5 w-3.5 mx-1" />
                          coined
                        </span>
                      )}
                      {transaction.type === "transfer" && (
                        <span className="flex items-center">
                          <ArrowRightLeft className="h-3.5 w-3.5 mx-1" />
                          transferred to
                        </span>
                      )}
                    </span>
                    {transaction.to && (
                      <Link href={`/profile/${transaction.to.id}`} className="font-medium hover:underline">
                        {transaction.to.displayName}
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleString()}</p>
                </div>
              </div>

              {transaction.amount !== undefined && (
                <div className="text-right">
                  <p className="font-medium">{transaction.amount} ETH</p>
                  <p className="text-xs text-muted-foreground">≈ ${(transaction.amount * 3500).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
