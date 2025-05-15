"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export default function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate network status changes
    const interval = setInterval(() => {
      const newStatus = Math.random() > 0.9 ? false : true

      if (isConnected !== newStatus) {
        setIsConnected(newStatus)
        setIsVisible(true)

        const timeout = setTimeout(() => {
          setIsVisible(false)
        }, 5000)

        return () => clearTimeout(timeout)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [isConnected])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Badge variant={isConnected ? "default" : "destructive"} className="px-3 py-1">
            {isConnected ? "Connected to Starknet" : "Network connection lost"}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
