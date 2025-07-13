import { RpcProvider, Contract, CallData, num, validateAndParseAddress } from "starknet"
import { starknetService } from "../services/starknet.service"
import type { Collection, AssetIP } from "@/src/types/asset"
import { ip_collection_abi } from "@/src/abi/ip_collection"

// MIP Protocol Contract ABI for collections
const MIP_COLLECTIONS_ABI = ip_collection_abi
// MIP Protocol Contract Address (from environment or default)
const MIP_COLLECTIONS_CONTRACT = process.env.NEXT_PUBLIC_COLLECTION_FACTORY_ADDRESS 

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

// Define the CollectionStats interface based on ABI
export interface CollectionStats {
    total_supply: bigint | string | number
    minted: bigint | string | number
    burned: bigint | string | number
    last_mint_batch_id: bigint | string | number
    last_mint_time: bigint | string | number
}

// Define Token interface based on ABI
export interface ContractToken {
    collection_id: bigint | string | number
    token_id: bigint | string | number
    owner: string
    metadata_uri: string
}

// Define Collection Metadata interface from IPFS
export interface CollectionMetadata {
    name: string
    description: string
    image: string
    external_url?: string
    type?: string
    category?: string
    visibility?: string
    tags?: string[]
    createdAt?: string
    featured?: boolean
    banner_image?: string
    coverImage?: string // Alternative field name for image
    properties?: Record<string, any>
}

export class CollectionsService {
    private provider: RpcProvider
    private contract: Contract | null = null
    private contractAvailable: boolean = false

    constructor() {
        this.provider = starknetService["provider"] 
        this.initializeContract()
    }

    private async initializeContract() {
        try {
            if (!MIP_COLLECTIONS_CONTRACT) {
                console.warn("MIP Collections contract address not configured")
                return
            }
            this.contract = new Contract(MIP_COLLECTIONS_ABI, MIP_COLLECTIONS_CONTRACT, this.provider)
            this.contractAvailable = true
        } catch (error) {
            console.error("Failed to initialize MIP Collections contract:", error)
            this.contractAvailable = false
        }
    }

