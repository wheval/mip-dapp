"use client"

import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Bell, Home, Search, Compass, Menu, Coins } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import { ThemeToggle } from "@/src/components/theme-toggle"
import { useState } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold mr-8">
              MIP
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant={pathname === "/explore" ? "default" : "ghost"} size="sm">
                  <Compass className="h-5 w-5 mr-2" />
                  Explore
                </Button>
              </Link>
              <Link href="/coin">
                <Button variant={pathname === "/coin" ? "default" : "ghost"} size="sm">
                  <Coins className="h-5 w-5 mr-2" />
                  COIN
                </Button>
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isSearchOpen ? (
              <div className="relative w-64">
                <Input
                  placeholder="Search creators and content..."
                  className="pr-8"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <ThemeToggle />

            <Link href="/profile/user1">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            <ThemeToggle />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="flex items-center py-2">
                    <Home className="h-5 w-5 mr-2" />
                    Home
                  </Link>
                  <Link href="/explore" className="flex items-center py-2">
                    <Compass className="h-5 w-5 mr-2" />
                    Explore
                  </Link>
                  <Link href="/coin" className="flex items-center py-2">
                    <Coins className="h-5 w-5 mr-2" />
                    COIN
                  </Link>
                  <Link href="/profile/user1" className="flex items-center py-2">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    Profile
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
