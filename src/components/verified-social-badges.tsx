"use client"

import { Badge } from "@/src/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { SiX, SiFacebook, SiTiktok, SiGoogle, SiInstagram, SiLinkedin, SiYoutube, SiGithub } from "react-icons/si"

interface VerifiedSocialBadgesProps {
  verifiedAccounts?: {
    x?: boolean
    facebook?: boolean
    tiktok?: boolean
    google?: boolean
    instagram?: boolean
    linkedin?: boolean
    youtube?: boolean
    github?: boolean
  }
  size?: "sm" | "md" | "lg"
  showLabels?: boolean
}

const socialPlatforms = {
  x: { icon: SiX, label: "X", color: "bg-black text-white" },
  facebook: { icon: SiFacebook, label: "Facebook", color: "bg-blue-600 text-white" },
  tiktok: { icon: SiTiktok, label: "TikTok", color: "bg-black text-white" },
  google: { icon: SiGoogle, label: "Google", color: "bg-red-500 text-white" },
  instagram: {
    icon: SiInstagram,
    label: "Instagram",
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  },
  linkedin: { icon: SiLinkedin, label: "LinkedIn", color: "bg-blue-700 text-white" },
  youtube: { icon: SiYoutube, label: "YouTube", color: "bg-red-600 text-white" },
  github: { icon: SiGithub, label: "GitHub", color: "bg-gray-800 text-white" },
}

export function VerifiedSocialBadges({
  verifiedAccounts = {},
  size = "md",
  showLabels = false,
}: VerifiedSocialBadgesProps) {
  const verifiedPlatforms = Object.entries(verifiedAccounts)
    .filter(([_, verified]) => verified)
    .map(([platform]) => platform as keyof typeof socialPlatforms)

  if (verifiedPlatforms.length === 0) {
    return null
  }

  const sizeClasses = {
    sm: "h-6 px-2 text-xs",
    md: "h-7 px-2.5 text-xs",
    lg: "h-8 px-3 text-sm",
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }

  return (
    <div className="flex flex-wrap gap-2">
      {verifiedPlatforms.map((platform) => {
        const config = socialPlatforms[platform]
        if (!config) return null // Skip if platform config is not found
        const IconComponent = config.icon
        if (!IconComponent) return null // Skip if icon component is not found
        // Render the badge with the appropriate styles and icon

        return (
          <Badge
            key={platform}
            className={`${config.color} ${sizeClasses[size]} flex items-center gap-1.5 border-0 font-medium`}
          >
            <IconComponent size={iconSizes[size]} />
            {showLabels && <span>{config.label}</span>}
            <CheckCircle size={iconSizes[size] - 2} className="opacity-80" />
          </Badge>
        )
      })}
    </div>
  )
}
