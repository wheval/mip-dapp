"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/src/components/header"
import { FloatingNavigation } from "@/src/components/floating-navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Textarea } from "@/src/components/ui/textarea"
import { TransferConfirmationDrawer } from "@/src/components/transfer-confirmation-drawer"
import {
  ArrowLeft,
  Scan,
  Wallet,
  User,
  MessageSquare,
  Zap,
  Shield,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { portfolioAssets } from "@/src/lib/mock-data"
import { toast } from "@/src/hooks/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function TransferPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedAsset = searchParams.get("asset")

  const [selectedAsset, setSelectedAsset] = useState(preselectedAsset || "")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [transferNote, setTransferNote] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [estimatedFee, setEstimatedFee] = useState("0.001")
  const [addressValidation, setAddressValidation] = useState<"valid" | "invalid" | "">("")

  const ownedAssets = portfolioAssets.filter((asset) => asset.status === "owned")
  const selectedAssetData = ownedAssets.find((asset) => asset.slug === selectedAsset)

  // Validate Starknet address format
  const validateAddress = (address: string) => {
    if (!address) {
      setAddressValidation("")
      return
    }

    // Basic Starknet address validation (starts with 0x and has correct length)
    const isValid = /^0x[0-9a-fA-F]{63,64}$/.test(address) || /^0x[0-9a-fA-F]{1,63}$/.test(address)
    setAddressValidation(isValid ? "valid" : "invalid")
  }

  useEffect(() => {
    validateAddress(recipientAddress)
  }, [recipientAddress])

  // Estimate fee based on network conditions (mock)
  useEffect(() => {
    if (selectedAsset && recipientAddress) {
      // Simulate dynamic fee calculation
      const baseFee = 0.001
      const randomMultiplier = 0.8 + Math.random() * 0.4 // 0.8x to 1.2x
      setEstimatedFee((baseFee * randomMultiplier).toFixed(4))
    }
  }, [selectedAsset, recipientAddress])

  const handleTransfer = async () => {
    if (!selectedAsset || !recipientAddress || addressValidation !== "valid") {
      toast({
        title: "Invalid Transfer Details",
        description: "Please check all required fields and ensure the address is valid",
        variant: "destructive",
      })
      return
    }

    setIsTransferring(true)

    // Simulate transfer process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsTransferring(false)
  }

  const isFormValid = selectedAsset && recipientAddress && addressValidation === "valid"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">

      <main className="pb-6">
        <div className="px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in-up">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4 hover:bg-muted/50 hover:scale-105 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-3">Transfer IP Asset</h1>
                <p className="text-muted-foreground text-lg">
                  Send your intellectual property to another wallet securely
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-sm font-bold text-blue-900 dark:text-blue-100">{ownedAssets.length}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Available</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-sm font-bold text-green-900 dark:text-green-100">{estimatedFee}</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Est. Fee</div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <CardContent className="p-4 text-center">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-2 animate-pulse" />
                    <div className="text-sm font-bold text-purple-900 dark:text-purple-100">Instant</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Settlement</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Transfer Form */}
            <div className="space-y-6">
              {/* Asset Selection */}
              <Card
                className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: "400ms" }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    <span>Select Asset</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="asset-select" className="text-sm font-medium">
                      Choose Asset to Transfer *
                    </Label>
                    <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                      <SelectTrigger className="mt-2 bg-background/50">
                        <SelectValue placeholder="Select an asset from your portfolio" />
                      </SelectTrigger>
                      <SelectContent>
                        {ownedAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.slug}>
                            <div className="flex items-center space-x-3">
                              <Image
                                src={asset.image || "/placeholder.svg"}
                                alt={asset.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <span className="font-medium">{asset.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">({asset.iptype})</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedAssetData && (
                    <Card className="bg-muted/20 border-border/30 animate-fade-in">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={selectedAssetData.image || "/placeholder.svg"}
                            alt={selectedAssetData.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{selectedAssetData.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {selectedAssetData.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {selectedAssetData.iptype}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {selectedAssetData.license}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Recipient Information */}
              <Card
                className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: "500ms" }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Recipient Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="recipient-address" className="text-sm font-medium">
                      Wallet Address *
                    </Label>
                    <div className="flex space-x-2 mt-2">
                      <div className="relative flex-1">
                        <Input
                          id="recipient-address"
                          placeholder="0x..."
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          className={`bg-background/50 pr-10 transition-all ${
                            addressValidation === "valid"
                              ? "border-green-500 focus:border-green-500"
                              : addressValidation === "invalid"
                                ? "border-red-500 focus:border-red-500"
                                : ""
                          }`}
                        />
                        {addressValidation === "valid" && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 animate-pulse" />
                        )}
                        {addressValidation === "invalid" && (
                          <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500 animate-pulse" />
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="px-3 hover:scale-105 transition-transform">
                        <Scan className="w-4 h-4" />
                      </Button>
                    </div>
                    {addressValidation === "invalid" && (
                      <p className="text-xs text-red-500 mt-1 animate-fade-in">Please enter a valid Starknet address</p>
                    )}
                    {addressValidation === "valid" && (
                      <p className="text-xs text-green-500 mt-1 animate-fade-in">Valid Starknet address</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="recipient-name" className="text-sm font-medium">
                      Recipient Name (Optional)
                    </Label>
                    <Input
                      id="recipient-name"
                      placeholder="Enter recipient name for your records"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="mt-2 bg-background/50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Transfer Note */}
              <Card
                className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: "600ms" }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span>Transfer Note</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="transfer-note" className="text-sm font-medium">
                      Add a Note (Optional)
                    </Label>
                    <Textarea
                      id="transfer-note"
                      placeholder="Add a note about this transfer for your records..."
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
                      rows={3}
                      className="mt-2 bg-background/50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Transfer Summary */}
              {selectedAssetData && recipientAddress && (
                <Card
                  className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 animate-fade-in-up"
                  style={{ animationDelay: "700ms" }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Info className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Transfer Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Asset:</span>
                            <span className="font-medium text-foreground">{selectedAssetData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">To:</span>
                            <span className="font-medium text-foreground">
                              {recipientName || `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Network Fee:</span>
                            <span className="font-medium text-foreground">{estimatedFee} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Network:</span>
                            <span className="font-medium text-foreground">Starknet</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transfer Button */}
              <div className="animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                <TransferConfirmationDrawer
                  selectedAsset={selectedAssetData}
                  recipientAddress={recipientAddress}
                  recipientName={recipientName}
                  transferNote={transferNote}
                  estimatedFee={estimatedFee}
                  onTransfer={handleTransfer}
                  isTransferring={isTransferring}
                  disabled={!isFormValid}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <FloatingNavigation />
    </div>
  )
}
