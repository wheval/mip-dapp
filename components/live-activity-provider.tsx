"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Activity } from "@/lib/types"
import { getLiveActivity } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"

interface LiveActivityContextType {
  recentActivity: Activity[]
}

const LiveActivityContext = createContext<LiveActivityContextType>({
  recentActivity: [],
})

export const useLiveActivity = () => useContext(LiveActivityContext)

export function LiveActivityProvider({ children }: { children: ReactNode }) {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Simulate real-time activity updates
    const allActivity = getLiveActivity()

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * allActivity.length)
      const newActivity = allActivity[randomIndex]

      setRecentActivity((prev) => [newActivity, ...prev].slice(0, 5))

      toast({
        title: `New ${newActivity.type}!`,
        description: `${newActivity.user.displayName} ${
          newActivity.type === "mint"
            ? "minted"
            : newActivity.type === "sale"
              ? "purchased"
              : newActivity.type === "listing"
                ? "listed"
                : "made an offer on"
        } ${newActivity.asset?.name}`,
        duration: 3000,
      })
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [toast])

  return (
    <LiveActivityContext.Provider
      value={{
        recentActivity,
      }}
    >
      {children}
    </LiveActivityContext.Provider>
  )
}
