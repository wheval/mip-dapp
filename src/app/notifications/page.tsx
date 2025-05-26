"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Input } from "@/src/components/ui/input"
import { CheckCircle, AlertCircle, Info, TrendingUp, Search, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "activity"
  title: string
  message: string
  time: string
  date: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Asset Tokenized Successfully",
    message:
      "Your digital artwork 'Cosmic Dreams' has been successfully tokenized and is now available on the marketplace.",
    time: "2 minutes ago",
    date: "2024-01-26",
    read: false,
  },
  {
    id: "2",
    type: "activity",
    title: "New Bid Received",
    message: "Someone placed a bid of 0.5 ETH on your 'Abstract Vision' asset. Review the offer in your portfolio.",
    time: "1 hour ago",
    date: "2024-01-26",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "License Agreement Updated",
    message: "Your licensing terms for 'Digital Masterpiece' have been updated according to your recent changes.",
    time: "3 hours ago",
    date: "2024-01-26",
    read: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Verification Required",
    message: "Please verify your identity to complete the asset transfer. This is required for security purposes.",
    time: "1 day ago",
    date: "2024-01-25",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Transfer Completed",
    message: "Your asset 'Modern Art Collection #1' has been successfully transferred to 0x1234...5678.",
    time: "2 days ago",
    date: "2024-01-24",
    read: true,
  },
  {
    id: "6",
    type: "activity",
    title: "New Follower",
    message: "ArtCollector_2024 started following your profile. Check out their collection!",
    time: "3 days ago",
    date: "2024-01-23",
    read: true,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case "warning":
      return <AlertCircle className="w-5 h-5 text-orange-500" />
    case "activity":
      return <TrendingUp className="w-5 h-5 text-blue-500" />
    default:
      return <Info className="w-5 h-5 text-blue-500" />
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !notification.read
    if (activeTab === "read") return matchesSearch && notification.read
    return matchesSearch && notification.type === activeTab
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your latest activities</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                Mark all as read ({unreadCount})
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="success">Success</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="warning">Warning</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No notifications found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-all duration-200 hover:shadow-md ${
                      !notification.read ? "border-primary/50 bg-primary/5" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground">{notification.title}</h3>
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {notification.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.read && (
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => deleteNotification(notification.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
