"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Bell, Megaphone, Sparkles, Info, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type NotificationType = "announcement" | "feature" | "alert" | "update"

interface Notification {
  id: string
  type: NotificationType
  message: string
  link?: {
    text: string
    url: string
  }
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "announcement",
    message: "Welcome to the new MIP platform! Explore and discover amazing digital assets.",
    link: {
      text: "Learn More",
      url: "/about",
    },
  },
  {
    id: "2",
    type: "feature",
    message: "New feature: Content Coining is now available! Support creators directly.",
    link: {
      text: "Try it Now",
      url: "/explore",
    },
  },
  {
    id: "3",
    type: "alert",
    message: "Trending now: Digital Dreamscape collection has reached 100 ETH in volume!",
    link: {
      text: "View Collection",
      url: "/collections/collection1",
    },
  },
  {
    id: "4",
    type: "update",
    message: "Platform update: Enhanced security features have been implemented.",
    link: {
      text: "Read Details",
      url: "/updates",
    },
  },
]

export default function NotificationTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isPaused])

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="h-4 w-4" />
      case "feature":
        return <Sparkles className="h-4 w-4" />
      case "alert":
        return <Bell className="h-4 w-4" />
      case "update":
        return <Info className="h-4 w-4" />
    }
  }

  const getColor = (type: NotificationType) => {
    switch (type) {
      case "announcement":
        return "bg-blue-500"
      case "feature":
        return "bg-primary"
      case "alert":
        return "bg-amber-500"
      case "update":
        return "bg-green-500"
    }
  }

  const currentNotification = notifications[currentIndex]

  return (
    <div
      className="w-full bg-gradient-to-r from-muted/80 via-background to-muted/80 rounded-lg mb-6 overflow-hidden border border-muted relative h-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={tickerRef}
    >
      {/* Electric pulse effect */}
      <motion.div
        className="absolute inset-0 bg-primary/5 pointer-events-none"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Zap icon that pulses */}
      <motion.div
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Zap className="h-5 w-5" />
      </motion.div>

      <div className="flex items-center h-full px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNotification.id}
            className="flex items-center gap-3 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <Badge className={`${getColor(currentNotification.type)} text-white`}>
              {getIcon(currentNotification.type)}
            </Badge>

            <p className="text-sm flex-1 truncate">{currentNotification.message}</p>

            {currentNotification.link && (
              <Link
                href={currentNotification.link.url}
                className="text-sm font-medium text-primary whitespace-nowrap hover:underline flex items-center gap-1"
              >
                {currentNotification.link.text}
                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  →
                </motion.div>
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-primary"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        key={currentNotification.id}
        transition={{
          duration: 6,
          ease: "linear",
        }}
        style={{ display: isPaused ? "none" : "block" }}
      />

      {/* Indicator dots */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
        {notifications.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 w-1 rounded-full ${index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"}`}
            animate={index === currentIndex ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 1, repeat: index === currentIndex ? Number.POSITIVE_INFINITY : 0 }}
          />
        ))}
      </div>
    </div>
  )
}
