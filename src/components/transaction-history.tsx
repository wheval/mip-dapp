import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import Link from "next/link"
import type { Transaction } from "@/src/lib/types"

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={transaction.user.avatar || "/placeholder.svg"} alt={transaction.user.username} />
                  <AvatarFallback>{transaction.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-1">
                    <Link href={`/profile/${transaction.user.id}`} className="font-medium text-sm hover:underline">
                      @{transaction.user.username}
                    </Link>
                    <span className="text-sm">{transaction.type}</span>
                    {transaction.to && (
                      <>
                        <span className="text-sm">to</span>
                        <Link href={`/profile/${transaction.to.id}`} className="font-medium text-sm hover:underline">
                          @{transaction.to.username}
                        </Link>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()} at{" "}
                    {new Date(transaction.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium">{transaction.amount} ETH</p>
                <p className="text-xs text-muted-foreground">≈ ${(transaction.amount * 3500).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
