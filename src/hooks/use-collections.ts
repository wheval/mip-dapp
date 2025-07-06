import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { collectionsService, type CollectionFilters, type PaginatedCollections } from '@/src/lib/collections-service'
import type { Collection } from '@/src/types/asset'
import { collections as mockCollections } from '@/src/lib/mock-data'

export type { CollectionFilters } from '@/src/lib/collections-service'

export interface UseCollectionsOptions {
    filters?: CollectionFilters
    page?: number
    limit?: number
    userAddress?: string
}

export interface UseCollectionsReturn {
    collections: Collection[]
    filteredCollections: Collection[]
    featuredCollections: Collection[]
    userCollections: Collection[]
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
        userAddress
    } = options

    const [collections, setCollections] = useState<Collection[]>([])
    const [userCollections, setUserCollections] = useState<Collection[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentFilters, setCurrentFilters] = useState<CollectionFilters>(filters)
    const [page, setPage] = useState(initialPage)
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    
    // Circuit breaker to prevent infinite retries
    const fetchingRef = useRef(false)
    const lastFetchParamsRef = useRef<string>('')
    const errorCountRef = useRef(0)
    const MAX_RETRIES = 3

    // Memoized filtered collections for client-side filtering 
    const filteredCollections = useMemo(() => {
        // Apply client-side filtering 
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
                        return (b.views || 0) - (a.views || 0)
                    case 'likes':
                        return (b.likes || 0) - (a.likes || 0)
                    case 'recent':
                    default:
                        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                }
            })
        }

        return filtered
    }, [collections, currentFilters])

    // Memoized featured collections
    const featuredCollections = useMemo(() => {
        return filteredCollections.filter(collection => collection.isFeatured)
    }, [filteredCollections])

    // Memoized statistics
    const totalAssets = useMemo(() => {
        return filteredCollections.reduce((sum, collection) => sum + collection.assets, 0)
    }, [filteredCollections])

    const totalViews = useMemo(() => {
        return filteredCollections.reduce((sum, collection) => sum + (collection.views || 0), 0)
    }, [filteredCollections])

    const totalLikes = useMemo(() => {
        return filteredCollections.reduce((sum, collection) => sum + (collection.likes || 0), 0)
    }, [filteredCollections])

    // Fetch collections function with circuit breaker - only fetches raw data, no filtering
    const fetchCollections = useCallback(async (pageNum: number = 1, append: boolean = false) => {
        // Create unique key for this fetch request (only based on pagination, not filters)
        const fetchKey = `${pageNum}`
        
        // Prevent duplicate concurrent calls
        if (fetchingRef.current) {
            console.log('Fetch already in progress, skipping...')
            return
        }

        // Check if this is the same request as last time
        if (fetchKey === lastFetchParamsRef.current && !append) {
            console.log('Same fetch params as last time, skipping...')
            return
        }

        // Circuit breaker: stop retrying after max failures
        if (errorCountRef.current >= MAX_RETRIES) {
            console.log(`Max retries (${MAX_RETRIES}) reached, stopping fetch attempts`)
            setError('Unable to connect to contract. Please check your network connection.')
            return
        }

        fetchingRef.current = true
        lastFetchParamsRef.current = fetchKey
        
        if (!append) {
            setIsLoading(true)
        }
        setError(null)

        try {
            // Fetch all collections without server-side filtering for better client-side performance
            console.log('Fetching general collections...', userAddress ? `(wallet connected: ${userAddress})` : '(no wallet connected)')
            const result = await collectionsService.getCollections({}, pageNum, limit) // No filters passed to server
            
            if (append) {
                setCollections(prev => [...prev, ...result.collections])
            } else {
                setCollections(result.collections)
            }
            setTotal(result.total)
            setHasMore(result.hasMore)
            errorCountRef.current = 0 // Reset error count on success
            
            // TODO: In the future, we could add user-specific filtering or additional user collections here
            // when userAddress is available, but for now we show all public collections
        } catch (err) {
            console.error('Error fetching collections:', err)
            errorCountRef.current += 1
            
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch collections'
            setError(`${errorMessage} (Attempt ${errorCountRef.current}/${MAX_RETRIES})`)
            
            // Set empty state on error
            if (!append) {
                setCollections([])
                setTotal(0)
                setHasMore(false)
            }
        } finally {
            setIsLoading(false)
            fetchingRef.current = false
        }
    }, [limit, userAddress]) // Removed currentFilters dependency to prevent reloads on filter changes

    // Load more collections (pagination)
    const loadMore = useCallback(async () => {
        if (hasMore && !fetchingRef.current) {
            const nextPage = page + 1
            setPage(nextPage)
            await fetchCollections(nextPage, true)
        }
    }, [hasMore, page, fetchCollections])

    // Set filters - now purely client-side, no server reload
    const setFilters = useCallback((newFilters: CollectionFilters) => {
        console.log('Setting new filters (client-side only):', newFilters)
        setCurrentFilters(newFilters)
        // No need to reset page or refetch data - filtering is done client-side
    }, [])

    // Fetch user collections
    const fetchUserCollections = useCallback(async () => {
        if (!userAddress) {
            setUserCollections([])
            return
        }

        try {
            console.log('Fetching user collections for:', userAddress)
            const userCollectionsResult = await collectionsService.getUserCollections(userAddress)
            setUserCollections(userCollectionsResult)
        } catch (err) {
            console.error('Error fetching user collections:', err)
            setUserCollections([])
        }
    }, [userAddress])

    // Set page and refetch
    const setPageAndFetch = useCallback((newPage: number) => {
        setPage(newPage)
        fetchCollections(newPage, false)
    }, [fetchCollections])

    // Refetch collections
    const refetch = useCallback(async () => {
        console.log('Manual refetch requested')
        setPage(1)
        setCollections([])
        setUserCollections([]) // Also clear user collections
        errorCountRef.current = 0 // Reset error count on manual refetch
        lastFetchParamsRef.current = '' // Reset fetch params
        await fetchCollections(1, false)
        if (userAddress) {
            await fetchUserCollections() // Also refetch user collections if user is connected
        }
    }, [fetchCollections, fetchUserCollections, userAddress])

    // Create collection function (placeholder - service method doesn't exist yet)
    const createCollection = useCallback(async (data: CreateCollectionData): Promise<CreateCollectionResult> => {
        // TODO: Implement when service method is available
        console.warn('Create collection not implemented yet')
        return {
            success: false,
            error: 'Create collection functionality not implemented yet'
        }
    }, [])

    // Fetch collections only on mount and when essential parameters change
    useEffect(() => {
        console.log('useEffect triggered - fetching collections...')
        fetchCollections(1, false)
    }, [limit, userAddress]) // Only refetch when limit or userAddress changes, not filters

    // Fetch user collections when userAddress changes
    useEffect(() => {
        fetchUserCollections()
    }, [fetchUserCollections])

    return {
        collections,
        filteredCollections,
        featuredCollections,
        userCollections,
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
export function useCollection(collectionIdentifier: string) {
    const [collection, setCollection] = useState<Collection | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCollection = useCallback(async () => {
        if (!collectionIdentifier) return

        setIsLoading(true)
        setError(null)

        try {
            let result: Collection | null = null
            
            // First, try to get by ID if the identifier is numeric
            if (/^\d+$/.test(collectionIdentifier)) {
                console.log(`Fetching collection by ID: ${collectionIdentifier}`)
                result = await collectionsService.getCollection(collectionIdentifier)
            }
            
            // If not found by ID or identifier is not numeric, search by slug
            if (!result) {
                console.log(`Searching for collection by slug: ${collectionIdentifier}`)
                // Get all collections and find by slug
                const allCollectionsResult = await collectionsService.getCollections({}, 1, 100) // Get first 100 collections
                result = allCollectionsResult.collections.find(c => c.slug === collectionIdentifier) || null
                
                if (!result) {
                    // Also try with numeric ID from the identifier
                    const idFromSlug = collectionIdentifier.replace(/^collection-/, '')
                    if (/^\d+$/.test(idFromSlug)) {
                        console.log(`Trying to fetch collection by extracted ID: ${idFromSlug}`)
                        result = await collectionsService.getCollection(idFromSlug)
                    }
                }
            }
            
            if (result) {
                setCollection(result)
                setError(null)
            } else {
                throw new Error(`Collection not found: ${collectionIdentifier}`)
            }
        } catch (err) {
            console.error('Error fetching collection:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch collection')
            
            // Fallback to mock data on error
            const mockCollection = mockCollections.find(c => 
                c.id === collectionIdentifier || 
                c.slug === collectionIdentifier ||
                c.id === collectionIdentifier.replace(/^collection-/, '')
            )
            
            if (mockCollection) {
                setCollection(mockCollection)
                setError(null)
            } else {
                setCollection(null)
            }
        } finally {
            setIsLoading(false)
        }
    }, [collectionIdentifier])

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
export function useCollectionStats() {
    const { collections, totalAssets, totalViews, totalLikes, isLoading, error } = useCollections()

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