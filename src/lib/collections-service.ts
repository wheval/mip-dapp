import { RpcProvider, Contract, CallData, num, validateAndParseAddress } from "starknet"
import { starknetService } from "./starknet-service"
import type { Collection, AssetIP } from "@/src/types/asset"

// MIP Protocol Contract ABI for collections
const MIP_COLLECTIONS_ABI = [
    {
        name: "get_collection_count",
        type: "function",
        inputs: [],
        outputs: [{ name: "count", type: "u64" }],
        stateMutability: "view",
    },
    {
        name: "get_collection",
        type: "function",
        inputs: [{ name: "collection_id", type: "u64" }],
        outputs: [{ name: "collection", type: "MIPCollection" }],
        stateMutability: "view",
    },
    {
        name: "get_user_collections",
        type: "function",
        inputs: [{ name: "user", type: "ContractAddress" }],
        outputs: [{ name: "collections", type: "Array<u64>" }],
        stateMutability: "view",
    },
    {
        name: "get_collection_assets",
        type: "function",
        inputs: [{ name: "collection_id", type: "u64" }],
        outputs: [{ name: "assets", type: "Array<u64>" }],
        stateMutability: "view",
    },
    {
        name: "create_collection",
        type: "function",
        inputs: [
            { name: "name", type: "felt252" },
            { name: "description", type: "felt252" },
            { name: "cover_image", type: "felt252" },
            { name: "category", type: "felt252" },
            { name: "is_public", type: "bool" }
        ],
        outputs: [{ name: "collection_id", type: "u64" }],
        stateMutability: "external",
    },
    {
        name: "add_asset_to_collection",
        type: "function",
        inputs: [
            { name: "collection_id", type: "u64" },
            { name: "asset_id", type: "u64" }
        ],
        outputs: [],
        stateMutability: "external",
    },
]

// MIP Protocol Contract Address (from environment or default)
const MIP_COLLECTIONS_CONTRACT = process.env.NEXT_PUBLIC_MIP_COLLECTIONS_CONTRACT || 
    "0x04b67deb64d285d3de684246084e74ad25d459989b7336786886ec63a28e0cd4"

export interface MIPCollection {
    id: string
    name: string
    description: string
    creator: string
    coverImage: string
    category: string
    isPublic: boolean
    isFeatured: boolean
    createdAt: number
    updatedAt: number
    assetCount: number
    contractAddress: string
}

export interface CollectionFilters {
    search?: string
    category?: string
    creator?: string
    sortBy?: "recent" | "name" | "assets" | "views" | "likes"
    featured?: boolean
    isPublic?: boolean
}

export interface PaginatedCollections {
    collections: Collection[]
    total: number
    page: number
    limit: number
    hasMore: boolean
}

export class CollectionsService {
    private provider: RpcProvider
    private contract: Contract | null = null

    constructor() {
        this.provider = starknetService["provider"] // Access the private provider
        this.initializeContract()
    }

    private async initializeContract() {
        try {
            this.contract = new Contract(MIP_COLLECTIONS_ABI, MIP_COLLECTIONS_CONTRACT, this.provider)
        } catch (error) {
            console.error("Failed to initialize MIP Collections contract:", error)
        }
    }

    /**
     * Get all collections with optional filtering and pagination
     */
    public async getCollections(
        filters: CollectionFilters = {},
        page: number = 1,
        limit: number = 20
    ): Promise<PaginatedCollections> {
        try {
            if (!this.contract) {
                throw new Error("Contract not initialized")
            }

            // Get total collection count
            const countResult = await this.contract.call("get_collection_count", [])
            const totalCount = Number(countResult) || 0

            if (totalCount === 0) {
                return {
                    collections: [],
                    total: 0,
                    page,
                    limit,
                    hasMore: false
                }
            }

            // Calculate pagination
            const startIndex = (page - 1) * limit
            const endIndex = Math.min(startIndex + limit, totalCount)
            const collections: Collection[] = []

            // Fetch collections in batches
            for (let i = startIndex; i < endIndex; i++) {
                try {
                    const collectionResult = await this.contract.call("get_collection", [i])
                    const collection = await this.parseCollectionData(collectionResult, i)
                    if (collection && this.matchesFilters(collection, filters)) {
                        collections.push(collection)
                    }
                } catch (error) {
                    console.error(`Error fetching collection ${i}:`, error)
                }
            }

            // Apply sorting
            const sortedCollections = this.sortCollections(collections, filters.sortBy)

            return {
                collections: sortedCollections,
                total: totalCount,
                page,
                limit,
                hasMore: endIndex < totalCount
            }
        } catch (error) {
            console.error("Error fetching collections:", error)
            return {
                collections: [],
                total: 0,
                page,
                limit,
                hasMore: false
            }
        }
    }

    /**
     * Get collections owned by a specific user
     */
    public async getUserCollections(userAddress: string): Promise<Collection[]> {
        try {
            if (!this.contract) {
                throw new Error("Contract not initialized")
            }

            const validAddress = starknetService.validateAddress(userAddress)
            if (!validAddress) {
                throw new Error("Invalid user address")
            }

            const collectionIds = await this.contract.call("get_user_collections", [validAddress])
            const collections: Collection[] = []

            if (Array.isArray(collectionIds)) {
                for (const id of collectionIds) {
                    try {
                        const collectionResult = await this.contract.call("get_collection", [id])
                        const collection = await this.parseCollectionData(collectionResult, Number(id))
                        if (collection) {
                            collections.push(collection)
                        }
                    } catch (error) {
                        console.error(`Error fetching user collection ${id}:`, error)
                    }
                }
            }

            return collections
        } catch (error) {
            console.error("Error fetching user collections:", error)
            return []
        }
    }

