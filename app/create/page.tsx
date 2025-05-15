"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Upload, ImageIcon, FileVideo, FileText, Info, Loader2, Plus, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCollections } from "@/lib/mock-data"

export default function CreatePage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("type") || "image"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [properties, setProperties] = useState<Array<{ trait: string; value: string }>>([])
  const collections = getCollections()

  const handleFileSelect = () => {
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
    }, 100)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6">Create New Asset</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Details</CardTitle>
                  <CardDescription>Create your digital asset on Starknet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                    <Button
                      variant={activeTab === "image" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center whitespace-nowrap"
                      onClick={() => setActiveTab("image")}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                    <Button
                      variant={activeTab === "video" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center whitespace-nowrap"
                      onClick={() => setActiveTab("video")}
                    >
                      <FileVideo className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                    <Button
                      variant={activeTab === "post" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center whitespace-nowrap"
                      onClick={() => setActiveTab("post")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>

                  <div className="pt-4">
                    {activeTab === "image" && (
                      <div>
                        {previewUrl ? (
                          <div className="relative aspect-square max-w-md mx-auto">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute bottom-2 right-2"
                              onClick={() => setPreviewUrl(null)}
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={handleFileSelect}
                          >
                            <div className="flex flex-col items-center">
                              {isUploading ? (
                                <>
                                  <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
                                  <h3 className="font-medium text-lg mb-2">Uploading...</h3>
                                  <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${uploadProgress}%` }}></div>
                                  </div>
                                  <p className="text-muted-foreground mt-2">{uploadProgress}%</p>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                                  <h3 className="font-medium text-lg mb-2">Upload Image</h3>
                                  <p className="text-muted-foreground mb-4">PNG, JPG or GIF up to 10MB</p>
                                  <Button>Select File</Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "video" && (
                      <div className="border-2 border-dashed rounded-lg p-12 text-center">
                        <div className="flex flex-col items-center">
                          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="font-medium text-lg mb-2">Upload Video</h3>
                          <p className="text-muted-foreground mb-4">MP4 or WebM up to 50MB</p>
                          <Button>Select File</Button>
                        </div>
                      </div>
                    )}

                    {activeTab === "post" && (
                      <Textarea placeholder="Write your post content here..." className="min-h-[200px]" />
                    )}
                  </div>

                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="title">Name</Label>
                    <Input id="title" placeholder="Give your asset a name" />
                  </div>

                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="collection">Collection</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Create new collection</SelectItem>
                        {collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Tell the story behind your creation" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Properties</Label>
                      <Button variant="outline" size="sm" onClick={addProperty}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {properties.map((property, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-2 items-center"
                        >
                          <Input
                            placeholder="Trait name"
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
                          <Button variant="ghost" size="icon" onClick={() => removeProperty(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}

                      {properties.length === 0 && (
                        <div className="border rounded-md p-4 text-center text-muted-foreground">
                          <p>Add properties to your asset (e.g. Color: Blue, Size: Large)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Create Asset</Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Asset Settings</CardTitle>
                  <CardDescription>Configure how your asset will be tokenized</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="price">Initial Price (ETH)</Label>
                    <Input id="price" type="number" placeholder="0.00" min="0" step="0.01" />
                  </div>

                  <div className="grid w-full gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="royalty">Royalty Percentage</Label>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                    <Slider defaultValue={[10]} max={25} step={1} />
                    <p className="text-sm text-muted-foreground">You'll receive this percentage of all future sales</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Unlockable Content</Label>
                      <p className="text-sm text-muted-foreground">Include content only revealed to the owner</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Label className="mr-1">Content Coin</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Create a token for your content that can be traded on exchanges
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-muted-foreground">Create a tradeable token for this content</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Limited Edition</Label>
                      <p className="text-sm text-muted-foreground">Set a maximum supply for this token</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Network Info</CardTitle>
                  <CardDescription>Minting on Starknet blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium">Starknet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gas Fee (est.)</span>
                      <span className="font-medium">0.0001 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Protocol</span>
                      <span className="font-medium">Ekubo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
