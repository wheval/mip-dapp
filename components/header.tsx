"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import WalletConnectButton from "@/components/wallet-connect-button"
import MobileMenu from "@/components/mobile-menu"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled ? "bg-background/95 backdrop-blur-sm border-t" : "bg-background border-t",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-6">
                <div className="relative h-8 w-8 mr-2 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
                  MIP
                </div>
                <span className="font-bold text-xl hidden sm:inline-block">MIP</span>
              </Link>

              <nav className="hidden md:flex items-center space-x-1">
                <Link href="/">
                  <Button
                    variant={isActive("/") ? "default" : "ghost"}
                    size="sm"
                    className={isActive("/") ? "" : "text-muted-foreground"}
                  >
                    Start
                  </Button>
                </Link>
                <Link href="/coin">
                  <Button
                    variant={isActive("/coin") ? "default" : "ghost"}
                    size="sm"
                    className={isActive("/coin") ? "" : "text-muted-foreground"}
                  >
                    Coin
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    variant={isActive("/explore") ? "default" : "ghost"}
                    size="sm"
                    className={isActive("/explore") ? "" : "text-muted-foreground"}
                  >
                    Explore
                  </Button>
                </Link>
                <Link href="/collections">
                  <Button
                    variant={isActive("/collections") ? "default" : "ghost"}
                    size="sm"
                    className={isActive("/collections") ? "" : "text-muted-foreground"}
                  >
                    Collections
                  </Button>
                </Link>
                <Link href="/activity">
                  <Button
                    variant={isActive("/activity") ? "default" : "ghost"}
                    size="sm"
                    className={isActive("/activity") ? "" : "text-muted-foreground"}
                  >
                    Activity
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-2">
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "200px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Input placeholder="Search..." className="pr-8" autoFocus onBlur={() => setIsSearchOpen(false)} />
                  <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </motion.div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden md:flex">
                  <Search className="h-5 w-5" />
                </Button>
              )}

              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              <div className="hidden md:block">
                <WalletConnectButton />
              </div>

              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0">
                  <MobileMenu />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
