export interface AssetIP {
  id: string
  slug: string
  title: string
  author: string
  description: string
  type: string
  template: string
  collection: string
  collectionSlug?: string
  tags: string
  mediaUrl: string
  externalUrl: string
  licenseType: string
  licenseDetails: string
  ipVersion: string
  commercialUse: boolean
  modifications: boolean
  attribution: boolean
  registrationDate: string
  protectionStatus: string
  protectionScope: string
  protectionDuration: string
  // Additional metadata
  creator: {
    id: string
    username: string
    name: string
    avatar: string
    verified: boolean
    wallet: string
    bio?: string
    followers?: number
    following?: number
    assets?: number
  }
  timestamp: string
  attributes?: Array<{ trait_type: string; value: string }>
  blockchain: string
  contractAddress?: string
  tokenId?: string
  metadataUri?: string
  fileSize?: string
  fileDimensions?: string
  fileFormat?: string
}

export interface Collection {
  id: string
  slug: string
  name: string
  description: string
  coverImage: string
  bannerImage?: string
  creator: {
    id: string
    username: string
    name: string
    avatar: string
    verified: boolean
    wallet: string
  }
  assets: number
  views?: number
  likes?: number
  floorPrice?: string
  totalVolume?: string
  createdAt: string
  updatedAt: string
  category: string
  tags: string
  isPublic: boolean
  isFeatured: boolean
  blockchain: string
  contractAddress?: string
}

export interface Creator {
  id: string
  username: string
  name: string
  avatar: string
  banner?: string
  verified: boolean
  wallet: string
  bio: string
  location?: string
  website?: string
  twitter?: string
  instagram?: string
  followers: number
  following: number
  assets: number
  collections?: number
  joined: string
  specialties?: string[]
  achievements?: string[]
}

export interface Activity {
  id: string
  type: "mint" | "transfer_in" | "transfer_out" | "sale" | "license" | "update" | "collection_create" | "collection_add"
  title: string
  description: string
  timestamp: string
  network: string
  status: "completed" | "pending" | "failed"
  value?: string
  txHash?: string
  assetId?: string
  collectionId?: string
  fromAddress?: string
  toAddress?: string
}
