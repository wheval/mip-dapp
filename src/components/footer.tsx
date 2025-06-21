"use client"

import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import {
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Globe,
  ArrowRight,
  Home,
  Plus,
  Briefcase,
  Send,
  Activity,
  Bell,
  Settings,
} from "lucide-react"
import { LogoMediolano } from "./logo-mediolano"

const socialLinks = [
  { icon: Twitter, href: "https://x.com/mediolanoapp", label: "Twitter" },
  { icon: Github, href: "https://github.com/mediolano-app", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/mediolano/", label: "LinkedIn" },
  { icon: Globe, href: "https://mediolano.xyz", label: "Website" },
]

const mainNavLinks = [
  { href: "/", label: "Start", icon: Home },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/transfer", label: "Transfer", icon: Send },
  { href: "/activities", label: "Activities", icon: Activity },
]

const additionalLinks = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
]

const resourceLinks = [
  { href: "#", label: "Documentation" },
  { href: "#", label: "API Reference" },
  { href: "#", label: "Support" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 mt-16">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Showcase Your IP
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Take the next step and license and monetize your assets with Mediolano Dapp
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transform your intellectual property into valuable digital assets. Join thousands of creators who trust
              MIP for secure, frictionless IP tokenization.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Button size="lg" className="group">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-3">
              
               <LogoMediolano />
              
              <div>
                <h3 className="font-bold text-foreground text-xl">MIP</h3>
                <p className="text-sm text-muted-foreground">My Intellectual Property</p>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Transform your content into protected intellectual property with frictionless tokenization.
            </p>
            <p className="text-muted-foreground max-w-md">
              Free, fast and secure! Tokenize, protect and trade you intellectual property onchain.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    asChild
                  >
                    <Link href={social.href} aria-label={social.label}>
                      <Icon className="w-4 h-4" />
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Navigation</h4>
            <nav className="space-y-3">
              {mainNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              <div className="pt-2 border-t border-border/50">
                {additionalLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 group mb-3"
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <nav className="space-y-3">
              
                <Link
                  href="/docs"
                  className="block text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Documentation
                </Link>
            
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">© 2025 Mediolano. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Powered on Starknet</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span>Made with ❤️ for creators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
