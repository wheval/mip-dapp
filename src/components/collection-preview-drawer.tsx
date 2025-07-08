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

import {
  CheckCircle,
  Eye,
  Briefcase,
  Globe,
  Zap,
  Shield,
  Users,
  Sparkles,
  ArrowRight,
  Clock,
  DollarSign,
  Wallet,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "@/src/hooks/use-toast"

interface CollectionPreviewDrawerProps {
  formData: any
  coverPreview: any
  bannerPreview: any
  isFormValid: boolean
  onShowPinDialog: () => void
  isCreating: boolean
  creationComplete: boolean
  currentStep: number
  creationSteps: Array<{ title: string; description: string }>
}

const contractTypeLabels = {
  erc721: "ERC-721 Standard",
  "ip-drop": "IP Drop",
  erc721a: "ERC-721A Open Edition",
  erc1155: "ERC-1155 Multi-Token",
  colab: "Collaborative Collection",
}

const contractTypeDescriptions = {
  erc721: "Standard NFT collection with unique tokens",
  "ip-drop": "Large-scale distribution with lazy minting",
  erc721a: "Gas-optimized batch minting",
  erc1155: "Multi-token standard with upgradeable contracts",
  colab: "Multi-contributor collaborative collection",
}

export function CollectionPreviewDrawer({
  formData,
  coverPreview,
  bannerPreview,
  isFormValid,
  onShowPinDialog,
  isCreating,
  creationComplete,
  currentStep,
  creationSteps,
}: CollectionPreviewDrawerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleCreate = () => {
    // Show PIN dialog immediately
    onShowPinDialog()
  }



  const handleViewCollection = () => {
    // Generate a slug from the collection name
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    router.push(`/collection/${slug}`)
    setIsOpen(false)
  }

  const handleViewCollections = () => {
    router.push("/collections")
    setIsOpen(false)
  }

  const resetCreation = () => {
    setIsOpen(false)
  }

  if (creationComplete) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            disabled={!isFormValid}
            className="w-full sm:w-auto min-w-[200px] hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="lg"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview & Create Collection
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle className="text-center">Collection Created Successfully!</DrawerTitle>
              <DrawerDescription className="text-center">
                Your IP collection is now live and ready for assets
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{formData.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    Your {contractTypeLabels[formData.contractType as keyof typeof contractTypeLabels]} collection is
                    now live
                  </p>
                </div>

                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Deployed on Starknet</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Contract: 0xabcd...ef12</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-xs font-medium">Instant</div>
                    <div className="text-xs text-muted-foreground">Deploy</div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                    <div className="text-xs font-medium">Free</div>
                    <div className="text-xs text-muted-foreground">Gas Fees</div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                    <div className="text-xs font-medium">No Wallet</div>
                    <div className="text-xs text-muted-foreground">Required</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleViewCollection} className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Collection
                  </Button>
                  <Button onClick={handleViewCollections} variant="outline" className="w-full">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Collections
                  </Button>
                  <Button onClick={resetCreation} variant="ghost" className="w-full">
                    Create Another Collection
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
          disabled={!isFormValid}
          className="w-full sm:w-auto min-w-[200px] hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          size="lg"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview & Create Collection
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-center">Preview Your Collection</DrawerTitle>
            <DrawerDescription className="text-center">
              Review your collection before deploying to Starknet
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            {isCreating ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Creating Your Collection</h3>
                  <p className="text-sm text-muted-foreground">{creationSteps[currentStep]?.description}</p>
                </div>

                <div className="space-y-3">
                  {creationSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${index === currentStep
                        ? "bg-primary/10 border border-primary/20"
                        : index < currentStep
                          ? "bg-green-50 dark:bg-green-900/20"
                          : "bg-muted/20"
                        }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${index === currentStep
                          ? "bg-primary text-primary-foreground"
                          : index < currentStep
                            ? "bg-green-600 text-white"
                            : "bg-muted-foreground/20"
                          }`}
                      >
                        {index < currentStep ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : index === currentStep ? (
                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">{step.title}</div>
                        <div className="text-xs text-muted-foreground">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="text-left">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm">Powered by Starknet</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Fast, free deployment with sponsored transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Collection Preview */}
                <div className="space-y-4">
                  {/* Banner Preview */}
                  {bannerPreview && (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={bannerPreview.url || "/placeholder.svg"}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}

                  {/* Cover and Info */}
                  <div className="flex items-start space-x-4">
                    {coverPreview && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={coverPreview.url || "/placeholder.svg"}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">{formData.name}</h3>
                      {formData.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{formData.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {formData.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {contractTypeLabels[formData.contractType as keyof typeof contractTypeLabels]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collection Details */}
                <Card className="bg-muted/20 border-border/30">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Contract Type</span>
                        <span className="font-medium text-foreground">
                          {contractTypeLabels[formData.contractType as keyof typeof contractTypeLabels]}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contractTypeDescriptions[formData.contractType as keyof typeof contractTypeDescriptions]}
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Network</span>
                        <span className="font-medium text-foreground">Starknet</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium text-foreground capitalize">{formData.category}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Starknet Benefits */}
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Starknet Advantages</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-green-600" />
                          <span className="text-muted-foreground">Instant deployment</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          <span className="text-muted-foreground">Zero gas fees</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-3 h-3 text-blue-600" />
                          <span className="text-muted-foreground">Secure & scalable</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-3 h-3 text-purple-600" />
                          <span className="text-muted-foreground">No wallet needed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sponsored Transaction Info */}
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">Sponsored Transaction</h4>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        We cover all deployment costs for a frictionless experience
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button onClick={handleCreate} className="w-full">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Deploy Collection</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Button>
                  <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
                    Review Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
