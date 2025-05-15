import type { User, Collection, Asset, Transaction, Activity, Offer } from "./types"

// Mock Users
const users: User[] = [
  {
    id: "user1",
    username: "alex_creator",
    displayName: "Alex Creator",
    avatar: "/placeholder.svg?height=100&width=100",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    bio: "Digital artist exploring the intersection of art and technology. Creating unique digital experiences on the blockchain.",
    verified: true,
    volume: 45.8,
  },
  {
    id: "user2",
    username: "maya_digital",
    displayName: "Maya Digital",
    avatar: "/placeholder.svg?height=100&width=100",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    bio: "Photographer and visual storyteller. Capturing moments and minting memories.",
    verified: true,
    volume: 28.3,
  },
  {
    id: "user3",
    username: "crypto_sam",
    displayName: "Crypto Sam",
    avatar: "/placeholder.svg?height=100&width=100",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    bio: "Blockchain enthusiast and collector. Building the future of digital ownership.",
    verified: false,
    volume: 12.5,
  },
  {
    id: "user4",
    username: "digital_nomad",
    displayName: "Digital Nomad",
    avatar: "/placeholder.svg?height=100&width=100",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    bio: "Creating art while traveling the world. Every piece tells a story from a different place.",
    verified: true,
    volume: 67.2,
  },
  {
    id: "user5",
    username: "tech_artist",
    displayName: "Tech Artist",
    avatar: "/placeholder.svg?height=100&width=100",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    bio: "Merging technology and creativity. Experimenting with new forms of digital expression.",
    verified: false,
    volume: 18.9,
  },
]

// Add createdAt field to collections
const collections: Collection[] = [
  {
    id: "collection1",
    name: "Digital Dreamscapes",
    description:
      "A collection of surreal digital landscapes that explore the boundaries between reality and imagination.",
    image: "/placeholder.svg?height=200&width=200",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    creator: users[0],
    verified: true,
    assetCount: 48,
    ownerCount: 32,
    floorPrice: 0.85,
    volume: 45.8,
    volumeChange: 12.5,
    createdAt: "2023-09-15T14:30:00Z",
  },
  {
    id: "collection2",
    name: "Urban Fragments",
    description:
      "Capturing the essence of urban life through digital art. Each piece represents a fragment of city existence.",
    image: "/placeholder.svg?height=200&width=200",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    creator: users[1],
    verified: true,
    assetCount: 32,
    ownerCount: 24,
    floorPrice: 0.45,
    volume: 28.3,
    volumeChange: 5.2,
    createdAt: "2023-10-02T09:15:00Z",
  },
  {
    id: "collection3",
    name: "Blockchain Visualized",
    description: "Abstract representations of blockchain technology and cryptocurrency concepts.",
    image: "/placeholder.svg?height=200&width=200",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    creator: users[2],
    verified: false,
    assetCount: 15,
    ownerCount: 10,
    floorPrice: 1.2,
    volume: 12.5,
    volumeChange: -3.1,
    createdAt: "2023-08-28T16:45:00Z",
  },
  {
    id: "collection4",
    name: "Global Perspectives",
    description:
      "A collection of digital art created while traveling the world, each piece capturing a unique cultural perspective.",
    image: "/placeholder.svg?height=200&width=200",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    creator: users[3],
    verified: true,
    assetCount: 67,
    ownerCount: 45,
    floorPrice: 0.65,
    volume: 67.2,
    volumeChange: 8.7,
    createdAt: "2023-11-05T11:20:00Z",
  },
  {
    id: "collection5",
    name: "Tech Fusion",
    description:
      "Exploring the fusion of technology and art through digital creations that push the boundaries of both.",
    image: "/placeholder.svg?height=200&width=200",
    bannerImage: "/placeholder.svg?height=400&width=1200",
    creator: users[4],
    verified: false,
    assetCount: 23,
    ownerCount: 18,
    floorPrice: 0.95,
    volume: 18.9,
    volumeChange: 2.3,
    createdAt: "2023-09-20T13:10:00Z",
  },
]

// Add featured assets to collections (will be populated after assets are created)
collections.forEach((collection) => {
  collection.featuredAssets = []
})

