"use client"

import { useState, useMemo } from "react"
import { Header } from "@/src/components/header"
import { FloatingNavigation } from "@/src/components/floating-navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { NotificationList } from "@/src/components/notification-list"
import { Pagination } from "@/src/components/pagination"
import { Search, Filter, X, Bell, CheckCircle, AlertCircle, Calendar } from "lucide-react"

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
  {
    id: "7",
    type: "info",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM UTC. Some features may be temporarily unavailable.",
    time: "1 week ago",
    date: "2024-01-19",
    read: true,
  },
  {
    id: "8",
    type: "success",
    title: "Payment Received",
    message: "You received 1.2 ETH for the sale of 'Digital Landscape #3'. Funds are now available in your wallet.",
    time: "1 week ago",
    date: "2024-01-18",
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterRead, setFilterRead] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = filterType === "all" || notification.type === filterType
      const matchesRead =
        filterRead === "all" ||
        (filterRead === "unread" && !notification.read) ||
        (filterRead === "read" && notification.read)

      return matchesSearch && matchesType && matchesRead
    })
  }, [notifications, searchQuery, filterType, filterRead])

  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredNotifications.slice(startIndex, endIndex)
  }, [filteredNotifications, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setFilterRead("all")
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || filterType !== "all" || filterRead !== "all"

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const getNotificationStats = () => {
    const total = notifications.length
    const unread = notifications.filter((n) => !n.read).length
    const success = notifications.filter((n) => n.type === "success").length
    const thisWeek = notifications.filter((n) => {
      const notificationDate = new Date(n.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return notificationDate >= weekAgo
    }).length

    return { total, unread, success, thisWeek }
  }

  const stats = getNotificationStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">

      <main className="pb-20">
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 animate-fade-in-up">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Notifications</h1>
                      <p className="text-sm text-muted-foreground">Stay updated with your latest activities</p>
                    </div>
                  </div>
                  {stats.unread > 0 && (
                    <Button onClick={markAllAsRead} variant="outline" size="sm" className="hidden sm:flex">
                      Mark all as read ({stats.unread})
                    </Button>
                  )}
                </div>

                {/* Mobile Mark All Read Button */}
                {stats.unread > 0 && (
                  <Button onClick={markAllAsRead} variant="outline" size="sm" className="sm:hidden w-full">
                    Mark all as read ({stats.unread})
                  </Button>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <Card
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.unread}
                    </div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">Unread</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-green-900 dark:text-green-100">
                      {stats.success}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">Success</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-100">
                      {stats.thisWeek}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">This Week</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/80 backdrop-blur-sm border-border/50 focus:bg-background"
                  />
                </div>

                {/* Filter Toggle Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background ${
                    hasActiveFilters ? "border-primary text-primary" : ""
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                      {
                        [
                          searchQuery && "search",
                          filterType !== "all" && "type",
                          filterRead !== "all" && "read",
                        ].filter(Boolean).length
                      }
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Expandable Filters */}
              {showFilters && (
                <Card className="bg-background/80 backdrop-blur-sm border-border/50 animate-fade-in-up">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Filter Options</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Notification Type</label>
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="activity">Activity</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Read Status</label>
                        <Select value={filterRead} onValueChange={setFilterRead}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="unread">Unread</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {filteredNotifications.length} of {notifications.length} notifications
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Clear All
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Active Filters Display */}
              {hasActiveFilters && !showFilters && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Search: "{searchQuery}"
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                  {filterType !== "all" && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Type: {filterType}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilterType("all")}
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                  {filterRead !== "all" && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Status: {filterRead}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilterRead("all")}
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
              <NotificationList
                notifications={paginatedNotifications}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            </div>

            {/* Pagination */}
            {filteredNotifications.length > 0 && (
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredNotifications.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
