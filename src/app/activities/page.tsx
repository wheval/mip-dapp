"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { ActivityList } from "@/src/components/activity-list"
import { Pagination } from "@/src/components/pagination"
import { Search, Download, Filter, X, Activity, Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { activities } from "@/src/lib/mock-data"
import { toast } from "@/src/hooks/use-toast"

const typeLabels = {
  mint: "Minted",
  transfer_out: "Sent",
  transfer_in: "Received",
  sale: "Sales",
}

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || activity.type === filterType
      const matchesStatus = filterStatus === "all" || activity.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchQuery, filterType, filterStatus])

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredActivities.slice(startIndex, endIndex)
  }, [filteredActivities, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard",
    })
  }

  const getActivityStats = () => {
    const total = activities.length
    const completed = activities.filter((a) => a.status === "completed").length
    const pending = activities.filter((a) => a.status === "pending").length
    const thisMonth = activities.filter((a) => {
      const activityDate = new Date()
      const currentDate = new Date()
      return activityDate.getMonth() === currentDate.getMonth()
    }).length

    return { total, completed, pending, thisMonth }
  }

  const stats = getActivityStats()

  const clearFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setFilterStatus("all")
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || filterType !== "all" || filterStatus !== "all"

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

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
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Activity History</h1>
                      <p className="text-sm text-muted-foreground">Track your onchain transactions and IP activities</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex hover:scale-105 transition-transform">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                {/* Mobile Export Button */}
                <Button variant="outline" size="sm" className="sm:hidden w-full hover:scale-105 transition-transform">
                  <Download className="w-4 h-4 mr-2" />
                  Export Activities
                </Button>
              </div>

              {/* Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <Card
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-green-900 dark:text-green-100">
                      {stats.completed}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-yellow-900 dark:text-yellow-100">
                      {stats.pending}
                    </div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300">Pending</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-100">
                      {stats.thisMonth}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">This Month</div>
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
                    placeholder="Search activities..."
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
                          filterStatus !== "all" && "status",
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
                        <label className="text-sm font-medium text-foreground mb-2 block">Activity Type</label>
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="mint">Minted</SelectItem>
                            <SelectItem value="transfer_out">Sent</SelectItem>
                            <SelectItem value="transfer_in">Received</SelectItem>
                            <SelectItem value="sale">Sales</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {filteredActivities.length} of {activities.length} activities
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
                      Type: {typeLabels[filterType as keyof typeof typeLabels]}
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
                  {filterStatus !== "all" && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Status: {filterStatus}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilterStatus("all")}
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Activities List */}
            <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
              <ActivityList activities={paginatedActivities} copyToClipboard={copyToClipboard} />
            </div>

            {/* Pagination */}
            {filteredActivities.length > 0 && (
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredActivities.length}
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