// Mock Assets
const assets: Asset[] = [
  {
    id: "asset1",
    name: "Digital Dreamscape #001",
    description:
      "A surreal landscape created entirely in digital space. This piece explores the boundaries between reality and imagination in the digital realm.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[0],
    owner: users[0],
    collection: collections[0],
    price: 0.85,
    tokenId: "MIP-1001",
    createdAt: "2023-09-15T14:30:00Z",
    trending: true,
    tradeVolume: 3.2,
    coinedCount: 24,
    tradeCount: 8,
    properties: [
      { trait: "Background", value: "Nebula", rarity: 12 },
      { trait: "Style", value: "Surrealism", rarity: 24 },
      { trait: "Colors", value: "Vibrant", rarity: 35 },
    ],
  },
  {
    id: "asset2",
    name: "Urban Fragment #012",
    description:
      "A collection of urban moments captured and transformed into a digital collage. Each fragment tells its own story within the larger narrative.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[1],
    owner: users[2],
    collection: collections[1],
    price: 0.45,
    tokenId: "MIP-1002",
    createdAt: "2023-10-02T09:15:00Z",
    trending: true,
    tradeVolume: 1.8,
    coinedCount: 15,
    tradeCount: 5,
    properties: [
      { trait: "Location", value: "Tokyo", rarity: 8 },
      { trait: "Time", value: "Night", rarity: 42 },
      { trait: "Mood", value: "Melancholic", rarity: 15 },
    ],
  },
  {
    id: "asset3",
    name: "Blockchain Visualization #005",
    description:
      "An abstract representation of blockchain technology. This piece visualizes the complex interconnections that make decentralized systems possible.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[2],
    owner: users[2],
    collection: collections[2],
    price: 1.2,
    tokenId: "MIP-1003",
    createdAt: "2023-08-28T16:45:00Z",
    trending: false,
    tradeVolume: 0.5,
    coinedCount: 7,
    tradeCount: 2,
    properties: [
      { trait: "Concept", value: "Decentralization", rarity: 18 },
      { trait: "Style", value: "Abstract", rarity: 30 },
      { trait: "Colors", value: "Blue", rarity: 25 },
    ],
  },
  {
    id: "asset4",
    name: "Tokyo Sunset",
    description:
      "A moment captured during golden hour in Tokyo. The blend of traditional architecture and modern cityscape creates a unique visual harmony.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[3],
    owner: users[0],
    collection: collections[3],
    price: 0.65,
    tokenId: "MIP-1004",
    createdAt: "2023-11-05T11:20:00Z",
    trending: true,
    tradeVolume: 2.1,
    coinedCount: 32,
    tradeCount: 12,
    properties: [
      { trait: "Location", value: "Tokyo", rarity: 8 },
      { trait: "Time", value: "Sunset", rarity: 22 },
      { trait: "Style", value: "Photography", rarity: 45 },
    ],
  },
  {
    id: "asset5",
    name: "Digital Identity",
    description:
      "An exploration of how we represent ourselves in digital spaces. This piece questions the nature of identity in an increasingly virtual world.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[4],
    owner: users[4],
    collection: collections[4],
    price: 0.95,
    tokenId: "MIP-1005",
    createdAt: "2023-09-20T13:10:00Z",
    trending: false,
    tradeVolume: 0.8,
    coinedCount: 10,
    tradeCount: 3,
    properties: [
      { trait: "Concept", value: "Identity", rarity: 10 },
      { trait: "Style", value: "Portrait", rarity: 28 },
      { trait: "Medium", value: "Digital", rarity: 60 },
    ],
  },
  {
    id: "asset6",
    name: "Crypto Punk Remix",
    description:
      "A reinterpretation of the iconic Crypto Punk aesthetic. This piece pays homage to early NFT art while adding a personal twist.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[0],
    owner: users[3],
    collection: collections[0],
    price: 1.5,
    tokenId: "MIP-1006",
    createdAt: "2023-10-18T15:30:00Z",
    trending: true,
    tradeVolume: 4.5,
    coinedCount: 45,
    tradeCount: 18,
    properties: [
      { trait: "Style", value: "Pixel Art", rarity: 15 },
      { trait: "Homage", value: "CryptoPunks", rarity: 5 },
      { trait: "Colors", value: "Neon", rarity: 20 },
    ],
  },
  {
    id: "asset7",
    name: "Morning Meditation",
    description:
      "A peaceful scene captured during a morning meditation session. The tranquility of the moment is preserved in this digital token.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[1],
    owner: users[1],
    collection: collections[1],
    price: 0.35,
    tokenId: "MIP-1007",
    createdAt: "2023-11-10T08:45:00Z",
    trending: false,
    tradeVolume: 0.7,
    coinedCount: 8,
    tradeCount: 2,
    properties: [
      { trait: "Mood", value: "Peaceful", rarity: 18 },
      { trait: "Time", value: "Morning", rarity: 32 },
      { trait: "Style", value: "Minimalist", rarity: 25 },
    ],
  },
  {
    id: "asset8",
    name: "Future City",
    description:
      "A vision of urban spaces in the near future. This piece imagines how technology might reshape our cities and daily lives.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[2],
    owner: users[4],
    collection: collections[2],
    price: 0.75,
    tokenId: "MIP-1008",
    createdAt: "2023-09-05T10:20:00Z",
    trending: true,
    tradeVolume: 2.8,
    coinedCount: 28,
    tradeCount: 9,
    properties: [
      { trait: "Era", value: "Future", rarity: 22 },
      { trait: "Setting", value: "Urban", rarity: 40 },
      { trait: "Technology", value: "Advanced", rarity: 15 },
    ],
  },
  {
    id: "asset9",
    name: "Digital Flora",
    description:
      "A garden of digital flowers that bloom and evolve based on blockchain activity. This piece represents the organic nature of decentralized systems.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[4],
    owner: users[2],
    collection: collections[4],
    price: 0.55,
    tokenId: "MIP-1009",
    createdAt: "2023-10-25T14:15:00Z",
    trending: false,
    tradeVolume: 1.2,
    coinedCount: 12,
    tradeCount: 4,
    properties: [
      { trait: "Theme", value: "Nature", rarity: 28 },
      { trait: "Interactivity", value: "Dynamic", rarity: 12 },
      { trait: "Colors", value: "Pastel", rarity: 35 },
    ],
  },
  {
    id: "asset10",
    name: "Mountain Reflections",
    description:
      "A serene mountain landscape with perfect reflections in a still lake. This piece captures the majesty of nature in digital form.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[3],
    owner: users[3],
    collection: collections[3],
    price: 0.9,
    tokenId: "MIP-1010",
    createdAt: "2023-08-15T09:30:00Z",
    trending: true,
    tradeVolume: 3.5,
    coinedCount: 38,
    tradeCount: 14,
    properties: [
      { trait: "Landscape", value: "Mountains", rarity: 20 },
      { trait: "Water", value: "Lake", rarity: 25 },
      { trait: "Time", value: "Dawn", rarity: 15 },
    ],
  },
  {
    id: "asset11",
    name: "Digital Dreamscape #002",
    description: "The second piece in the Digital Dreamscape series, exploring surreal digital environments.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[0],
    owner: users[1],
    collection: collections[0],
    price: 0.95,
    tokenId: "MIP-1011",
    createdAt: "2023-09-18T11:30:00Z",
    trending: false,
    tradeVolume: 1.9,
    coinedCount: 18,
    tradeCount: 6,
    properties: [
      { trait: "Background", value: "Cosmos", rarity: 8 },
      { trait: "Style", value: "Surrealism", rarity: 24 },
      { trait: "Colors", value: "Cool", rarity: 30 },
    ],
  },
  {
    id: "asset12",
    name: "Urban Fragment #015",
    description: "Another piece in the Urban Fragments collection, capturing the essence of city life.",
    image: "/placeholder.svg?height=600&width=600",
    creator: users[1],
    owner: users[0],
    collection: collections[1],
    price: 0.5,
    tokenId: "MIP-1012",
    createdAt: "2023-10-05T13:45:00Z",
    trending: false,
    tradeVolume: 1.1,
    coinedCount: 14,
    tradeCount: 5,
    properties: [
      { trait: "Location", value: "New York", rarity: 12 },
      { trait: "Time", value: "Dusk", rarity: 18 },
      { trait: "Mood", value: "Energetic", rarity: 22 },
    ],
  },
]

