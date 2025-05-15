"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function WalletButton() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true)
    }, 1000)
  }

  if (isConnected) {
    return (
      <Button variant="outline" className="w-full">
        <Wallet className="h-4 w-4 mr-2" />
        0x1a2b...3c4d
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Connect with one of our available wallet providers or create a new one.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <Button variant="outline" className="w-full justify-start h-14" onClick={handleConnect}>
            <img src="/placeholder.svg?height=30&width=30" alt="Argent" className="h-8 w-8 mr-4" />
            Argent
          </Button>
          <Button variant="outline" className="w-full justify-start h-14" onClick={handleConnect}>
            <img src="/placeholder.svg?height=30&width=30" alt="Braavos" className="h-8 w-8 mr-4" />
            Braavos
          </Button>
          <Button variant="outline" className="w-full justify-start h-14" onClick={handleConnect}>
            <img src="/placeholder.svg?height=30&width=30" alt="OKX" className="h-8 w-8 mr-4" />
            OKX Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
