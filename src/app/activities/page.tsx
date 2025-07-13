"use client"

import { useState, useMemo } from "react"
import { Header } from "@/src/components/header"
import { FloatingNavigation } from "@/src/components/floating-navigation"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { ActivityList } from "@/src/components/activity-list"
import { Pagination } from "@/src/components/pagination"
import {
  Search,
  Download,
  Filter,
  X,
  Activity,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles,
  BarChart3,
  Zap,
} from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

      <main className="pb-20">
        <div className="px-3 sm:px-4 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header Section */}
            <div className="mb-6 sm:mb-8 animate-fade-in-up">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 sm:p-8 mb-6 border border-primary/10">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl" />

                <div className="relative flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                        <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
                          Activity
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                          Track your onchain activities with real-time updates
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-200"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Insights</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-blue-50/50 to-background dark:from-blue-950/50 dark:via-blue-950/30 dark:to-background border-blue-200/50 dark:border-blue-800/30 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative p-4 sm:p-5 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                      {stats.total}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Total Activities
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="group relative overflow-hidden bg-gradient-to-br from-green-50/80 via-green-50/50 to-background dark:from-green-950/50 dark:via-green-950/30 dark:to-background border-green-200/50 dark:border-green-800/30 hover:shadow-xl hover:shadow-green-500/10 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative p-4 sm:p-5 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100 mb-1">
                      {stats.completed}
                    </div>
                    <div className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">Completed</div>
                  </CardContent>
                </Card>

                <Card
                  className="group relative overflow-hidden bg-gradient-to-br from-amber-50/80 via-amber-50/50 to-background dark:from-amber-950/50 dark:via-amber-950/30 dark:to-background border-amber-200/50 dark:border-amber-800/30 hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative p-4 sm:p-5 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-100 mb-1">
                      {stats.pending}
                    </div>
                    <div className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium">Pending</div>
                  </CardContent>
                </Card>

                <Card
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-50/80 via-purple-50/50 to-background dark:from-purple-950/50 dark:via-purple-950/30 dark:to-background border-purple-200/50 dark:border-purple-800/30 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative p-4 sm:p-5 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                      {stats.thisMonth}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium">
                      This Month
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Enhanced Search and Filter Section */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Enhanced Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl blur-xl" />
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities, transactions, or descriptions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 pr-4 h-12 bg-background/80 backdrop-blur-sm border-border/50 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Enhanced Filter Toggle Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-12 px-6 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background hover:scale-105 transition-all duration-200 shadow-sm ${
                    hasActiveFilters ? "border-primary/50 text-primary bg-primary/5" : ""
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="font-medium">Filters</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground border-0 shadow-sm">
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

              {/* Enhanced Expandable Filters */}
              {showFilters && (
                <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl animate-fade-in-up overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2" />
                  <CardContent className="relative p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                          <Filter className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Filter Options</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(false)}
                        className="h-8 w-8 p-0 hover:bg-muted/50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-primary" />
                          <span>Activity Type</span>
                        </label>
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="h-11 bg-background/50 border-border/50 hover:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-lg">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/50 shadow-xl">
                            <SelectItem value="all" className="rounded-lg">
                              All Types
                            </SelectItem>
                            <SelectItem value="mint" className="rounded-lg">
                              Minted
                            </SelectItem>
                            <SelectItem value="transfer_out" className="rounded-lg">
                              Sent
                            </SelectItem>
                            <SelectItem value="transfer_in" className="rounded-lg">
                              Received
                            </SelectItem>
                            <SelectItem value="sale" className="rounded-lg">
                              Sales
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span>Status</span>
                        </label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="h-11 bg-background/50 border-border/50 hover:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-lg">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/50 shadow-xl">
                            <SelectItem value="all" className="rounded-lg">
                              All Status
                            </SelectItem>
                            <SelectItem value="completed" className="rounded-lg">
                              Completed
                            </SelectItem>
                            <SelectItem value="pending" className="rounded-lg">
                              Pending
                            </SelectItem>
                            <SelectItem value="failed" className="rounded-lg">
                              Failed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          <span className="text-sm text-muted-foreground font-medium">
                            {filteredActivities.length} of {activities.length} activities
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Active Filters Display */}
              {hasActiveFilters && !showFilters && (
                <div className="flex flex-wrap gap-2 mt-4 animate-fade-in-up">
                  {searchQuery && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors rounded-lg px-3 py-1"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      Search: "{searchQuery}"
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                  {filterType !== "all" && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors rounded-lg px-3 py-1"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Type: {typeLabels[filterType as keyof typeof typeLabels]}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilterType("all")}
                        className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                  {filterStatus !== "all" && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors rounded-lg px-3 py-1"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Status: {filterStatus}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilterStatus("all")}
                        className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Activities List */}
            <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <ActivityList
                activities={paginatedActivities}
                copyToClipboard={copyToClipboard}
                emptyStateTitle="No activities found"
                emptyStateDescription="Your onchain activities will appear here. Try adjusting your filters or create your first IP asset."
                emptyStateAction={
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-200">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Your First IP
                    </Button>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="hover:scale-105 transition-transform bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                }
              />
            </div>

            {/* Enhanced Pagination */}
            {filteredActivities.length > 0 && (
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-sm">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredActivities.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
