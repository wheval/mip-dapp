"use client"

import { useState } from "react"
import { Header } from "@/src/components/header"
import { FloatingNavigation } from "@/src/components/floating-navigation"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  Search,
  ExternalLink,
  Copy,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Download,
} from "lucide-react"
import { activities } from "@/src/lib/mock-data"
import { toast } from "@/src/hooks/use-toast"

const activityIcons = {
  mint: Plus,
  transfer_out: Send,
  transfer_in: ArrowDownLeft,
  sale: ArrowUpRight,
}

const activityColors = {
  mint: "from-green-500 to-emerald-500",
  transfer_out: "from-blue-500 to-cyan-500",
  transfer_in: "from-purple-500 to-violet-500",
  sale: "from-orange-500 to-red-500",
}

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const statusIcons = {
  completed: CheckCircle,
  pending: Loader,
  failed: AlertCircle,
}

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || activity.type === filterType
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus
    const matchesTab = selectedTab === "all" || activity.type === selectedTab

    return matchesSearch && matchesType && matchesStatus && matchesTab
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">

      <main className="pb-6">
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Activity History</h1>
                  <p className="text-muted-foreground">Track your onchain transactions and IP activities</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {filteredActivities.length} Activities
                  </Badge>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <Card
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Activities</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">{stats.completed}</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300">Pending</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{stats.thisMonth}</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">This Month</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Filters and Tabs */}
            <div className="space-y-4 mb-6 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-muted/50">
                  <TabsTrigger value="all" className="data-[state=active]:bg-background">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="mint" className="data-[state=active]:bg-background">
                    Minted
                  </TabsTrigger>
                  <TabsTrigger value="transfer_out" className="data-[state=active]:bg-background">
                    Sent
                  </TabsTrigger>
                  <TabsTrigger value="transfer_in" className="data-[state=active]:bg-background">
                    Received
                  </TabsTrigger>
                  <TabsTrigger value="sale" className="data-[state=active]:bg-background">
                    Sales
                  </TabsTrigger>
                </TabsList>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-40 bg-background/50">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="mint">Minted</SelectItem>
                      <SelectItem value="transfer_out">Sent</SelectItem>
                      <SelectItem value="transfer_in">Received</SelectItem>
                      <SelectItem value="sale">Sales</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 bg-background/50">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <TabsContent value={selectedTab} className="mt-6">
                  <ActivityList activities={filteredActivities} copyToClipboard={copyToClipboard} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <FloatingNavigation />
    </div>
  )
}

function ActivityList({ activities, copyToClipboard }: { activities: any[]; copyToClipboard: (text: string) => void }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Clock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">No activities found</h3>
        <p className="text-muted-foreground mb-6">Your onchain activities will appear here or adjust your filters</p>
        <Button className="hover:scale-105 transition-transform">Create Your First IP</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type as keyof typeof activityIcons]
        const colorClass = activityColors[activity.type as keyof typeof activityColors]
        const StatusIcon = statusIcons[activity.status as keyof typeof statusIcons]
        const statusColorClass = statusColors[activity.status as keyof typeof statusColors]

        return (
          <Card
            key={activity.id}
            className="hover:shadow-lg transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={`text-xs ${statusColorClass} border-0`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {activity.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex-shrink-0">{activity.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs bg-muted/50">
                          {activity.network}
                        </Badge>
                        {activity.value && (
                          <span className="text-sm font-medium text-foreground">{activity.value}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {activity.txHash && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(activity.txHash)}
                            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy Hash
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {activity.txHash && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Transaction:</span>
                        <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">{activity.txHash}</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
