"use client"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function BottomNav() {
  const pathname = usePathname()
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showQuickMint, setShowQuickMint] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsScrollingUp(true)
      } else {
        setIsScrollingUp(false)
        setShowQuickMint(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  // We're not using this component anymore since the header is now at the bottom
  return null
}