// Now populate the featured assets for collections
collections.forEach((collection, index) => {
  collection.featuredAssets = assets.filter((asset) => asset.collection.id === collection.id).slice(0, 3)
})

// Mock Transactions
const transactions: Transaction[] = [
  {
    id: "tx1",
    type: "mint",
    user: users[0],
    date: "2023-09-15T14:30:00Z",
  },
  {
    id: "tx2",
    type: "sale",
    user: users[0],
    to: users[2],
    amount: 0.85,
    date: "2023-09-16T10:15:00Z",
  },
  {
    id: "tx3",
    type: "listing",
    user: users[2],
    amount: 1.2,
    date: "2023-09-20T16:45:00Z",
  },
  {
    id: "tx4",
    type: "coin",
    user: users[3],
    amount: 1.0,
    date: "2023-09-22T11:30:00Z",
  },
  {
    id: "tx5",
    type: "transfer",
    user: users[1],
    to: users[4],
    date: "2023-09-25T09:15:00Z",
  },
  {
    id: "tx6",
    type: "coin",
    user: users[2],
    amount: 0.75,
    date: "2023-09-28T14:20:00Z",
  },
]

// Mock Activity
const activities: Activity[] = [
  {
    id: "activity1",
    type: "mint",
    user: users[0],
    asset: assets[0],
    timeAgo: "2 hours ago",
  },
  {
    id: "activity2",
    type: "sale",
    user: users[2],
    asset: assets[1],
    price: 0.45,
    timeAgo: "5 hours ago",
  },
  {
    id: "activity3",
    type: "listing",
    user: users[1],
    asset: assets[6],
    price: 0.35,
    timeAgo: "1 day ago",
  },
  {
    id: "activity4",
    type: "coin",
    user: users[3],
    asset: assets[3],
    price: 0.6,
    timeAgo: "2 days ago",
  },
  {
    id: "activity5",
    type: "mint",
    user: users[4],
    asset: assets[4],
    timeAgo: "3 days ago",
  },
  {
    id: "activity6",
    type: "coin",
    user: users[0],
    asset: assets[5],
    price: 1.5,
    timeAgo: "4 days ago",
  },
  {
    id: "activity7",
    type: "coin",
    user: users[2],
    asset: assets[7],
    price: 0.7,
    timeAgo: "5 days ago",
  },
  {
    id: "activity8",
    type: "listing",
    user: users[3],
    asset: assets[9],
    price: 0.9,
    timeAgo: "1 week ago",
  },
]

