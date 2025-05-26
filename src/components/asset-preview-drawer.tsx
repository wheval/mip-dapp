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
  Lightbulb,
  MessageSquare,
  BookOpen,
  Building,
  Code,
  Gem,
  Settings,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface AssetPreviewDrawerProps {
  formData: any
  selectedTemplate: string
  mediaPreview: string
  attributes: Array<{ trait_type: string; value: string }>
  onConfirm: () => void
  isCreating: boolean
}

const templateIcons = {
  audio: Music,
  art: Palette,
  documents: FileText,
  nft: Gem,
  video: Video,
  patents: Lightbulb,
  posts: MessageSquare,
  publications: BookOpen,
  rwa: Building,
  software: Code,
  custom: Settings,
}

const templateColors = {
  audio: "from-purple-500 to-pink-500",
  art: "from-pink-500 to-rose-500",
  documents: "from-blue-500 to-cyan-500",
  nft: "from-emerald-500 to-teal-500",
  video: "from-red-500 to-orange-500",
  patents: "from-yellow-500 to-amber-500",
  posts: "from-indigo-500 to-purple-500",
  publications: "from-green-500 to-emerald-500",
  rwa: "from-orange-500 to-red-500",
  software: "from-cyan-500 to-blue-500",
  custom: "from-slate-500 to-gray-500",
}

export function AssetPreviewDrawer({
  formData,
  selectedTemplate,
  mediaPreview,
  attributes,
  onConfirm,
  isCreating,
}: AssetPreviewDrawerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [creationComplete, setCreationComplete] = useState(false)

  const templateData = {
    audio: { label: "Audio", description: "Music, podcasts, sound effects" },
    art: { label: "Art", description: "Digital art, illustrations, graphics" },
    documents: { label: "Documents", description: "PDFs, presentations, reports" },
    nft: { label: "NFT", description: "Collectibles, gaming assets" },
    video: { label: "Video", description: "Films, animations, tutorials" },
    patents: { label: "Patents", description: "Inventions, innovations" },
    posts: { label: "Posts", description: "Blog posts, articles" },
    publications: { label: "Publications", description: "Books, research papers" },
    rwa: { label: "RWA", description: "Real world assets" },
    software: { label: "Software", description: "Code, applications, tools" },
    custom: { label: "Custom", description: "Other intellectual property" },
  }

  const selectedTemplateData = templateData[selectedTemplate as keyof typeof templateData]
  const TemplateIcon = templateIcons[selectedTemplate as keyof typeof templateIcons] || FileText
  const templateColor = templateColors[selectedTemplate as keyof typeof templateColors] || "from-slate-500 to-gray-500"

  const handleConfirm = async () => {
    await onConfirm()
    setCreationComplete(true)
  }

  const handleViewAsset = () => {
    // Generate a slug from the asset name
    const slug = formData.name
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

  const isFormValid = selectedTemplate && formData.name && (mediaPreview || formData.external_url)

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
          <div className="mx-auto w-full max-w-sm">
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
                  <h3 className="text-xl font-bold text-foreground mb-2">{formData.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    Your {selectedTemplateData?.label.toLowerCase()} asset is now protected under international
                    copyright law
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
        <div className="mx-auto w-full max-w-sm">
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
                      alt={formData.name || "Asset preview"}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-background/90 text-foreground border-border/50 backdrop-blur-sm">
                        {selectedTemplateData?.label}
                      </Badge>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{formData.name}</h3>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{formData.description}</p>
                  )}
                </div>
              </div>

              {/* Template Info */}
              <Card className="bg-muted/20 border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${templateColor} rounded-xl flex items-center justify-center`}
                    >
                      <TemplateIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{selectedTemplateData?.label} Asset</h4>
                      <p className="text-xs text-muted-foreground">{selectedTemplateData?.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Asset Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Asset Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License</span>
                    <span className="font-medium text-foreground">{formData.license || "All Rights Reserved"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-medium text-foreground">Starknet</span>
                  </div>
                  {formData.external_url && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">External URL</span>
                      <div className="flex items-center space-x-1">
                        <Globe className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium text-foreground text-xs">Linked</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Attributes */}
              {attributes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Attributes</h4>
                  <div className="space-y-2">
                    {attributes.slice(0, 3).map((attr, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{attr.trait_type}</span>
                        <span className="font-medium text-foreground">{attr.value}</span>
                      </div>
                    ))}
                    {attributes.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{attributes.length - 3} more attributes</div>
                    )}
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handleConfirm} disabled={isCreating} className="w-full">
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