    /**
     * Get a specific collection by ID
     */
    public async getCollection(collectionId: string): Promise<Collection | null> {
        try {
            if (!this.contract) {
                throw new Error("Contract not initialized")
            }

            const id = Number(collectionId)
            const collectionResult = await this.contract.call("get_collection", [id])
            return await this.parseCollectionData(collectionResult, id)
        } catch (error) {
            console.error(`Error fetching collection ${collectionId}:`, error)
            return null
        }
    }

    /**
     * Get assets in a specific collection
     */
    public async getCollectionAssets(collectionId: string): Promise<AssetIP[]> {
        try {
            if (!this.contract) {
                throw new Error("Contract not initialized")
            }

            const id = Number(collectionId)
            const assetIds = await this.contract.call("get_collection_assets", [id])
            const assets: AssetIP[] = []

            if (Array.isArray(assetIds)) {
                // TODO: Implement asset fetching from MIP Protocol
                // This would require another contract call to get asset details
                console.log("Asset IDs for collection:", assetIds)
            }

            return assets
        } catch (error) {
            console.error(`Error fetching collection assets ${collectionId}:`, error)
            return []
        }
    }

    /**
     * Create a new collection
     */
    public async createCollection(
        name: string,
        description: string,
        coverImage: string,
        category: string,
        isPublic: boolean
    ): Promise<{ success: boolean; collectionId?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error("Contract not initialized")
            }

            // Convert strings to felt252 format
            const nameField = this.stringToFelt(name)
            const descriptionField = this.stringToFelt(description)
            const coverImageField = this.stringToFelt(coverImage)
            const categoryField = this.stringToFelt(category)

            const result = await this.contract.call("create_collection", [
                nameField,
                descriptionField,
                coverImageField,
                categoryField,
                isPublic
            ])

            const collectionId = Number(result) || 0
            return {
                success: true,
                collectionId: collectionId.toString()
            }
        } catch (error) {
            console.error("Error creating collection:", error)
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to create collection"
            }
        }
    }

    /**
     * Parse collection data from contract response
     */
    private async parseCollectionData(data: any, index: number): Promise<Collection | null> {
        try {
            // This would need to be adjusted based on the actual MIP contract structure
            const collection: Collection = {
                id: index.toString(),
                slug: `collection-${index}`,
                name: this.feltToString(data.name) || `Collection ${index}`,
                description: this.feltToString(data.description) || "",
                coverImage: this.feltToString(data.cover_image) || "/placeholder.svg",
                bannerImage: this.feltToString(data.banner_image) || "",
                creator: {
                    id: data.creator || "unknown",
                    username: `user-${data.creator}`,
                    name: `User ${data.creator}`,
                    avatar: "/placeholder.svg",
                    verified: false,
                    wallet: data.creator || "0x0"
                },
                assets: Number(data.asset_count) || 0,
                floorPrice: data.floor_price ? `${data.floor_price} ETH` : undefined,
                totalVolume: data.total_volume ? `${data.total_volume} ETH` : undefined,
                createdAt: new Date(Number(data.created_at) * 1000).toISOString(),
                updatedAt: new Date(Number(data.updated_at) * 1000).toISOString(),
                category: this.feltToString(data.category) || "digital art",
                tags: this.feltToString(data.tags) || "",
                isPublic: Boolean(data.is_public),
                isFeatured: Boolean(data.is_featured),
                blockchain: "Starknet",
                contractAddress: MIP_COLLECTIONS_CONTRACT
            }

            return collection
        } catch (error) {
            console.error("Error parsing collection data:", error)
            return null
        }
    }

    /**
     * Check if collection matches filters
     */
    private matchesFilters(collection: Collection, filters: CollectionFilters): boolean {
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            const matchesSearch = 
                collection.name.toLowerCase().includes(searchTerm) ||
                collection.description.toLowerCase().includes(searchTerm) ||
                collection.creator.name.toLowerCase().includes(searchTerm)
            if (!matchesSearch) return false
        }

        if (filters.category && filters.category !== "all") {
            if (collection.category.toLowerCase() !== filters.category.toLowerCase()) {
                return false
            }
        }

        if (filters.creator) {
            if (collection.creator.id !== filters.creator) {
                return false
            }
        }

        if (filters.featured !== undefined) {
            if (collection.isFeatured !== filters.featured) {
                return false
            }
        }

        if (filters.isPublic !== undefined) {
            if (collection.isPublic !== filters.isPublic) {
                return false
            }
        }

        return true
    }

    /**
     * Sort collections by specified criteria
     */
    private sortCollections(collections: Collection[], sortBy?: string): Collection[] {
        if (!sortBy) return collections

        return [...collections].sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name)
                case "assets":
                    return b.assets - a.assets
                case "views":
                    // TODO: Implement view count sorting when available
                    return 0
                case "likes":
                    // TODO: Implement like count sorting when available
                    return 0
                case "recent":
                default:
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            }
        })
    }

    /**
     * Convert string to felt252 format
     */
    private stringToFelt(str: string): string {
        // Simple conversion - in production, use proper felt252 encoding
        return str.split('').map(char => char.charCodeAt(0)).join('')
    }

    /**
     * Convert felt252 to string
     */
    private feltToString(felt: any): string {
        try {
            if (typeof felt === 'string') {
                return felt
            }
            if (typeof felt === 'number') {
                return felt.toString()
            }
            return felt?.toString() || ""
        } catch (error) {
            console.error("Error converting felt to string:", error)
            return ""
        }
    }
}

// Export singleton instance
export const collectionsService = new CollectionsService() 