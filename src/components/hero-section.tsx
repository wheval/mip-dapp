"use client"

import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                Create, Connect, Earn
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                MIP is an onchain social dapp that offers new ways to create, connect, and earn from your digital
                fingerprint.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/mint">
                <Button size="lg" className="px-8 rounded-full">
                  Start Minting
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="px-8 rounded-full">
                  Explore
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-primary/80 to-purple-500/80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-3/4 h-3/4">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-lg backdrop-blur-md transform rotate-6 -translate-x-4 -translate-y-4"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-lg backdrop-blur-md transform -rotate-12 translate-x-6 translate-y-6"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold text-center">
                    <p className="mb-2">Your Content</p>
                    <p className="mb-2">Your Ownership</p>
                    <p>Your Economy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
