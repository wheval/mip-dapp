"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Compass, PlusCircle } from "lucide-react"

export default function WelcomeBanner() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/90 to-purple-600 text-white shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
      </div>

      <div className="relative px-6 py-8 md:py-10 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Join the MIP Community</h2>
            <p className="text-white/80 mb-6 max-w-md">
              Create, connect, and earn from your digital fingerprint on Starknet's premier social platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/mint" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2"
                asChild
              >
                <Link href="/explore">
                  <Compass className="h-4 w-4" />
                  Explore
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:flex justify-end">
            <div className="relative w-64 h-64">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-lg backdrop-blur-sm transform rotate-6 -translate-x-4 -translate-y-4"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-lg backdrop-blur-sm transform -rotate-6 translate-x-4 translate-y-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-bold mb-2">Your Content</p>
                  <p className="text-xl font-bold mb-2">Your Ownership</p>
                  <p className="text-xl font-bold">Your Economy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
