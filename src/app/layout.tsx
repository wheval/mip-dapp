import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/src/components/ui/toaster"
import { ThemeProvider } from "@/src/components/theme-provider"
import { Header } from "@/src/components/header"
import { Footer } from "@/src/components/footer"
import { FloatingNavigation } from "@/src/components/floating-navigation"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MIP - My Intellectual Property",
  description: "Coin your content into programmable intellectual property with frictionless tokenization. Powered on Starknet",
  keywords: ["NFT", "IP", "Intellectual Property", "Starknet", "Web3", "Tokenization"],
  authors: [{ name: "Mediolano" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
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
    </ClerkProvider>
  )
}
