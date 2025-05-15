import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/components/wallet-provider"
import { LiveActivityProvider } from "@/components/live-activity-provider"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MIP - Onchain Social DApp",
  description: "Create, connect, and earn from your digital fingerprint",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <LiveActivityProvider>
              <main className="min-h-screen pb-20 bg-background">{children}</main>
              <Header />
              <Toaster />
            </LiveActivityProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
