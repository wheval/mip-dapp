import { useState, useEffect, useCallback, useMemo } from 'react'
import { collectionsService, type CollectionFilters, type PaginatedCollections } from '@/src/lib/collections-service'
import type { Collection } from '@/src/types/asset'
import { collections as mockCollections } from '@/src/lib/mock-data'

// Re-export types for external use
export type { CollectionFilters } from '@/src/lib/collections-service'

export interface UseCollectionsOptions {
    filters?: CollectionFilters
    page?: number
    limit?: number
    enableRealData?: boolean
    userAddress?: string
}

export interface UseCollectionsReturn {
    collections: Collection[]
    filteredCollections: Collection[]
    featuredCollections: Collection[]
    isLoading: boolean
    error: string | null
    page: number
    limit: number
    total: number
    hasMore: boolean
    totalAssets: number
    totalViews: number
    totalLikes: number
    refetch: () => Promise<void>
    loadMore: () => Promise<void>
    setFilters: (filters: CollectionFilters) => void
    setPage: (page: number) => void
    createCollection: (data: CreateCollectionData) => Promise<CreateCollectionResult>
}

export interface CreateCollectionData {
    name: string
    description: string
    coverImage: string
    category: string
    isPublic: boolean
}

export interface CreateCollectionResult {
    success: boolean
    collectionId?: string
    error?: string
}

/**
 * Hook for managing collections with filtering, pagination, and real-time updates
 */
export function useCollections(options: UseCollectionsOptions = {}): UseCollectionsReturn {
    const {
        filters = {},
        page: initialPage = 1,
        limit = 20,
        enableRealData = false,
        userAddress
    } = options

    const [collections, setCollections] = useState<Collection[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentFilters, setCurrentFilters] = useState<CollectionFilters>(filters)
    const [page, setPage] = useState(initialPage)
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)

    // Memoized filtered collections for client-side filtering (when using mock data)
    const filteredCollections = useMemo(() => {
        if (enableRealData) {
            return collections // Server-side filtering
        }

        // Client-side filtering for mock data
        let filtered = [...collections]

        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase()
            filtered = filtered.filter(collection => 
                collection.name.toLowerCase().includes(searchTerm) ||
                collection.description.toLowerCase().includes(searchTerm) ||
                collection.creator.name.toLowerCase().includes(searchTerm)
            )
        }

        if (currentFilters.category && currentFilters.category !== 'all') {
            filtered = filtered.filter(collection => 
                collection.category.toLowerCase() === currentFilters.category?.toLowerCase()
            )
        }

        if (currentFilters.featured !== undefined) {
            filtered = filtered.filter(collection => 
                collection.isFeatured === currentFilters.featured
            )
        }

        if (currentFilters.isPublic !== undefined) {
            filtered = filtered.filter(collection => 
                collection.isPublic === currentFilters.isPublic
            )
        }

        // Apply sorting
        if (currentFilters.sortBy) {
            filtered.sort((a, b) => {
                switch (currentFilters.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name)
                    case 'assets':
                        return b.assets - a.assets
                    case 'views':
                        // Mock view count based on assets
                        return (b.assets * 47) - (a.assets * 47)
                    case 'likes':
                        // Mock like count based on assets
                        return (b.assets * 12) - (a.assets * 12)
                    case 'recent':
                    default:
                        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                }
            })
        }

        return filtered
    }, [collections, currentFilters, enableRealData])

    // Memoized featured collections
    const featuredCollections = useMemo(() => {
        return filteredCollections.filter(collection => collection.isFeatured)
    }, [filteredCollections])

    // Memoized statistics
    const totalAssets = useMemo(() => {
        return filteredCollections.reduce((sum, collection) => sum + collection.assets, 0)
    }, [filteredCollections])

    const totalViews = useMemo(() => {
        return totalAssets * 47 // Mock calculation
    }, [totalAssets])

    const totalLikes = useMemo(() => {
        return totalAssets * 12 // Mock calculation
    }, [totalAssets])

    // Fetch collections function
    const fetchCollections = useCallback(async (pageNum: number = 1, append: boolean = false) => {
        if (isLoading) return

        setIsLoading(true)
        setError(null)

        try {
            if (enableRealData) {
                // Fetch from MIP Protocol
                if (userAddress) {
                    const userCollections = await collectionsService.getUserCollections(userAddress)
                    setCollections(userCollections)
                    setTotal(userCollections.length)
                    setHasMore(false)
                } else {
                    const result = await collectionsService.getCollections(currentFilters, pageNum, limit)
                    if (append) {
                        setCollections(prev => [...prev, ...result.collections])
                    } else {
                        setCollections(result.collections)
                    }
                    setTotal(result.total)
                    setHasMore(result.hasMore)
                }
            } else {
                // Use mock data
                setCollections(mockCollections)
                setTotal(mockCollections.length)
                setHasMore(false)
            }
        } catch (err) {
            console.error('Error fetching collections:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch collections')
            
            // Fallback to mock data on error
            if (enableRealData) {
                setCollections(mockCollections)
                setTotal(mockCollections.length)
                setHasMore(false)
            }
        } finally {
            setIsLoading(false)
        }
    }, [currentFilters, limit, enableRealData, userAddress, isLoading])

    // Load more collections (pagination)
    const loadMore = useCallback(async () => {
        if (hasMore && !isLoading) {
            const nextPage = page + 1
            setPage(nextPage)
            await fetchCollections(nextPage, true)
        }
    }, [hasMore, isLoading, page, fetchCollections])

    // Set filters and refetch
    const setFilters = useCallback((newFilters: CollectionFilters) => {
        setCurrentFilters(newFilters)
        setPage(1)
        setCollections([])
    }, [])

    // Set page and refetch
    const setPageAndFetch = useCallback((newPage: number) => {
        setPage(newPage)
        fetchCollections(newPage, false)
    }, [fetchCollections])

    // Refetch collections
    const refetch = useCallback(async () => {
        setPage(1)
        setCollections([])
        await fetchCollections(1, false)
    }, [fetchCollections])

    // Create collection function
    const createCollection = useCallback(async (data: CreateCollectionData): Promise<CreateCollectionResult> => {
        try {
            if (enableRealData) {
                const result = await collectionsService.createCollection(
                    data.name,
                    data.description,
                    data.coverImage,
                    data.category,
                    data.isPublic
                )

                if (result.success) {
                    // Refetch collections to include the new one
                    await refetch()
                }

                return result
            } else {
                // Mock creation for development
                return {
                    success: true,
                    collectionId: `mock-${Date.now()}`
                }
            }
        } catch (error) {
            console.error('Error creating collection:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create collection'
            }
        }
    }, [enableRealData, refetch])

    // Initial fetch and refetch when filters change
    useEffect(() => {
        fetchCollections(1, false)
    }, [fetchCollections])

    // Refetch when filters change
    useEffect(() => {
        if (page === 1) {
            fetchCollections(1, false)
        }
    }, [currentFilters, page, fetchCollections])

    return {
        collections,
        filteredCollections,
        featuredCollections,
        isLoading,
        error,
        page,
        limit,
        total,
        hasMore,
        totalAssets,
        totalViews,
        totalLikes,
        refetch,
        loadMore,
        setFilters,
        setPage: setPageAndFetch,
        createCollection
    }
}

