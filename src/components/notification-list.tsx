"use client"

import type React from "react"

import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { CheckCircle, AlertCircle, Info, TrendingUp, MoreHorizontal, Eye, Trash2, Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
    case "warning":
      return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
    case "activity":
      return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
    default:
      return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
  }
}

interface NotificationListProps {
  notifications: any[]
  onMarkAsReadAction: (id: string) => void
  onDeleteAction: (id: string) => void
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateAction?: React.ReactNode
  className?: string
  showActions?: boolean
}

export function NotificationList({
  notifications,
  onMarkAsReadAction,
  onDeleteAction,
  emptyStateTitle = "No notifications found",
  emptyStateDescription = "Try adjusting your search or filter criteria",
  emptyStateAction,
  className = "",
  showActions = true,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className={`text-center py-16 animate-fade-in-up ${className}`}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">{emptyStateTitle}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">{emptyStateDescription}</p>
        {emptyStateAction}
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {notifications.map((notification, index) => (
        <Card
          key={notification.id}
          className={`transition-all duration-200 hover:shadow-md group animate-fade-in-up ${
            !notification.read ? "border-primary/50 bg-primary/5" : "bg-card/80 backdrop-blur-sm"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-1">
                      {notification.title}
                    </h3>
                    {!notification.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {notification.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
              </div>
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.read && (
                      <DropdownMenuItem onClick={() => onMarkAsReadAction(notification.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Mark as read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDeleteAction(notification.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
