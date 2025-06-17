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
  Sparkles,
  Shield,
  CheckCircle,
  Eye,
  Briefcase,
  Globe,
  FileText,
  Music,
  Palette,
  Video,
  ImageIcon,
  AlertCircle,
  Calendar,
  User,
  Tag,
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "@/src/hooks/use-toast"

interface AssetPreviewDrawerProps {
  formData: any
  mediaPreview: string
  isFormValid: boolean
}

const typeIcons = {
  art: Palette,
  music: Music,
  video: Video,
  document: FileText,
  image: ImageIcon,
}

const licenseLabels = {
  "all-rights": "All Rights Reserved",
  "creative-commons": "Creative Commons",
  "open-source": "Open Source",
  custom: "Custom License",
}

export function AssetPreviewDrawer({ formData, mediaPreview, isFormValid }: AssetPreviewDrawerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [creationComplete, setCreationComplete] = useState(false)

  const TypeIcon = typeIcons[formData.type as keyof typeof typeIcons] || FileText

  const handleCreate = async () => {
    setIsCreating(true)

    // Simulate creation process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsCreating(false)
    setCreationComplete(true)

    toast({
      title: "IP Successfully Tokenized!",
      description: "Your intellectual property has been protected and minted on Starknet",
    })
  }

  const handleViewAsset = () => {
    // Generate a slug from the asset title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    router.push(`/asset/${slug}`)
    setIsOpen(false)
  }

  const handleViewPortfolio = () => {
    router.push("/portfolio")
    setIsOpen(false)
  }

  const resetCreation = () => {
    setCreationComplete(false)
    setIsOpen(false)
  }

  if (creationComplete) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            disabled={!isFormValid}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Tokenize Intellectual Property
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle className="text-center">Asset Created Successfully!</DrawerTitle>
              <DrawerDescription className="text-center">
                Your intellectual property has been tokenized and protected
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{formData.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    Your {formData.type} asset is now protected under international copyright law
                  </p>
                </div>

                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Blockchain Protected</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Transaction: 0x1234...5678</div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleViewAsset} className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Asset
                  </Button>
                  <Button onClick={handleViewPortfolio} variant="outline" className="w-full">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Open Portfolio
                  </Button>
                  <Button onClick={resetCreation} variant="ghost" className="w-full">
                    Create Another Asset
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
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Tokenize Intellectual Property
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-center">Review Your IP Asset</DrawerTitle>
            <DrawerDescription className="text-center">
              Confirm the details before tokenizing your intellectual property
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            <div className="space-y-6">
              {/* Asset Preview */}
              <div className="space-y-4">
                {mediaPreview && (
                  <div className="relative">
                    <Image
                      src={mediaPreview || "/placeholder.svg"}
                      alt={formData.title || "Asset preview"}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-background/90 text-foreground border-border/50 backdrop-blur-sm">
                        {formData.type}
                      </Badge>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{formData.title}</h3>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{formData.description}</p>
                  )}
                </div>
              </div>

              {/* Asset Type Info */}
              <Card className="bg-muted/20 border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground capitalize">{formData.type} Asset</h4>
                      <p className="text-xs text-muted-foreground">Version {formData.ipVersion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Asset Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Asset Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Author</span>
                    </div>
                    <span className="font-medium text-foreground">{formData.author}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">License</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {licenseLabels[formData.licenseType as keyof typeof licenseLabels] || formData.licenseType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Network</span>
                    </div>
                    <span className="font-medium text-foreground">Starknet</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Registration</span>
                    </div>
                    <span className="font-medium text-foreground">{formData.registrationDate}</span>
                  </div>

                  {formData.collection && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Collection</span>
                      </div>
                      <span className="font-medium text-foreground">{formData.collection}</span>
                    </div>
                  )}

                  {formData.externalUrl && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">External URL</span>
                      </div>
                      <span className="font-medium text-foreground text-xs">Linked</span>
                    </div>
                  )}
                </div>
              </div>

              {/* License Permissions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">License Permissions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Commercial Use</span>
                    <Badge variant={formData.commercialUse ? "default" : "secondary"} className="text-xs">
                      {formData.commercialUse ? "Allowed" : "Not Allowed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Modifications</span>
                    <Badge variant={formData.modifications ? "default" : "secondary"} className="text-xs">
                      {formData.modifications ? "Allowed" : "Not Allowed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attribution Required</span>
                    <Badge variant={formData.attribution ? "default" : "secondary"} className="text-xs">
                      {formData.attribution ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {formData.tags && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.split(", ").map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Protection Info */}
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Berne Convention Protection</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your IP will be protected under international copyright law with immutable blockchain verification
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        181 Countries
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        Instant Protection
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        Immutable Record
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1 text-sm">Important Notice</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Once minted, this asset cannot be modified. Please review all details carefully.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handleCreate} disabled={isCreating} className="w-full">
                  {isCreating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Asset...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm & Create</span>
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
