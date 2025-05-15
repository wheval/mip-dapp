"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Upload,
  ImageIcon,
  FileVideo,
  FileAudio,
  FileText,
  Loader2,
  Plus,
  X,
  Check,
  Sparkles,
  Shield,
  Coins,
  Copyright,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Info,
  Camera,
  Trash2,
  Tag,
  Palette,
  Zap,
  Clock,
  Users,
  Lightbulb,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCollections } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function CoinPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | "text">("image")
  const [properties, setProperties] = useState<Array<{ trait: string; value: string }>>([])
  const [assetName, setAssetName] = useState("")
  const [assetDescription, setAssetDescription] = useState("")
  const [selectedCollection, setSelectedCollection] = useState("")
  const [initialPrice, setInitialPrice] = useState("0.1")
  const [royaltyPercentage, setRoyaltyPercentage] = useState(10)
  const [isLimitedEdition, setIsLimitedEdition] = useState(false)
  const [maxSupply, setMaxSupply] = useState(1)
  const [licenseType, setLicenseType] = useState("standard")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isFullPreview, setIsFullPreview] = useState(false)

  const collections = getCollections()

  const totalSteps = 3 // Reduced from 4 to 3 steps

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const simulateFileUpload = () => {
    setIsUploading(true)

    // Simulate file upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        setPreviewUrl("/placeholder.svg?height=400&width=400")
      }
    }, 50)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload()
    }
  }

  const addProperty = () => {
    setProperties([...properties, { trait: "", value: "" }])
  }

  const removeProperty = (index: number) => {
    const newProperties = [...properties]
    newProperties.splice(index, 1)
    setProperties(newProperties)
  }

  const updateProperty = (index: number, field: "trait" | "value", value: string) => {
    const newProperties = [...properties]
    newProperties[index][field] = value
    setProperties(newProperties)
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/assets/new-asset")
    }, 2000)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Upload & Details"
      case 2:
        return "Properties & License"
      case 3:
        return "Pricing & Review"
      default:
        return ""
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Upload className="h-5 w-5" />
      case 2:
        return <Tag className="h-5 w-5" />
      case 3:
        return <Coins className="h-5 w-5" />
      default:
        return null
    }
  }

  const getStepColor = (step: number) => {
    if (step === currentStep) return "bg-primary text-primary-foreground"
    if (step < currentStep) return "bg-primary/20 text-primary"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">COIN YOUR CONTENT</h1>
            <p className="text-muted-foreground">Create programmable IP assets with embedded liquidity</p>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="mr-2" onClick={() => setIsFullPreview(!isFullPreview)}>
              {isFullPreview ? (
                <>
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>
                    Create programmable IP assets that others can COIN to support your work. Set details, license terms,
                    and pricing for your content.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={cn("lg:col-span-2", isFullPreview && "lg:col-span-1")}>
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index} className="flex items-center">
                      <button
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${getStepColor(
                          index + 1,
                        )}`}
                        onClick={() => setCurrentStep(index + 1)}
                        disabled={index + 1 > currentStep}
                      >
                        {index + 1 < currentStep ? <Check className="h-5 w-5" /> : getStepIcon(index + 1)}
                      </button>
                      {index < totalSteps - 1 && (
                        <div className={`h-1 w-8 ${index + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
                </span>
              </div>

              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept={
                                  mediaType === "image"
                                    ? "image/*"
                                    : mediaType === "video"
                                      ? "video/*"
                                      : mediaType === "audio"
                                        ? "audio/*"
                                        : "text/*"
                                }
                              />

                              <Tabs
                                defaultValue={mediaType}
                                onValueChange={(v) => setMediaType(v as any)}
                                className="mb-6"
                              >
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="image" className="flex items-center">
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Image
                                  </TabsTrigger>
                                  <TabsTrigger value="video" className="flex items-center">
                                    <FileVideo className="h-4 w-4 mr-2" />
                                    Video
                                  </TabsTrigger>
                                  <TabsTrigger value="audio" className="flex items-center">
                                    <FileAudio className="h-4 w-4 mr-2" />
                                    Audio
                                  </TabsTrigger>
                                  <TabsTrigger value="text" className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Text
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="image" className="pt-4">
                                  {previewUrl ? (
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-muted/30">
                                      <img
                                        src={previewUrl || "/placeholder.svg"}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button variant="secondary" size="sm" onClick={handleFileSelect}>
                                          <Camera className="h-4 w-4 mr-2" />
                                          Change
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => setPreviewUrl(null)}>
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors aspect-square flex flex-col items-center justify-center"
                                      onClick={handleFileSelect}
                                    >
                                      {isUploading ? (
                                        <div className="flex flex-col items-center">
                                          <Loader2 className="h-10 w-10 text-primary mb-4 animate-spin" />
                                          <h3 className="font-medium text-lg mb-2">Uploading...</h3>
                                          <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-primary"
                                              style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                          </div>
                                          <p className="text-muted-foreground mt-2">{uploadProgress}%</p>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center">
                                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                            <Upload className="h-8 w-8 text-primary" />
                                          </div>
                                          <h3 className="font-medium text-lg mb-2">Upload Image</h3>
                                          <p className="text-muted-foreground mb-4">Drag and drop or click to browse</p>
                                          <p className="text-xs text-muted-foreground">PNG, JPG or GIF up to 10MB</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </TabsContent>

                                <TabsContent value="video" className="pt-4">
                                  <div
                                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors aspect-video flex flex-col items-center justify-center"
                                    onClick={handleFileSelect}
                                  >
                                    <div className="flex flex-col items-center">
                                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <FileVideo className="h-8 w-8 text-primary" />
                                      </div>
                                      <h3 className="font-medium text-lg mb-2">Upload Video</h3>
                                      <p className="text-muted-foreground mb-4">Drag and drop or click to browse</p>
                                      <p className="text-xs text-muted-foreground">MP4 or WebM up to 50MB</p>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="audio" className="pt-4">
                                  <div
                                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors aspect-video flex flex-col items-center justify-center"
                                    onClick={handleFileSelect}
                                  >
                                    <div className="flex flex-col items-center">
                                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <FileAudio className="h-8 w-8 text-primary" />
                                      </div>
                                      <h3 className="font-medium text-lg mb-2">Upload Audio</h3>
                                      <p className="text-muted-foreground mb-4">Drag and drop or click to browse</p>
                                      <p className="text-xs text-muted-foreground">MP3 or WAV up to 30MB</p>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="text" className="pt-4">
                                  <Textarea
                                    placeholder="Write your content here..."
                                    className="min-h-[200px] resize-none"
                                  />
                                </TabsContent>
                              </Tabs>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="title" className="text-base font-medium">
                                  Content Name
                                </Label>
                                <Input
                                  id="title"
                                  placeholder="Give your content a name"
                                  value={assetName}
                                  onChange={(e) => setAssetName(e.target.value)}
                                  className="mt-1.5"
                                />
                              </div>

                              <div>
                                <Label htmlFor="description" className="text-base font-medium">
                                  Description
                                </Label>
                                <Textarea
                                  id="description"
                                  placeholder="Tell the story behind your creation"
                                  value={assetDescription}
                                  onChange={(e) => setAssetDescription(e.target.value)}
                                  className="min-h-[100px] resize-none mt-1.5"
                                />
                              </div>

                              <div>
                                <Label htmlFor="collection" className="text-base font-medium">
                                  Collection
                                </Label>
                                <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                                  <SelectTrigger className="mt-1.5">
                                    <SelectValue placeholder="Select a collection" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">
                                      <div className="flex items-center">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create new collection
                                      </div>
                                    </SelectItem>
                                    {collections.map((collection) => (
                                      <SelectItem key={collection.id} value={collection.id}>
                                        <div className="flex items-center">
                                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                            <img
                                              src={collection.image || "/placeholder.svg"}
                                              alt={collection.name}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          {collection.name}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-base font-medium">Tags</Label>
                                <div className="flex items-center mt-1.5">
                                  <Input
                                    placeholder="Add tags (press Enter)"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={addTag}
                                    disabled={!tagInput.trim()}
                                    className="ml-2"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                                {tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 pl-2">
                                        {tag}
                                        <button
                                          type="button"
                                          onClick={() => removeTag(tag)}
                                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted/30 rounded-lg p-4 flex items-start">
                            <Lightbulb className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-medium text-sm">Pro Tips</h3>
                              <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                                <li>• High-quality content attracts more attention and COINs</li>
                                <li>• A detailed description helps others understand your work</li>
                                <li>• Relevant tags make your content more discoverable</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-5">
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <Label className="text-base font-medium flex items-center">
                                    <Palette className="h-4 w-4 mr-2" />
                                    Properties
                                  </Label>
                                  <Button variant="outline" size="sm" onClick={addProperty} className="h-8">
                                    <Plus className="h-3.5 w-3.5 mr-1" />
                                    Add
                                  </Button>
                                </div>

                                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2">
                                  {properties.map((property, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="flex gap-2 items-center"
                                    >
                                      <Input
                                        placeholder="Trait"
                                        value={property.trait}
                                        onChange={(e) => updateProperty(index, "trait", e.target.value)}
                                        className="flex-1"
                                      />
                                      <Input
                                        placeholder="Value"
                                        value={property.value}
                                        onChange={(e) => updateProperty(index, "value", e.target.value)}
                                        className="flex-1"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeProperty(index)}
                                        className="h-8 w-8"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  ))}

                                  {properties.length === 0 && (
                                    <div className="border rounded-md p-4 text-center text-muted-foreground bg-muted/20">
                                      <p className="text-sm">Add properties like Color: Blue, Size: Large</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center mb-3">
                                  <Copyright className="h-4 w-4 mr-2" />
                                  <Label className="text-base font-medium">License Type</Label>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                  <div
                                    className={`flex items-start p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                                      licenseType === "standard" ? "border-primary bg-primary/5" : "border-muted"
                                    }`}
                                    onClick={() => setLicenseType("standard")}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                                        licenseType === "standard" ? "border-primary" : "border-muted-foreground"
                                      }`}
                                    >
                                      {licenseType === "standard" && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="font-medium flex items-center">
                                        <Shield className="h-4 w-4 mr-2 text-primary" />
                                        Standard License
                                      </h3>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Buyers can use your content for personal and commercial purposes with
                                        attribution.
                                      </p>
                                    </div>
                                  </div>

                                  <div
                                    className={`flex items-start p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                                      licenseType === "exclusive" ? "border-primary bg-primary/5" : "border-muted"
                                    }`}
                                    onClick={() => setLicenseType("exclusive")}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                                        licenseType === "exclusive" ? "border-primary" : "border-muted-foreground"
                                      }`}
                                    >
                                      {licenseType === "exclusive" && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="font-medium flex items-center">
                                        <Sparkles className="h-4 w-4 mr-2 text-primary" />
                                        Exclusive License
                                      </h3>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Buyers get exclusive rights to use your content without attribution
                                        requirements.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div>
                                <h3 className="font-medium mb-3 flex items-center">
                                  <Zap className="h-4 w-4 mr-2" />
                                  Rights & Permissions
                                </h3>

                                <div className="space-y-3">
                                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                    <div>
                                      <Label className="font-medium">Commercial Use</Label>
                                      <p className="text-xs text-muted-foreground">Allow buyers to use commercially</p>
                                    </div>
                                    <Switch defaultChecked />
                                  </div>

                                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                    <div>
                                      <Label className="font-medium">Require Attribution</Label>
                                      <p className="text-xs text-muted-foreground">Buyers must credit you</p>
                                    </div>
                                    <Switch
                                      defaultChecked={licenseType === "standard"}
                                      disabled={licenseType === "exclusive"}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                    <div>
                                      <Label className="font-medium">Allow Modifications</Label>
                                      <p className="text-xs text-muted-foreground">Buyers can modify your content</p>
                                    </div>
                                    <Switch defaultChecked />
                                  </div>

                                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                    <div>
                                      <Label className="font-medium">Allow Redistribution</Label>
                                      <p className="text-xs text-muted-foreground">Buyers can redistribute</p>
                                    </div>
                                    <Switch />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-5">
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <Label htmlFor="price" className="text-base font-medium flex items-center">
                                    <Coins className="h-4 w-4 mr-2" />
                                    Initial COIN Price
                                  </Label>
                                  <Badge variant="outline" className="font-mono">
                                    ≈ ${(Number.parseFloat(initialPrice || "0") * 3500).toFixed(2)} USD
                                  </Badge>
                                </div>
                                <div className="relative">
                                  <DollarSign className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                                  <Input
                                    id="price"
                                    type="number"
                                    placeholder="0.00"
                                    min="0.001"
                                    step="0.001"
                                    value={initialPrice}
                                    onChange={(e) => setInitialPrice(e.target.value)}
                                    className="pl-9"
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  This is the price others will pay to COIN your content
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <Label className="text-base font-medium flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Creator Royalty
                                  </Label>
                                  <span className="text-sm font-medium">{royaltyPercentage}%</span>
                                </div>
                                <Slider
                                  defaultValue={[royaltyPercentage]}
                                  max={25}
                                  step={1}
                                  onValueChange={(value) => setRoyaltyPercentage(value[0])}
                                  className="my-2"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>0%</span>
                                  <span>25%</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  You'll receive this percentage of all future COIN transactions
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                  <div>
                                    <Label className="font-medium flex items-center">
                                      <Clock className="h-4 w-4 mr-2" />
                                      Limited Edition
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      Limit how many times this can be COINed
                                    </p>
                                  </div>
                                  <Switch checked={isLimitedEdition} onCheckedChange={setIsLimitedEdition} />
                                </div>

                                {isLimitedEdition && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 pl-4 border-l-2 border-primary/20"
                                  >
                                    <div className="grid w-full gap-1.5">
                                      <Label htmlFor="maxSupply">Maximum Supply</Label>
                                      <Input
                                        id="maxSupply"
                                        type="number"
                                        min="1"
                                        max="1000"
                                        value={maxSupply}
                                        onChange={(e) => setMaxSupply(Number.parseInt(e.target.value))}
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Only {maxSupply} COINs of this content can be created
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="bg-muted/20 rounded-lg p-4 mb-4">
                                <h3 className="font-medium mb-3">Content Summary</h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Content Type</span>
                                    <span className="font-medium capitalize">{mediaType}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">License</span>
                                    <span className="font-medium capitalize">{licenseType}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Initial Price</span>
                                    <span className="font-medium">{initialPrice} ETH</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Royalty</span>
                                    <span className="font-medium">{royaltyPercentage}%</span>
                                  </div>
                                  {isLimitedEdition && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Supply</span>
                                      <span className="font-medium">Limited to {maxSupply}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Properties</span>
                                    <span className="font-medium">{properties.length}</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Network</span>
                                    <span className="font-medium">Starknet</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Gas Fee (est.)</span>
                                    <span className="font-medium">0.0001 ETH</span>
                                  </div>
                                </div>
                              </div>

                              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating IP Asset...
                                  </>
                                ) : (
                                  <>
                                    <Coins className="h-4 w-4 mr-2" />
                                    Create COIN Asset
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button onClick={handleNext}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className={cn("lg:col-span-1", !isFullPreview && "hidden lg:block", isFullPreview && "lg:col-span-2")}>
            <div className="sticky top-4">
              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Content Preview</h3>

                  <div className={cn("flex flex-col gap-6", isFullPreview && "md:flex-row")}>
                    <div className={cn("w-full", isFullPreview && "md:w-1/2")}>
                      {previewUrl ? (
                        <div className="aspect-square rounded-xl overflow-hidden bg-muted/30">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Content preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square rounded-xl bg-muted/30 flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-muted" />
                        </div>
                      )}
                    </div>

                    <div className={cn("w-full", isFullPreview && "md:w-1/2")}>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">{assetName || "Untitled Content"}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-3 mt-1">
                            {assetDescription || "No description provided"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {mediaType === "image"
                              ? "Image"
                              : mediaType === "video"
                                ? "Video"
                                : mediaType === "audio"
                                  ? "Audio"
                                  : "Text"}
                          </Badge>
                          {selectedCollection && (
                            <Badge variant="outline">
                              {collections.find((c) => c.id === selectedCollection)?.name || "New Collection"}
                            </Badge>
                          )}
                          {licenseType === "standard" ? (
                            <Badge variant="outline" className="bg-primary/10">
                              Standard License
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-primary/10">
                              Exclusive License
                            </Badge>
                          )}
                          {isLimitedEdition && (
                            <Badge variant="outline" className="bg-primary/10">
                              Limited ({maxSupply})
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-semibold">{initialPrice || "0"} ETH</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Royalty</p>
                            <p className="font-semibold">{royaltyPercentage}%</p>
                          </div>
                        </div>

                        {tags.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Tags</p>
                            <div className="flex flex-wrap gap-1">
                              {tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="bg-muted">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {properties.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Properties</p>
                            <div className="flex flex-wrap gap-1">
                              {properties.map((prop, index) =>
                                prop.trait && prop.value ? (
                                  <Badge key={index} variant="outline" className="bg-muted">
                                    {prop.trait}: {prop.value}
                                  </Badge>
                                ) : null,
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
