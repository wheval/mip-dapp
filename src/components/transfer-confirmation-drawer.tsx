"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Separator } from "@/src/components/ui/separator"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer"
import { Send, CheckCircle, AlertCircle, Zap, Copy, ExternalLink, Clock, ArrowRight, Briefcase } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "@/src/hooks/use-toast"

interface TransferConfirmationDrawerProps {
  selectedAsset: any
  recipientAddress: string
  recipientName: string
  transferNote: string
  estimatedFee: string
  onTransfer: () => Promise<void>
  isTransferring: boolean
  disabled: boolean
}

export function TransferConfirmationDrawer({
  selectedAsset,
  recipientAddress,
  recipientName,
  transferNote,
  estimatedFee,
  onTransfer,
  isTransferring,
  disabled,
}: TransferConfirmationDrawerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [transferComplete, setTransferComplete] = useState(false)
  const [txHash] = useState("0x1234567890abcdef1234567890abcdef12345678")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    })
  }

  const handleTransfer = async () => {
    try {
      await onTransfer()
      setTransferComplete(true)
      toast({
        title: "Transfer Successful!",
        description: "Your IP asset has been transferred successfully",
      })
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewAsset = () => {
    router.push(`/asset/${selectedAsset.slug}`)
    setIsOpen(false)
  }

  const handleViewPortfolio = () => {
    router.push("/portfolio")
    setIsOpen(false)
  }

  const resetTransfer = () => {
    setTransferComplete(false)
    setIsOpen(false)
  }

  if (transferComplete) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            disabled={disabled}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
          >
            <Send className="w-5 h-5 mr-2" />
            Transfer Asset
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-center">Transfer Complete!</DrawerTitle>
              <DrawerDescription className="text-center">
                Your IP asset has been successfully transferred
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{selectedAsset.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    Successfully transferred to{" "}
                    {recipientName || `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`}
                  </p>
                </div>

                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Transaction Hash</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="text-xs bg-background/50 px-2 py-1 rounded font-mono">
                      {txHash.slice(0, 8)}...{txHash.slice(-8)}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(txHash)} className="w-8 h-8 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleViewAsset} className="w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    View Asset
                  </Button>
                  <Button onClick={handleViewPortfolio} variant="outline" className="w-full">
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                  <Button onClick={resetTransfer} variant="ghost" className="w-full">
                    Transfer Another Asset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          disabled={disabled}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
        >
          <Send className="w-5 h-5 mr-2" />
          Transfer Asset
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center">Confirm Transfer</DrawerTitle>
            <DrawerDescription className="text-center">
              Review the details before confirming the transfer
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            <div className="space-y-6">
              {/* Asset Summary */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Asset to Transfer</h4>
                <Card className="bg-muted/20 border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={selectedAsset?.image || "/placeholder.svg"}
                        alt={selectedAsset?.name || ""}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{selectedAsset?.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {selectedAsset?.iptype}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {selectedAsset?.license}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Transfer Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Transfer Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">To Address</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                        {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(recipientAddress)}
                        className="w-6 h-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {recipientName && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Recipient Name</span>
                      <span className="text-sm font-medium text-foreground">{recipientName}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Network</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Starknet</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Fee</span>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium text-foreground">{estimatedFee} ETH</span>
                    </div>
                  </div>
                </div>

                {transferNote && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Transfer Note</span>
                    <div className="text-sm text-foreground bg-muted/20 p-3 rounded-lg">{transferNote}</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Warning */}
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1 text-sm">
                      Irreversible Action
                    </h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      This transfer cannot be undone. Please verify the recipient address.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handleTransfer} disabled={isTransferring} className="w-full">
                  {isTransferring ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Confirm Transfer</span>
                    </div>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
                  Review Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
