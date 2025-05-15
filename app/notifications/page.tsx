import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getNotifications } from "@/lib/mock-data"

export default function NotificationsPage() {
  const notifications = getNotifications()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Badge variant="outline" className="px-2 py-1">
          {notifications.length} new
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0 divide-y">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 ${notification.unread ? "bg-muted/30" : ""}`}>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={notification.user.avatar || "/placeholder.svg"}
                        alt={notification.user.username}
                      />
                      <AvatarFallback>{notification.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                          {notification.user.displayName}
                        </Link>
                        {notification.unread && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                      </div>

                      <p className="text-sm mt-1">{notification.message}</p>

                      {notification.contentId && (
                        <Link
                          href={`/content/${notification.contentId}`}
                          className="text-sm text-primary hover:underline mt-1 block"
                        >
                          View content
                        </Link>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentions">
          <Card>
            <CardContent className="p-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No mentions yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0 divide-y">
              {notifications
                .filter((n) => n.type === "transaction")
                .map((notification) => (
                  <div key={notification.id} className={`p-4 ${notification.unread ? "bg-muted/30" : ""}`}>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={notification.user.avatar || "/placeholder.svg"}
                          alt={notification.user.username}
                        />
                        <AvatarFallback>{notification.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                            {notification.user.displayName}
                          </Link>
                          {notification.unread && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                        </div>

                        <p className="text-sm mt-1">{notification.message}</p>

                        {notification.contentId && (
                          <Link
                            href={`/content/${notification.contentId}`}
                            className="text-sm text-primary hover:underline mt-1 block"
                          >
                            View transaction
                          </Link>
                        )}

                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
