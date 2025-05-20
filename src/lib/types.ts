export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bannerImage?: string
  bio?: string
  verified: boolean
  volume: number
}

export interface Collection {
  id: string
  name: string
  description: string
  image: string
  bannerImage: string
  creator: User
  verified: boolean
  assetCount: number
  ownerCount: number
  floorPrice: number
  volume: number
  volumeChange: number
  featuredAssets?: Asset[]
  createdAt?: string
}

export interface Asset {
  id: string
  name: string
  description: string
  image: string
  creator: User
  owner: User
  collection: Collection
  price: number
  tokenId: string
  createdAt: string
  trending?: boolean
  tradeVolume: number
  coinedCount?: number
  tradeCount?: number
  properties: Property[]
}

export interface Property {
  trait: string
  value: string
  rarity: number
}

export interface Transaction {
  id: string
  type: "mint" | "sale" | "listing" | "offer" | "transfer" | "coin"
  user: User
  to?: User
  amount?: number
  date: string
}

export interface Activity {
  id: string
  type: "mint" | "sale" | "listing" | "offer" | "coin"
  user: User
  asset?: Asset
  price?: number
  timeAgo: string
}

export interface Offer {
  id: string
  user: User
  amount: number
  expiresIn: string
}