    /**
     * Get all collections by discovering them through tokens
     * Since there's no direct method to list all collections,
     * we use list_all_tokens() and extract unique collection IDs
     */
    public async getCollections(
        filters: CollectionFilters = {},
        page: number = 1,
        limit: number = 20
    ): Promise<PaginatedCollections> {
        try {
            if (!this.contractAvailable || !this.contract) {
                return {
                    collections: [],
                    total: 0,
                    page,
                    limit,
                    hasMore: false
                }
            }

            const collectionIds = await this.discoverCollectionIds()
            
            if (collectionIds.length === 0) {
                return {
                    collections: [],
                    total: 0,
                    page,
                    limit,
                    hasMore: false
                }
            }

            const collections: Collection[] = []
            for (const collectionId of collectionIds) {
                try {
                    const collection = await this.getCollection(collectionId.toString())
                    if (collection && this.matchesFilters(collection, filters)) {
                        collections.push(collection)
                    }
                } catch (error) {
                    console.error(`Error fetching collection ${collectionId}:`, error)
                }
            }

            const sortedCollections = this.sortCollections(collections, filters.sortBy)

            const startIndex = (page - 1) * limit
            const endIndex = startIndex + limit
            const paginatedCollections = sortedCollections.slice(startIndex, endIndex)

            return {
                collections: paginatedCollections,
                total: sortedCollections.length,
                page,
                limit,
                hasMore: endIndex < sortedCollections.length
            }
        } catch (error) {
            console.error("Error in getCollections:", error)
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
     * Discover collection IDs by listing all tokens and extracting unique collection IDs
     */
    private async discoverCollectionIds(): Promise<number[]> {
        try {
            if (!this.contract) return []

            const tokenIds = await this.contract.call("list_all_tokens", [])
            
            if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
                return []
            }

            console.log(`Found ${tokenIds.length} tokens, extracting collection IDs...`)
            const collectionIdSet = new Set<number>()

            // Get collection ID for each token
             for (const tokenId of tokenIds.slice(0, 50)) { // Limit to first 50 tokens to avoid too many calls
                 try {
                     const token = await this.contract.call("get_token", [tokenId]) as any
                     if (token && token.collection_id) {
                         const collectionId = Number(token.collection_id)
                         collectionIdSet.add(collectionId)
                     }
                 } catch (error) {
                     console.error(`Error getting token ${tokenId}:`, error)
                 }
             }

            const uniqueCollectionIds = Array.from(collectionIdSet)
            console.log(`Collection discovery complete: Found ${uniqueCollectionIds.length} unique collections from ${tokenIds.length} tokens`)
            return uniqueCollectionIds
        } catch (error) {
            console.error("Error discovering collection IDs:", error)
            return []
        }
    }

    /**
     * Get collections owned by a specific user
     */
    public async getUserCollections(userAddress: string): Promise<Collection[]> {
        try {
            if (!this.contractAvailable || !this.contract) {
                return []
            }

            const validAddress = starknetService.validateAddress(userAddress)
            if (!validAddress) {
                throw new Error("Invalid user address")
            }

            const collectionIds = await this.contract.call("list_user_collections", [validAddress])
            const collections: Collection[] = []

            if (Array.isArray(collectionIds) && collectionIds.length > 0) {
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
            if (!this.contractAvailable || !this.contract) {
                return null
            }

            const id = Number(collectionId)
            
            // First check if the collection is valid
            const isValid = await this.contract.call("is_valid_collection", [id])
            if (!isValid) {
                console.log(`Collection ${id} is not valid`)
                return null
            }

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
            if (!this.contractAvailable || !this.contract) {
                return []
            }

            const id = Number(collectionId)
            const tokenIds = await this.contract.call("list_collection_tokens", [id])
            const assets: AssetIP[] = []

            if (Array.isArray(tokenIds) && tokenIds.length > 0) {
                                 for (const tokenId of tokenIds) {
                     try {
                         const token = await this.contract.call("get_token", [tokenId]) as any
                         const asset = await this.parseTokenToAsset(token, tokenId)
                         if (asset) {
                             assets.push(asset)
                         }
                     } catch (error) {
                         console.error(`Error processing token ${tokenId}:`, error)
                     }
                 }
            }

            return assets
        } catch (error) {
            console.error(`Error fetching collection assets ${collectionId}:`, error)
            return []
        }
    }

    /**
     * Parse a contract token to AssetIP format
     */
    private async parseTokenToAsset(token: any, tokenId: any): Promise<AssetIP | null> {
        try {
            // Start with basic asset structure
            let asset: AssetIP = {
                id: tokenId.toString(),
                slug: `asset-${tokenId}`,
                title: `Asset ${tokenId}`,
                author: token.owner || "Unknown",
                description: `IP Asset with token ID ${tokenId}`,
                type: "digital art", // Default fallback, will be updated from IPFS metadata
                template: "default",
                collection: token.collection_id?.toString() || "unknown",
                collectionSlug: `collection-${token.collection_id}`,
                tags: "",
                mediaUrl: "/placeholder.svg",
                externalUrl: "",
                licenseType: "Standard",
                licenseDetails: "Default license",
                ipVersion: "1.0",
                commercialUse: true,
                modifications: true,
                attribution: true,
                registrationDate: new Date().toISOString(),
                protectionStatus: "Active",
                protectionScope: "Global",
                protectionDuration: "Perpetual",
                creator: {
                    id: this.formatAddressAsHex(token.owner) || "unknown",
                    username: `user-${this.formatAddressAsHex(token.owner)}`,
                    name: `User ${this.formatAddressAsHex(token.owner)}`,
                    avatar: "/placeholder.svg",
                    verified: false,
                    wallet: this.formatAddressAsHex(token.owner) || "0x0"
                },
                timestamp: new Date().toISOString(),
                blockchain: "Starknet",
                contractAddress: MIP_COLLECTIONS_CONTRACT,
                tokenId: tokenId.toString(),
                metadataUri: token.metadata_uri
            }

            // Try to fetch metadata from IPFS using metadata_uri
            if (token.metadata_uri) {
                console.log(`Fetching IPFS metadata for token ${tokenId} from:`, token.metadata_uri)
                try {
                    const metadata = await this.fetchIPFSMetadata(token.metadata_uri)
                    if (metadata) {
                        console.log(`Successfully fetched metadata for token ${tokenId}:`, metadata)
                        
                        // Update asset with IPFS metadata
                        asset.title = metadata.name || asset.title
                        asset.description = metadata.description || asset.description
                        asset.mediaUrl = this.processImageData(metadata.image)
                        asset.externalUrl = metadata.external_url || asset.externalUrl
                        
                        // Handle asset type based on metadata - prioritize 'type' field over 'category'
                        const assetType = metadata.type || metadata.category
                        if (assetType) {
                            asset.type = assetType.toLowerCase()
                        }
                        
                        // Handle tags
                        if (metadata.tags && Array.isArray(metadata.tags)) {
                            asset.tags = metadata.tags.join(", ")
                        }
                        
                        // Update slug to be more descriptive
                        if (metadata.name) {
                            asset.slug = metadata.name.toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '') || asset.slug
                        }
                        
                        // Handle additional properties for IP-specific data
                        if (metadata.properties) {
                            asset.licenseType = metadata.properties.license_type || asset.licenseType
                            asset.licenseDetails = metadata.properties.license_details || asset.licenseDetails
                            asset.ipVersion = metadata.properties.ip_version || asset.ipVersion
                            asset.commercialUse = metadata.properties.commercial_use !== undefined 
                                ? Boolean(metadata.properties.commercial_use) 
                                : asset.commercialUse
                            asset.modifications = metadata.properties.modifications !== undefined 
                                ? Boolean(metadata.properties.modifications) 
                                : asset.modifications
                            asset.attribution = metadata.properties.attribution !== undefined 
                                ? Boolean(metadata.properties.attribution) 
                                : asset.attribution
                        }
                    } else {
                        console.warn(`Failed to fetch IPFS metadata for token ${tokenId}, using contract data`)
                    }
                } catch (ipfsError) {
                    console.warn(`IPFS fetch failed for token ${tokenId}:`, ipfsError)
                    // Continue with contract data as fallback
                }
            }

            return asset
        } catch (error) {
            console.error("Error parsing token to asset:", error)
            return null
        }
    }

    /**
     * Get user tokens
     */
    public async getUserTokens(userAddress: string): Promise<AssetIP[]> {
        try {
            if (!this.contractAvailable || !this.contract) {
                return []
            }

            const validAddress = starknetService.validateAddress(userAddress)
            if (!validAddress) {
                throw new Error("Invalid user address")
            }

            const tokenIds = await this.contract.call("list_user_tokens", [validAddress])
            const assets: AssetIP[] = []

            if (Array.isArray(tokenIds) && tokenIds.length > 0) {
                    for (const tokenId of tokenIds) {
                     try {
                         const token = await this.contract.call("get_token", [tokenId]) as any
                         const asset = await this.parseTokenToAsset(token, tokenId)
                         if (asset) {
                             assets.push(asset)
                         }
                     } catch (error) {
                         console.error(`Error processing user token ${tokenId}:`, error)
                     }
                 }
            }

            return assets
        } catch (error) {
            console.error("Error fetching user tokens:", error)
            return []
        }
    }

    /**
     * Check if user owns a collection
     */
    public async isCollectionOwner(collectionId: string, userAddress: string): Promise<boolean> {
        try {
            if (!this.contractAvailable || !this.contract) {
                return false
            }

            const validAddress = starknetService.validateAddress(userAddress)
            if (!validAddress) {
                return false
            }

            const id = Number(collectionId)
            const isOwner = await this.contract.call("is_collection_owner", [id, validAddress])
            return Boolean(isOwner)
        } catch (error) {
            console.error("Error checking collection ownership:", error)
            return false
        }
    }

    /**
     * Get token balance for a user
     */
    public async getUserTokenBalance(userAddress: string): Promise<number> {
        try {
            if (!this.contractAvailable || !this.contract) {
                return 0
            }

            const validAddress = starknetService.validateAddress(userAddress)
            if (!validAddress) {
                return 0
            }

            const balance = await this.contract.call("balance_of", [validAddress])
            return Number(balance) || 0
        } catch (error) {
            console.error("Error getting user token balance:", error)
            return 0
        }
    }

    /**
     * Fetch metadata from IPFS using the hash
     */
    private async fetchIPFSMetadata(ipfsHash: string): Promise<CollectionMetadata | null> {
        try {
            if (!ipfsHash) {
                console.warn("No IPFS hash provided")
                return null
            }

            // Clean the IPFS hash (remove ipfs:// prefix if present)
            const cleanHash = ipfsHash.replace(/^ipfs:\/\//, '')
            
            // Try multiple IPFS gateways for better reliability
            const gateways = [
                `https://ipfs.io/ipfs/${cleanHash}`,
                `https://gateway.pinata.cloud/ipfs/${cleanHash}`,
                `https://cloudflare-ipfs.com/ipfs/${cleanHash}`,
                `https://dweb.link/ipfs/${cleanHash}`
            ]

            for (const gateway of gateways) {
                try {
                    console.log(`Fetching IPFS metadata from: ${gateway}`)
                    
                    // Create a timeout controller for better browser compatibility
                    const controller = new AbortController()
                    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
                    
                    const response = await fetch(gateway, {
                        headers: {
                            'Accept': 'application/json',
                        },
                        signal: controller.signal
                    })
                    
                    clearTimeout(timeoutId)

                    if (!response.ok) {
                        console.warn(`IPFS gateway ${gateway} returned ${response.status}`)
                        continue
                    }

                    const metadata = await response.json()
                    console.log("Successfully fetched IPFS metadata:", metadata)
                    return metadata as CollectionMetadata
                } catch (gatewayError) {
                    if (gatewayError instanceof Error && gatewayError.name === 'AbortError') {
                        console.warn(`Timeout fetching from gateway ${gateway}`)
                    } else {
                        console.warn(`Failed to fetch from gateway ${gateway}:`, gatewayError)
                    }
                    continue
                }
            }

            console.error("All IPFS gateways failed for hash:", cleanHash)
            return null
        } catch (error) {
            console.error("Error fetching IPFS metadata:", error)
            return null
        }
    }

    /**
     * Format address as hex with 0x prefix
     */
    private formatAddressAsHex(address: any): string {
        if (!address) return "0x0"
        
        // Convert to string first
        let addressStr = address.toString()
        
        // If it's already hex with 0x prefix, return as is
        if (addressStr.startsWith('0x')) {
            return addressStr
        }
        
        // If it's a decimal number, convert to hex
        if (/^\d+$/.test(addressStr)) {
            return `0x${BigInt(addressStr).toString(16)}`
        }
        
        // If it's hex without 0x prefix, add it
        if (/^[a-fA-F0-9]+$/.test(addressStr)) {
            return `0x${addressStr}`
        }
        
        // Fallback
        return addressStr.startsWith('0x') ? addressStr : `0x${addressStr}`
    }

    /**
     * Convert base64 image to data URL or handle regular URLs
     */
    private processImageData(imageData: string): string {
        try {
            if (!imageData) {
                return "/placeholder.svg"
            }

            // If it's already a data URL, return as is
            if (imageData.startsWith('data:')) {
                return imageData
            }

            // If it's a regular URL (http/https), return as is
            if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
                return imageData
            }

            // If it's an IPFS URL, convert to gateway URL
            if (imageData.startsWith('ipfs://')) {
                const hash = imageData.replace('ipfs://', '')
                return `https://ipfs.io/ipfs/${hash}`
            }

            // If it looks like base64 data (no data: prefix), add the prefix
            if (imageData.match(/^[A-Za-z0-9+/=]+$/)) {
                // Try to detect image format (assume PNG if not specified)
                const mimeType = imageData.charAt(0) === '/' ? 'image/jpeg' : 'image/png'
                return `data:${mimeType};base64,${imageData}`
            }

            // Fallback to placeholder
            console.warn("Unknown image format, using placeholder:", imageData.substring(0, 100))
            return "/placeholder.svg"
        } catch (error) {
            console.error("Error processing image data:", error)
            return "/placeholder.svg"
        }
    }

    /**
     * Create a new collection
     */
    // public async createCollection(
    //     name: string,
    //     description: string,
    //     coverImage: string,
    //     category: string,
    //     isPublic: boolean
    // ): Promise<{ success: boolean; collectionId?: string; error?: string }> {
    //     try {
    //         if (!this.contractAvailable || !this.contract) {
    //             return {
    //                 success: false,
    //                 error: "Contract not available"
    //             }
    //         }

    //         console.log("Creating collection:", { name, description, coverImage, category, isPublic })

    //         // The ABI shows create_collection takes: name, symbol, base_uri
    //         // We'll use the name for both name and symbol, and coverImage as base_uri
    //         const result = await this.contract.call("create_collection", [
    //             name,          // name: ByteArray
    //             name,          // symbol: ByteArray (using name as symbol for simplicity)
    //             coverImage     // base_uri: ByteArray
    //         ])

    //         const collectionId = result?.toString() || "0"
    //         console.log("Collection created with ID:", collectionId)
            
    //         return {
    //             success: true,
    //             collectionId
    //         }
    //     } catch (error) {
    //         console.error("Error creating collection:", error)
    //         return {
    //             success: false,
    //             error: error instanceof Error ? error.message : "Failed to create collection"
    //         }
    //     }
    // }

    /**
     * Parse collection data from contract response
     */
    private async parseCollectionData(data: any, index: number): Promise<Collection | null> {
        try {
            console.log("Parsing collection data:", data)
            
            // Start with basic collection structure using contract data
            // Based on the ABI, Collection struct has: name, symbol, base_uri, owner, is_active
            let collection: Collection = {
                id: index.toString(),
                slug: `collection-${index}`,
                name: data.name || `Collection ${index}`,
                description: data.symbol || "",
                coverImage: "/placeholder.svg",
                bannerImage: "",
                creator: {
                    id: this.formatAddressAsHex(data.owner) || "unknown",
                    username: `user-${this.formatAddressAsHex(data.owner)}`,
                    name: `User ${this.formatAddressAsHex(data.owner)}`,
                    avatar: "/placeholder.svg",
                    verified: false,
                    wallet: this.formatAddressAsHex(data.owner) || "0x0"
                },
                assets: 0, // Will be populated by getCollectionStats
                views: undefined, // No views tracking in current contract
                likes: undefined, // No likes tracking in current contract
                floorPrice: undefined,
                totalVolume: undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                category: "digital art", // Default fallback, will be updated from IPFS metadata
                tags: "",
                isPublic: Boolean(data.is_active),
                isFeatured: false,
                blockchain: "Starknet",
                contractAddress: MIP_COLLECTIONS_CONTRACT
            }

            // Try to fetch metadata from IPFS using base_uri
            if (data.base_uri) {
                console.log(`Fetching IPFS metadata for collection ${index} from:`, data.base_uri)
                try {
                    const metadata = await this.fetchIPFSMetadata(data.base_uri)
                    if (metadata) {
                        collection.name = metadata.name || collection.name
                        collection.description = metadata.description || collection.description
                        
                        // Handle cover image - check both 'image' and 'coverImage' fields
                        const imageData = metadata.image || metadata.coverImage
                        if (imageData) {
                            collection.coverImage = this.processImageData(imageData)
                        }
                        
                        // Handle banner image if available
                        if (metadata.banner_image) {
                            collection.bannerImage = this.processImageData(metadata.banner_image)
                        }
                        
                        // Handle type/category - prioritize 'type' field over 'category'
                        const categoryType = metadata.type || metadata.category
                        if (categoryType) {
                            collection.category = categoryType.toLowerCase()
                        }
                        
                        // Handle visibility/public status
                        if (metadata.visibility) {
                            collection.isPublic = metadata.visibility.toLowerCase() === 'public'
                        }
                        
                        // Handle tags
                        if (metadata.tags && Array.isArray(metadata.tags)) {
                            collection.tags = metadata.tags.join(", ")
                        }
                        
                        // Handle featured status
                        if (metadata.featured !== undefined) {
                            collection.isFeatured = Boolean(metadata.featured)
                        }
                        
                        if (metadata.createdAt) {
                            try {
                                const parsedDate = new Date(metadata.createdAt)
                                if (!isNaN(parsedDate.getTime())) {
                                    collection.createdAt = parsedDate.toISOString()
                                    collection.updatedAt = parsedDate.toISOString()
                                } else {
                                    console.warn(`Invalid date format in IPFS metadata: ${metadata.createdAt}`)
                                }
                            } catch (dateError) {
                                console.warn(`Error parsing date from IPFS metadata: ${metadata.createdAt}`, dateError)
                            }
                        }
                        
                        // Update slug to be more descriptive, but fallback to ID-based slug
                        if (metadata.name) {
                            const nameSlug = metadata.name.toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '')
                            collection.slug = nameSlug || `collection-${index}`
                        }
                    } else {
                        console.warn(`Failed to fetch IPFS metadata for collection ${index}, using contract data`)
                    }
                } catch (ipfsError) {
                    console.warn(`IPFS fetch failed for collection ${index}:`, ipfsError)
                    // Continue with contract data as fallback
                }
            } else {
                console.warn(`No base_uri found for collection ${index}`)
                // Ensure we have a valid slug even without IPFS metadata
                collection.slug = `collection-${index}`
            }

            // Try to get collection stats if available
            try {
                const stats = await this.contract!.call("get_collection_stats", [index]) as CollectionStats
                if (stats) {
                    collection.assets = Number(stats.minted || stats.total_supply || 0)
                }
            } catch (statsError) {
                console.warn(`Could not fetch stats for collection ${index}:`, statsError)
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
     * Check if the contract is available and initialized
     */
    public isContractAvailable(): boolean {
        return this.contractAvailable && this.contract !== null
    }

    /**
     * Get contract status for debugging
     */
    public getContractStatus(): { available: boolean; address?: string; error?: string } {
        return {
            available: this.contractAvailable,
            address: MIP_COLLECTIONS_CONTRACT,
            error: !this.contractAvailable ? "Contract not initialized or address not configured" : undefined
        }
    }

    /**
     * Get comprehensive collection statistics with proper token grouping validation
     */
    public async getCollectionGroupingStats(collectionId: string): Promise<{
        collectionId: string
        totalTokens: number
        uniqueOwners: number
        tokensByOwner: Record<string, number>
        groupingValid: boolean
        lastValidation: string
    } | null> {
        try {
            if (!this.contractAvailable || !this.contract) {
                return null
            }

            const id = Number(collectionId)
            console.log("Getting comprehensive stats for collection:", id)

            // Get all tokens in this collection
            const tokenIds = await this.contract.call("list_collection_tokens", [id])
            if (!Array.isArray(tokenIds)) {
                return null
            }

            // Validate grouping by checking each token's collection_id
            const tokensByOwner: Record<string, number> = {}
            let groupingValid = true
            
            for (const tokenId of tokenIds) {
                try {
                    const token = await this.contract.call("get_token", [tokenId]) as any
                    
                    // Validate that token belongs to this collection
                    if (Number(token.collection_id) !== id) {
                        console.warn(`Grouping error: Token ${tokenId} reports collection ${token.collection_id} but found in collection ${id}`)
                        groupingValid = false
                    }
                    
                    // Count tokens by owner
                    const ownerAddress = this.formatAddressAsHex(token.owner)
                    tokensByOwner[ownerAddress] = (tokensByOwner[ownerAddress] || 0) + 1
                } catch (error) {
                    console.error(`Error validating token ${tokenId}:`, error)
                    groupingValid = false
                }
            }

            return {
                collectionId: collectionId,
                totalTokens: tokenIds.length,
                uniqueOwners: Object.keys(tokensByOwner).length,
                tokensByOwner,
                groupingValid,
                lastValidation: new Date().toISOString()
            }
        } catch (error) {
            console.error("Error getting collection grouping stats:", error)
            return null
        }
    }
}

// Export singleton instance
export const collectionsService = new CollectionsService() 