"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, Check, Copy, ExternalLink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function WalletConnectButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j"
  const shortAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`

  const handleConnect = (walletType: string) => {
    // Simulate wallet connection
    console.log(`Connecting to ${walletType}...`)
    setTimeout(() => {
      setIsConnected(true)
      setIsDialogOpen(false)
    }, 1000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  if (!isConnected) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect your wallet</DialogTitle>
            <DialogDescription>
              Connect with one of our available wallet providers or create a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="flex items-center justify-start h-14 px-4"
              onClick={() => handleConnect("Argent")}
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <img src="/placeholder.svg?height=30&width=30" alt="Argent" className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Argent</span>
                <span className="text-xs text-muted-foreground">Connect with Argent wallet</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start h-14 px-4"
              onClick={() => handleConnect("Braavos")}
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <img src="/placeholder.svg?height=30&width=30" alt="Braavos" className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Braavos</span>
                <span className="text-xs text-muted-foreground">Connect with Braavos wallet</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start h-14 px-4"
              onClick={() => handleConnect("OKX")}
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <img src="/placeholder.svg?height=30&width=30" alt="OKX" className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">OKX Wallet</span>
                <span className="text-xs text-muted-foreground">Connect with OKX wallet</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse"></div>
          <span className="hidden sm:inline">{shortAddress}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Wallet</p>
                <p className="text-xs text-muted-foreground">{shortAddress}</p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={handleCopy}>
          <span>Copy Address</span>
          {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <span>View on Explorer</span>
          <ExternalLink className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between cursor-pointer">
          <span>Balance</span>
          <Badge variant="outline" className="ml-auto font-mono">
            1.245 ETH
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleDisconnect}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
