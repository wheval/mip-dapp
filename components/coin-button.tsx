"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  Coins,
  TrendingUp,
  Users,
  Sparkles,
  Clock,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Zap,
} from "lucide-react"
import type { Asset } from "@/lib/types"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CoinButtonProps {
  asset: Asset
  size?: "default" | "large"
  showDetails?: boolean
}

export default function CoinButton({ asset, size = "default", showDetails = true }: CoinButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [coinAmount, setCoinAmount] = useState(asset.price)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasCoined, setHasCoined] = useState(false)
  const [animateValue, setAnimateValue] = useState(false)
  const { toast } = useToast()

  // Mock recent coiners
  const recentCoiners = [
    { id: "user1", username: "alex_creator", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "user2", username: "maya_digital", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "user3", username: "crypto_sam", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const handleCoin = () => {
    if (hasCoined) return

    setIsLoading(true)

    // Simulate coin process
    setTimeout(() => {
      setIsLoading(false)
      setHasCoined(true)
      toast({
        title: "Successfully Coined!",
        description: `You've coined ${asset.name} for ${coinAmount.toFixed(3)} ETH`,
        variant: "default",
      })
    }, 1500)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      setCoinAmount(value)
      setAnimateValue(true)
      setTimeout(() => setAnimateValue(false), 300)
    }
  }

  const adjustAmount = (amount: number) => {
    setCoinAmount((prev) => {
      const newValue = Math.max(0.001, prev + amount)
      setAnimateValue(true)
      setTimeout(() => setAnimateValue(false), 300)
      return newValue
    })
  }

  const setMultiplier = (multiplier: number) => {
    setCoinAmount(asset.price * multiplier)
    setAnimateValue(true)
    setTimeout(() => setAnimateValue(false), 300)
  }

  return (
    <motion.div
      className={`w-full rounded-xl overflow-hidden border bg-gradient-to-r from-background via-muted/20 to-background ${
        size === "large" ? "p-4" : "p-3"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-3">
        {/* Main Coin Button Row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
              >
                <Coins className={`${size === "large" ? "h-5 w-5" : "h-4 w-4"} text-primary`} />
              </motion.div>
              <span className={`font-medium ${size === "large" ? "text-lg" : "text-base"}`}>Coin this asset</span>
              {asset.trending && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <motion.span
                animate={animateValue ? { scale: [1, 1.1, 1] } : {}}
                className={`${size === "large" ? "text-2xl" : "text-xl"} font-bold`}
              >
                {coinAmount.toFixed(3)} ETH
              </motion.span>
              <span className="text-muted-foreground text-sm">≈ ${(coinAmount * 3500).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasCoined ? (
              <Button variant="outline" className="gap-1.5 bg-primary/10 text-primary border-primary/20">
                <Check className="h-4 w-4" />
                <span>Coined</span>
              </Button>
            ) : (
              <Button onClick={handleCoin} disabled={isLoading} className="gap-1.5">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4" />
                    <span>Coin Now</span>
                  </>
                )}
              </Button>
            )}

            {showDetails && (
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-4">
                  {/* Improved Amount Selection */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Coin Amount</span>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setMultiplier(0.5)}
                              >
                                0.5×
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{(asset.price * 0.5).toFixed(3)} ETH</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setMultiplier(1)}
                              >
                                1×
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{asset.price.toFixed(3)} ETH</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setMultiplier(2)}
                              >
                                2×
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{(asset.price * 2).toFixed(3)} ETH</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setMultiplier(5)}
                              >
                                5×
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{(asset.price * 5).toFixed(3)} ETH</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Custom amount input with increment/decrement buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-md"
                        onClick={() => adjustAmount(-0.01)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={coinAmount}
                          onChange={handleAmountChange}
                          step="0.001"
                          min="0.001"
                          className="pr-16 text-center"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          ETH
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-md"
                        onClick={() => adjustAmount(0.01)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Quick amount suggestions */}
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[0.1, 0.25, 0.5, 1].map((amount) => (
                        <Button
                          key={amount}
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => setCoinAmount(amount)}
                        >
                          {amount} ETH
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Stats Row - Enhanced with better visual design */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/30 rounded-lg p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-primary mb-1">
                        <Coins className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Total Coined</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-lg font-bold">{asset.coinedCount || 0}</p>
                        <Badge className="ml-1 bg-primary/10 text-primary border-primary/20 text-xs">
                          <Zap className="h-3 w-3 mr-0.5" />
                          Active
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-primary mb-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Price Trend</span>
                      </div>
                      <p className="text-lg font-bold text-green-500">+12.5%</p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-primary mb-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Last Coined</span>
                      </div>
                      <p className="text-sm font-medium">2h ago</p>
                    </div>
                  </div>

                  {/* Recent Coiners - Enhanced with animation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        Recent Coiners
                      </span>
                      <Link href="#" className="text-xs text-primary hover:underline">
                        View All
                      </Link>
                    </div>
                    <div className="flex -space-x-2">
                      {recentCoiners.map((coiner, index) => (
                        <motion.div
                          key={coiner.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link href={`/profile/${coiner.id}`}>
                            <Avatar className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={coiner.avatar || "/placeholder.svg"} alt={coiner.username} />
                              <AvatarFallback>{coiner.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </Link>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background"
                      >
                        +18
                      </motion.div>
                    </div>
                  </div>

                  {/* Benefits - Enhanced with better visual design */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-primary/5 rounded-lg p-3 border border-primary/10"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Benefits of Coining</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Coining this asset gives you early access to creator drops, exclusive community events, and
                          potential returns if the asset appreciates in value.
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Early Access
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Community Events
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Potential Returns
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Enhanced Price History Sparkline with animation */}
      <div className="h-2 w-full mt-2 relative overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10"></div>
        <motion.div
          className="absolute top-0 left-0 right-0 h-full bg-primary/20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, rgba(var(--primary), 0.1) 0%, rgba(var(--primary), 0.3) 25%, rgba(var(--primary), 0.6) 50%, rgba(var(--primary), 0.3) 75%, rgba(var(--primary), 0.1) 100%)",
          }}
        />
      </div>
    </motion.div>
  )
}
