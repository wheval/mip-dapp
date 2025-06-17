import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/src/components/ui/toaster"
import { ThemeProvider } from "@/src/components/theme-provider"
import { Header } from "@/src/components/header"
import { Footer } from "@/src/components/footer"
import { FloatingNavigation } from "@/src/components/floating-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MIP - Mediolano Intellectual Property",
  description: "Transform your content into protected intellectual property with frictionless tokenization on Starknet",
  keywords: ["NFT", "IP", "Intellectual Property", "Starknet", "Web3", "Tokenization"],
  authors: [{ name: "MIP Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <FloatingNavigation />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
