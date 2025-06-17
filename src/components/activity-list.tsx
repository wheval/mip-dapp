"use client"

import type React from "react"

import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  ExternalLink,
  Copy,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react"

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

interface ActivityListProps {
  activities: any[]
  copyToClipboard: (text: string) => void
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateAction?: React.ReactNode
  className?: string
}

export function ActivityList({
  activities,
  copyToClipboard,
  emptyStateTitle = "No activities found",
  emptyStateDescription = "Your onchain activities will appear here or adjust your filters to see more results",
  emptyStateAction,
  className = "",
}: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className={`text-center py-16 animate-fade-in-up ${className}`}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">{emptyStateTitle}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">{emptyStateDescription}</p>
        {emptyStateAction || <Button className="hover:scale-105 transition-transform">Create Your First IP</Button>}
      </div>
    )
  }

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type as keyof typeof activityIcons] || Plus
        const colorClass = activityColors[activity.type as keyof typeof activityColors]
        const StatusIcon = statusIcons[activity.status as keyof typeof statusIcons] || Clock
        const statusColorClass = statusColors[activity.status as keyof typeof statusColors]

        return (
          <Card
            key={activity.id}
            className="hover:shadow-lg transition-all duration-300 group border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:bg-card"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base line-clamp-1">
                        {activity.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2">
                      <Badge className={`text-xs ${statusColorClass} border-0 flex items-center`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{activity.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs bg-muted/50 border-border/50">
                        {activity.network}
                      </Badge>
                      {activity.value && (
                        <span className="text-xs sm:text-sm font-medium text-foreground">{activity.value}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {activity.txHash && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(activity.txHash)}
                            className="text-xs h-8 px-2 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Copy</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8 px-2 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {activity.txHash && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Transaction:</span>
                        <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono truncate max-w-[200px] sm:max-w-none">
                          {activity.txHash}
                        </code>
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