// Mock Offers
const offers: Offer[] = [
  {
    id: "offer1",
    user: users[1],
    amount: 0.8,
    expiresIn: "2 days",
  },
  {
    id: "offer2",
    user: users[3],
    amount: 0.75,
    expiresIn: "1 day",
  },
  {
    id: "offer3",
    user: users[4],
    amount: 0.7,
    expiresIn: "12 hours",
  },
]

// Helper functions to get data
export function getAssets(): Asset[] {
  return assets
}

export function getCollections(): Collection[] {
  return collections
}

export function getLiveActivity(): Activity[] {
  return activities
}

export function getAssetById(id: string): Asset | undefined {
  return assets.find((asset) => asset.id === id)
}

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((collection) => collection.id === id)
}

export function getAssetsByCollection(collectionId: string): Asset[] {
  return assets.filter((asset) => asset.collection.id === collectionId)
}

export function getRelatedAssets(assetId: string): Asset[] {
  const asset = getAssetById(assetId)
  if (!asset) return []

  return assets.filter((a) => a.id !== assetId && a.collection.id === asset.collection.id).slice(0, 8)
}

export function getAssetHistory(assetId: string): Transaction[] {
  // In a real app, we would filter transactions related to this asset
  return transactions
}

export function getAssetOffers(assetId: string): Offer[] {
  // In a real app, we would filter offers related to this asset
  return offers
}

export function getUserProfile(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getUserAssets(userId: string): Asset[] {
  return assets.filter((asset) => asset.owner.id === userId)
}

export function getUserCollections(userId: string): Collection[] {
  return collections.filter((collection) => collection.creator.id === userId)
}

export function getUserActivity(userId: string): Activity[] {
  return activities.filter((activity) => activity.user.id === userId)
}

export function getCollectionActivity(collectionId: string): Activity[] {
  return activities.filter((activity) => activity.asset?.collection.id === collectionId)
}

export function getTrendingCreators(): User[] {
  return users.sort((a, b) => b.volume - a.volume)
}