/**
 * Hook for managing a single collection
 */
export function useCollection(collectionId: string, enableRealData: boolean = false) {
    const [collection, setCollection] = useState<Collection | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCollection = useCallback(async () => {
        if (!collectionId) return

        setIsLoading(true)
        setError(null)

        try {
            if (enableRealData) {
                const result = await collectionsService.getCollection(collectionId)
                setCollection(result)
            } else {
                // Find in mock data
                const mockCollection = mockCollections.find(c => c.id === collectionId || c.slug === collectionId)
                setCollection(mockCollection || null)
            }
        } catch (err) {
            console.error('Error fetching collection:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch collection')
        } finally {
            setIsLoading(false)
        }
    }, [collectionId, enableRealData])

    useEffect(() => {
        fetchCollection()
    }, [fetchCollection])

    return {
        collection,
        isLoading,
        error,
        refetch: fetchCollection
    }
}

/**
 * Hook for managing collection stats
 */
export function useCollectionStats(enableRealData: boolean = false) {
    const { collections, totalAssets, totalViews, totalLikes, isLoading, error } = useCollections({
        enableRealData
    })

    const stats = useMemo(() => {
        return {
            totalCollections: collections.length,
            totalAssets,
            totalViews,
            totalLikes,
            featuredCollections: collections.filter(c => c.isFeatured).length,
            publicCollections: collections.filter(c => c.isPublic).length,
            privateCollections: collections.filter(c => !c.isPublic).length,
            categoriesCount: new Set(collections.map(c => c.category)).size,
            averageAssetsPerCollection: collections.length > 0 ? Math.round(totalAssets / collections.length) : 0
        }
    }, [collections, totalAssets, totalViews, totalLikes])

    return {
        stats,
        isLoading,
        error
    }
} 