"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import {
  Music,
  Palette,
  FileText,
  Gem,
  Video,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Building,
  Code,
  Play,
  Download,
  ExternalLink,
  Eye,
  Clock,
  FileType,
  Headphones,
} from "lucide-react"

interface AssetTemplateProps {
  asset: any
}

const templateConfigs = {
  Art: {
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    borderColor: "border-pink-200 dark:border-pink-800",
    actions: ["View Full Resolution", "Download", "License"],
    features: ["High Resolution", "Digital Format", "Metadata Rich"],
  },
  Audio: {
    icon: Music,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    actions: ["Play Preview", "Download", "License"],
    features: ["High Quality Audio", "Streaming Ready", "Multiple Formats"],
  },
  Video: {
    icon: Video,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    actions: ["Play Video", "Download", "License"],
    features: ["HD Quality", "Multiple Resolutions", "Streaming Ready"],
  },
  Publications: {
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    actions: ["Read Preview", "Download PDF", "License"],
    features: ["Digital Format", "Searchable Text", "Print Ready"],
  },
  Documents: {
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    actions: ["View Document", "Download", "License"],
    features: ["Multiple Formats", "Editable", "Version Control"],
  },
  Software: {
    icon: Code,
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    actions: ["View Code", "Download", "Fork"],
    features: ["Open Source", "Documentation", "Version Control"],
  },
  Patents: {
    icon: Lightbulb,
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    actions: ["View Patent", "Download PDF", "License"],
    features: ["Legal Protection", "Technical Specs", "Prior Art"],
  },
  Posts: {
    icon: MessageSquare,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    actions: ["Read Post", "Share", "Comment"],
    features: ["Rich Text", "Media Support", "Interactive"],
  },
  NFT: {
    icon: Gem,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    actions: ["View NFT", "Transfer", "Trade"],
    features: ["Blockchain Verified", "Unique", "Tradeable"],
  },
  RWA: {
    icon: Building,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    actions: ["View Details", "Verify", "Transfer"],
    features: ["Real World Asset", "Verified", "Tokenized"],
  },
}

export function AssetTemplate({ asset }: AssetTemplateProps) {
  const config = templateConfigs[asset.iptype as keyof typeof templateConfigs] || templateConfigs.Art
  const Icon = config.icon

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Play Preview":
      case "Play Video":
        return Play
      case "Download":
      case "Download PDF":
        return Download
      case "View Full Resolution":
      case "View Document":
      case "View Code":
      case "View Patent":
      case "View NFT":
      case "View Details":
        return Eye
      case "Read Preview":
      case "Read Post":
        return FileType
      case "License":
        return ExternalLink
      default:
        return ExternalLink
    }
  }

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">{asset.iptype} Asset</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This {asset.iptype.toLowerCase()} asset is protected under international copyright law with blockchain
              verification.
            </p>
          </div>
        </div>

        {/* Asset Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">Asset Features</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Template-specific Information */}
        {asset.iptype === "Audio" && asset.attributes && (
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">Audio Details</h4>
            <div className="grid grid-cols-2 gap-4">
              {asset.attributes.find((attr: any) => attr.trait_type === "Duration") && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {asset.attributes.find((attr: any) => attr.trait_type === "Duration")?.value}
                  </span>
                </div>
              )}
              {asset.attributes.find((attr: any) => attr.trait_type === "Genre") && (
                <div className="flex items-center space-x-2">
                  <Headphones className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {asset.attributes.find((attr: any) => attr.trait_type === "Genre")?.value}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {asset.iptype === "Publications" && asset.attributes && (
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">Publication Details</h4>
            <div className="grid grid-cols-2 gap-4">
              {asset.attributes.find((attr: any) => attr.trait_type === "Pages") && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {asset.attributes.find((attr: any) => attr.trait_type === "Pages")?.value} pages
                  </span>
                </div>
              )}
              {asset.attributes.find((attr: any) => attr.trait_type === "Language") && (
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {asset.attributes.find((attr: any) => attr.trait_type === "Language")?.value}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Available Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {config.actions.map((action, index) => {
              const ActionIcon = getActionIcon(action)
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ActionIcon className="w-4 h-4 mr-2" />
                  {action}
                </Button>
              )
            })}
          </div>
        </div>

        {/* License Badge */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Licensed under:</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {asset.license}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
