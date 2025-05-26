"use client"

import { Header } from "@/src/components/header"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import { Upload, ImageIcon, Music, Video, FileText, Palette, Shield, Zap, Clock, DollarSign, Info } from "lucide-react"
import { useState } from "react"

const assetTypes = [
  { id: "image", icon: ImageIcon, label: "Image", description: "Photos, artwork, designs" },
  { id: "music", icon: Music, label: "Music", description: "Audio tracks, compositions" },
  { id: "video", icon: Video, label: "Video", description: "Films, animations, clips" },
  { id: "document", icon: FileText, label: "Document", description: "Text, research, articles" },
  { id: "design", icon: Palette, label: "Design", description: "UI/UX, graphics, logos" },
]

export default function CreatePage() {
  const [selectedType, setSelectedType] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              Create IP Asset
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Transform Your Work Into Protected IP</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your creative work and tokenize it as intellectual property on Starknet. Secure, fast, and designed
              for creators.
            </p>
          </div>

          {/* Asset Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Select Asset Type
              </CardTitle>
              <CardDescription>Choose the type of intellectual property you want to tokenize</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {assetTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedType === type.id
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <Icon
                          className={`w-8 h-8 mx-auto ${
                            selectedType === type.id ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          {selectedType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Your Asset
                </CardTitle>
                <CardDescription>Upload your file and provide details for tokenization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Drop your file here or click to browse</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports JPG, PNG, GIF, MP4, MP3, PDF up to 100MB
                  </p>
                  <Button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Choose File"}
                  </Button>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Asset Details Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Asset Title</Label>
                      <Input id="title" placeholder="Enter a descriptive title" />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your intellectual property..." rows={4} />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="art, design, music (comma separated)" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="royalty">Royalty Percentage</Label>
                      <Input id="royalty" type="number" placeholder="10" min="0" max="50" />
                      <p className="text-xs text-muted-foreground mt-1">Percentage you'll receive from future sales</p>
                    </div>

                    <div>
                      <Label htmlFor="price">Initial Price (ETH)</Label>
                      <Input id="price" type="number" placeholder="0.1" step="0.001" />
                    </div>

                    <div>
                      <Label htmlFor="license">License Type</Label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                        <option>Standard License</option>
                        <option>Extended License</option>
                        <option>Exclusive License</option>
                        <option>Custom License</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tokenization Info */}
          {selectedType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Tokenization Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <Clock className="w-8 h-8 mx-auto text-primary" />
                    <h3 className="font-semibold">Processing Time</h3>
                    <p className="text-sm text-muted-foreground">~2-5 minutes</p>
                  </div>

                  <div className="text-center space-y-2">
                    <DollarSign className="w-8 h-8 mx-auto text-green-500" />
                    <h3 className="font-semibold">Network Fee</h3>
                    <p className="text-sm text-muted-foreground">~$0.50 USD</p>
                  </div>

                  <div className="text-center space-y-2">
                    <Shield className="w-8 h-8 mx-auto text-blue-500" />
                    <h3 className="font-semibold">Blockchain</h3>
                    <p className="text-sm text-muted-foreground">Starknet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Button */}
          {selectedType && (
            <div className="text-center">
              <Button size="lg" className="px-8">
                Create IP Asset
                <Zap className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                By creating this asset, you agree to our Terms of Service
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
