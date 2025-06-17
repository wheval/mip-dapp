"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Plus, Briefcase, Activity, FolderOpen } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/collections", icon: FolderOpen, label: "Collections" },
  { href: "/create", icon: Plus, label: "Create" },
  { href: "/portfolio", icon: Briefcase, label: "Portfolio" },
  { href: "/activities", icon: Activity, label: "Activities" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 z-50 supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/10 shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform duration-200`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
