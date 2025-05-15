"use client"

import { useState } from "react"
import { getAssets } from "@/lib/mock-data"
import WelcomeBanner from "@/components/welcome-banner"
import ContentFeed from "@/components/content-feed"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Menu } from "lucide-react"
import NotificationTicker from "@/components/notification-ticker"
import { motion } from "framer-motion"
import HomeSidebar from "@/components/home-sidebar"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Home() {
  const assets = getAssets()
  const [activeFilter, setActiveFilter] = useState("trending")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Show sidebar by default on desktop
  useState(() => {
    if (isDesktop) {
      setSidebarOpen(true)
    }
  })

  const getFilteredAssets = () => {
    switch (activeFilter) {
      case "trending":
        return assets.filter((a) => a.trending)
      case "newest":
        return assets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
      case "active":
        return assets.sort((a, b) => b.tradeVolume - a.tradeVolume).slice(0, 8)
      case "valuable":
        return assets.sort((a, b) => b.price - a.price).slice(0, 8)
      case "popular":
        return assets.sort((a, b) => (b.coinedCount || 0) - (a.coinedCount || 0)).slice(0, 8)
      case "featured":
        return assets.filter((_, index) => index % 3 === 0).slice(0, 8) // Just a mock filter
      default:
        return assets.filter((a) => a.trending)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <NotificationTicker />

      <div className="mt-4 lg:flex lg:gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Discover</h1>

            {/* Mobile sidebar toggle */}
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </div>

          <ContentFeed assets={getFilteredAssets()} />

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/explore">
                Explore More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-16 mb-8">
            <WelcomeBanner />
          </div>
        </div>

        {/* Sidebar - hidden on mobile unless toggled */}
        <motion.div
          className={`lg:w-80 lg:flex-shrink-0 ${sidebarOpen ? "block" : "hidden lg:block"}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HomeSidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </motion.div>
      </div>
    </div>
  )
}
