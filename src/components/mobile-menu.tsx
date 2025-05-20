"use client"

import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { ThemeToggle } from "@/src/components/theme-toggle"
import { Home, Compass, Activity, User, Package, Settings, LogOut, Coins } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Separator } from "@/src/components/ui/separator"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import WalletConnectButton from "@/src/components/wallet-connect-button"

export default function MobileMenu() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Guest User</p>
            <p className="text-xs text-muted-foreground">Not connected</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-4">
        <WalletConnectButton />
      </div>

      <Separator className="mb-4" />

      <nav className="space-y-1">
        <Link href="/" className="block">
          <Button
            variant="ghost"
            className={cn("w-full justify-start", isActive("/") ? "bg-muted font-medium" : "text-muted-foreground")}
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </Button>
        </Link>
        <Link href="/explore" className="block">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isActive("/explore") ? "bg-muted font-medium" : "text-muted-foreground",
            )}
          >
            <Compass className="h-5 w-5 mr-3" />
            Explore
          </Button>
        </Link>
        <Link href="/collections" className="block">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isActive("/collections") ? "bg-muted font-medium" : "text-muted-foreground",
            )}
          >
            <Package className="h-5 w-5 mr-3" />
            Collections
          </Button>
        </Link>
        <Link href="/activity" className="block">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isActive("/activity") ? "bg-muted font-medium" : "text-muted-foreground",
            )}
          >
            <Activity className="h-5 w-5 mr-3" />
            Activity
          </Button>
        </Link>
        <Link href="/coin" className="block">
          <Button
            variant="ghost"
            className={cn("w-full justify-start", isActive("/coin") ? "bg-muted font-medium" : "text-muted-foreground")}
          >
            <Coins className="h-5 w-5 mr-3" />
            COIN
          </Button>
        </Link>
        <Link href="/profile/user1" className="block">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isActive("/profile") ? "bg-muted font-medium" : "text-muted-foreground",
            )}
          >
            <User className="h-5 w-5 mr-3" />
            Profile
          </Button>
        </Link>
      </nav>

      <Separator className="my-4" />

      <nav className="space-y-1">
        <Link href="/settings" className="block">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </nav>

      <div className="mt-auto pt-4 text-center">
        <p className="text-xs text-muted-foreground">MIP Dapp v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">© 2023 MIP Labs</p>
      </div>
    </div>
  )
}
