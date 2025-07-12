// "use client"

// import type React from "react"
// import { useState, useRef, useCallback, useMemo, useEffect } from "react"
// import { Button } from "@/src/components/ui/button"
// import { Card, CardContent } from "@/src/components/ui/card"
// import { Input } from "@/src/components/ui/input"
// import { Label } from "@/src/components/ui/label"
// import { Textarea } from "@/src/components/ui/textarea"
// import { Badge } from "@/src/components/ui/badge"
// import { Progress } from "@/src/components/ui/progress"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
// import { Switch } from "@/src/components/ui/switch"
// import { Separator } from "@/src/components/ui/separator"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
// import { PinInput } from "@/src/components/pin-input"
// import {
//   Upload,
//   ImageIcon,
//   Music,
//   Video,
//   FileText,
//   Palette,
//   Shield,
//   Zap,
//   Clock,
//   Globe,
//   X,
//   Plus,
//   CheckCircle,
//   LinkIcon,
//   ChevronDown,
//   ChevronUp,
//   Sparkles,
//   Camera,
//   PenTool,
//   Hash,
//   Settings,
//   Info,
//   Eye,
//   Wand2,
//   MessageSquare,
//   Folder,
//   ExternalLink,
//   ImageIcon as ImageLucide,
// } from "lucide-react"
// import Image from "next/image"
// import { toast } from "@/src/hooks/use-toast"
// import { useRouter } from "next/navigation"
// import { useCallAnyContract } from "@chipi-pay/chipi-sdk"
// import { getWalletData } from "@/src/app/onboarding/_actions"
// import { useAuth } from "@clerk/nextjs"

// // Mediolano Protocol contract address
// const MEDIOLANO_CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP || "0x04b67deb64d285d3de684246084e74ad25d459989b7336786886ec63a28e0cd4"

// interface AssetData {
//   // Essential fields
//   title: string
//   description: string
//   mediaUrl: string
//   externalUrl: string

//   // Advanced fields with defaults
//   type: string
//   tags: string[]
//   author: string
//   collection: string
//   licenseType: string
//   licenseDetails: string
//   ipVersion: string
//   commercialUse: boolean
//   modifications: boolean
//   attribution: boolean
//   registrationDate: string
//   protectionStatus: string
//   protectionScope: string
//   protectionDuration: string
// }

// const assetTypes = [
//   {
//     id: "post",
//     icon: MessageSquare,
//     label: "Post",
//     color: "from-blue-500 to-cyan-500",
//     description: "Social media style post",
//   },
//   {
//     id: "art",
//     icon: Palette,
//     label: "Art",
//     color: "from-pink-500 to-rose-500",
//     description: "Digital art & illustrations",
//   },
//   {
//     id: "music",
//     icon: Music,
//     label: "Music",
//     color: "from-purple-500 to-pink-500",
//     description: "Audio & compositions",
//   },
//   { id: "video", icon: Video, label: "Video", color: "from-red-500 to-orange-500", description: "Films & animations" },
//   {
//     id: "document",
//     icon: FileText,
//     label: "Document",
//     color: "from-blue-500 to-cyan-500",
//     description: "Text & research",
//   },
//   {
//     id: "image",
//     icon: ImageIcon,
//     label: "Photo",
//     color: "from-green-500 to-emerald-500",
//     description: "Photography & images",
//   },
// ]

// const collections = [
//   { value: "mip-collection", label: "MIP Collection", description: "Default MIP collection" },
//   { value: "art-gallery", label: "Art Gallery", description: "Curated art collection" },
//   { value: "music-vault", label: "Music Vault", description: "Audio collection" },
//   { value: "digital-assets", label: "Digital Assets", description: "Mixed media collection" },
//   { value: "exclusive-drops", label: "Exclusive Drops", description: "Limited releases" },
//   { value: "community-picks", label: "Community Picks", description: "Community favorites" },
// ]

// const quickTags = [
//   "Original",
//   "Creative",
//   "Digital",
//   "Exclusive",
//   "Limited",
//   "Art",
//   "Music",
//   "Video",
//   "Design",
//   "NFT",
//   "Blockchain",
//   "IP",
// ]

// export default function CreatePage() {
//   const router = useRouter()

//   const { getToken } = useAuth()
//   const { callAnyContractAsync, callAnyContractData, isLoading: isMinting, error: mintError } = useCallAnyContract()

//   // Upload and media state
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [isUploading, setIsUploading] = useState(false)
//   const [mediaFile, setMediaFile] = useState<File | null>(null)
//   const [mediaPreview, setMediaPreview] = useState("")
//   const [isDragOver, setIsDragOver] = useState(false)
//   const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
//   const [newTag, setNewTag] = useState("")
//   const [mediaType, setMediaType] = useState<"upload" | "url">("upload")

//   // Wallet and minting state
//   const [walletData, setWalletData] = useState<{
//     publicKey: string;
//     encryptedPrivateKey: string
//   } | null>(null)
//   const [showPinDialog, setShowPinDialog] = useState(false)
//   const [isPinSubmitting, setIsPinSubmitting] = useState(false)
//   const [pinError, setPinError] = useState("")
//   const [txHash, setTxHash] = useState("")
//   const [tokenId, setTokenId] = useState("")

//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const [assetData, setAssetData] = useState<AssetData>({
//     // Essential fields - empty by default for user input
//     title: "",
//     description: "",
//     mediaUrl: "",
//     externalUrl: "",

//     // Advanced fields with smart defaults
//     type: "post", // Default to "Post" like social media
//     tags: [],
//     author: "Anonymous Creator",
//     collection: "mip-collection", // Default to MIP Collection
//     licenseType: "all-rights",
//     licenseDetails: "",
//     ipVersion: "1.0",
//     commercialUse: false,
//     modifications: false,
//     attribution: true,
//     registrationDate: new Date().toISOString().split("T")[0],
//     protectionStatus: "Protected",
//     protectionScope: "Global",
//     protectionDuration: "Life + 70 years",
//   })

//   // Load wallet data on component mount
//   useEffect(() => {
//     const loadWallet = async () => {
//       try {
//         const data = await getWalletData()
//         if (data?.publicKey && data?.encryptedPrivateKey) {
//           setWalletData(data)
//         } else {
//           toast({
//             title: "Wallet Not Found",
//             description: "Please complete onboarding to create your wallet",
//             variant: "destructive",
//           })
//           router.push("/onboarding")
//         }
//       } catch (error) {
//         console.error('Error loading wallet:', error)
//         toast({
//           title: "Error Loading Wallet",
//           description: "Failed to load wallet data",
//           variant: "destructive",
//         })
//       }
//     }
//     loadWallet()
//   }, [router])

//   // Memoize computed values to prevent recalculation during render
//   const isEssentialComplete = useMemo(() => {
//     return assetData.title.trim() !== "" && assetData.description.trim() !== ""
//   }, [assetData.title, assetData.description])

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(true)
//   }, [])

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(false)
//   }, [])

//   const handleFileUpload = useCallback((file: File) => {
//     setMediaFile(file)
//     setIsUploading(true)
//     setUploadProgress(0)

//     // Simulate upload progress
//     const interval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval)
//           setIsUploading(false)

//           // Create preview URL
//           const reader = new FileReader()
//           reader.onload = (e) => {
//             const result = e.target?.result as string
//             setMediaPreview(result)
//             setAssetData((prev) => ({ ...prev, mediaUrl: result }))
//           }
//           reader.readAsDataURL(file)

//           toast({
//             title: "Upload Complete! ✨",
//             description: "Your media is ready",
//           })
//           return 100
//         }
//         return prev + 15
//       })
//     }, 150)
//   }, [])

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       setIsDragOver(false)
//       const files = e.dataTransfer.files
//       if (files.length > 0) {
//         handleFileUpload(files[0])
//       }
//     },
//     [handleFileUpload],
//   )

//   const handleFileSelect = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const file = event.target.files?.[0]
//       if (file) {
//         handleFileUpload(file)
//       }
//     },
//     [handleFileUpload],
//   )

//   const handleUrlChange = useCallback((url: string) => {
//     setAssetData((prev) => ({ ...prev, mediaUrl: url }))
//     setMediaPreview(url)
//   }, [])

//   const addTag = useCallback(
//     (tag: string) => {
//       if (tag && !assetData.tags.includes(tag)) {
//         setAssetData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
//       }
//       setNewTag("")
//     },
//     [assetData.tags],
//   )

//   const removeTag = useCallback((tagToRemove: string) => {
//     setAssetData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((tag) => tag !== tagToRemove),
//     }))
//   }, [])

//   const handleTypeSelect = useCallback((typeId: string) => {
//     setAssetData((prev) => ({ ...prev, type: typeId }))
//   }, [])

//   // Handle PIN submission for minting
//   const handlePinSubmit = async (pin: string) => {
//     if (!walletData) {
//       setPinError("Wallet data not available")
//       return
//     }

//     setIsPinSubmitting(true)
//     setPinError("")

//     try {
//       console.log('Getting Clerk authentication token...')
//       const token = await getToken({ template: process.env.NEXT_PUBLIC_CLERK_TEMPLATE_NAME })
//       console.log("Token received:", token)
//       if (!token) {
//         throw new Error("No bearer token found")
//       }

//       console.log('Creating metadata for asset...')

//       // Create metadata object (in production, this would be uploaded to IPFS)
//       const metadata = {
//         name: assetData.title,
//         description: assetData.description,
//         image: assetData.mediaUrl,
//         external_url: assetData.externalUrl,
//         attributes: [
//           { trait_type: "Type", value: assetData.type },
//           { trait_type: "License", value: assetData.licenseType },
//           { trait_type: "Commercial Use", value: assetData.commercialUse.toString() },
//           { trait_type: "Modifications", value: assetData.modifications.toString() },
//           { trait_type: "Attribution", value: assetData.attribution.toString() },
//           { trait_type: "IP Version", value: assetData.ipVersion },
//           { trait_type: "Protection Status", value: assetData.protectionStatus },
//           { trait_type: "Protection Scope", value: assetData.protectionScope },
//           { trait_type: "Tags", value: assetData.tags.join(", ") },
//         ],
//         properties: {
//           creator: assetData.author,
//           collection: assetData.collection,
//           license_details: assetData.licenseDetails,
//           registration_date: assetData.registrationDate,
//           protection_duration: assetData.protectionDuration,
//         }
//       }

//       // In production, upload to IPFS and get the hash
//       const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`

//       console.log('Minting NFT on Mediolano Protocol...')

//       const contractCall = {
//         encryptKey: pin,
//         bearerToken: token,
//         wallet: {
//           publicKey: walletData.publicKey,
//           encryptedPrivateKey: walletData.encryptedPrivateKey
//         },
//         calls: [
//           {
//             contractAddress: MEDIOLANO_CONTRACT,
//             functionName: "mint", // Adjust based on actual function name
//             calldata: [
//               walletData.publicKey, // to (recipient)
//               metadataUri, // tokenURI (metadata)
//             ]
//           }
//         ]
//       }

//       console.log('Mint contract call parameters:', contractCall)

//       // Mint NFT using Chipi SDK's callAnyContract
//       const mintResult = await callAnyContractAsync(contractCall)

//       console.log('Mint result:', mintResult)

//       if (mintResult) {
//         setTxHash(mintResult)
//         setTokenId(Date.now().toString()) // In production, parse from transaction receipt
//         setShowPinDialog(false)

//         toast({
//           title: "🎉 IP Asset Created!",
//           description: "Your content is now protected on the blockchain",
//         })

//         // Optional: redirect after successful mint
//         setTimeout(() => {
//           router.push("/portfolio")
//         }, 3000)
//       }
//     } catch (error) {
//       console.error('Minting failed:', error)
//       const errorMessage = error instanceof Error ? error.message : 'Minting failed'
//       setPinError(errorMessage)

//       toast({
//         title: "Minting Failed",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     } finally {
//       setIsPinSubmitting(false)
//     }
//   }

//   const handleCreate = useCallback(async () => {
//     if (!isEssentialComplete) {
//       toast({
//         title: "Missing Required Fields",
//         description: "Please fill in title and description",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!walletData) {
//       toast({
//         title: "Wallet Not Available",
//         description: "Please ensure your wallet is properly loaded",
//         variant: "destructive",
//       })
//       return
//     }

//     // Show PIN dialog for authentication
//     setShowPinDialog(true)
//   }, [isEssentialComplete, walletData])

//   const clearMedia = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation()
//     setMediaPreview("")
//     setMediaFile(null)
//     setAssetData((prev) => ({ ...prev, mediaUrl: "" }))
//   }, [])

//   const handleFileInputClick = useCallback(() => {
//     fileInputRef.current?.click()
//   }, [])

//   const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setAssetData((prev) => ({ ...prev, title: e.target.value }))
//   }, [])

//   const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setAssetData((prev) => ({ ...prev, description: e.target.value }))
//   }, [])

//   const handleExternalUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setAssetData((prev) => ({ ...prev, externalUrl: e.target.value }))
//   }, [])

//   const handleAuthorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setAssetData((prev) => ({ ...prev, author: e.target.value }))
//   }, [])

//   const handleCollectionChange = useCallback((value: string) => {
//     setAssetData((prev) => ({ ...prev, collection: value }))
//   }, [])

//   const handleLicenseTypeChange = useCallback((value: string) => {
//     setAssetData((prev) => ({ ...prev, licenseType: value }))
//   }, [])

//   const handleCommercialUseChange = useCallback((checked: boolean) => {
//     setAssetData((prev) => ({ ...prev, commercialUse: checked }))
//   }, [])

//   const handleModificationsChange = useCallback((checked: boolean) => {
//     setAssetData((prev) => ({ ...prev, modifications: checked }))
//   }, [])

//   const handleAttributionChange = useCallback((checked: boolean) => {
//     setAssetData((prev) => ({ ...prev, attribution: checked }))
//   }, [])

//   const handleNewTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewTag(e.target.value)
//   }, [])

//   const handleNewTagKeyPress = useCallback(
//     (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === "Enter") {
//         e.preventDefault()
//         addTag(newTag)
//       }
//     },
//     [addTag, newTag],
//   )

//   const handleAddNewTag = useCallback(() => {
//     addTag(newTag)
//   }, [addTag, newTag])

//   const handleMediaTypeChange = useCallback((value: string) => {
//     setMediaType(value as "upload" | "url")
//   }, [])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">

//       <main className="pb-20">
//         <div className="px-4 py-6">
//           <div className="max-w-2xl mx-auto">
//             <div className="space-y-6">
//               {/* Header */}
//               <div className="text-center space-y-3">
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
//                     <Sparkles className="w-4 h-4 text-white" />
//                   </div>
//                   <h1 className="text-2xl font-bold text-foreground">Create New Asset</h1>
//                 </div>
//                 <p className="text-muted-foreground text-sm">
//                   Share your creative work and protect it as intellectual property
//                 </p>
//               </div>

//               {/* Main Creation Form */}
//               <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//                 <CardContent className="p-6 space-y-6">
//                   {/* Title - Primary Field */}
//                   <div className="space-y-2">
//                     <Label htmlFor="title" className="text-base font-semibold flex items-center space-x-2">
//                       <PenTool className="w-5 h-5 text-primary" />
//                       <span>Title</span>
//                       <Badge variant="destructive" className="text-xs px-2 py-0">
//                         Required
//                       </Badge>
//                     </Label>
//                     <Input
//                       id="title"
//                       placeholder="What's your creation called?"
//                       value={assetData.title}
//                       onChange={handleTitleChange}
//                       className="text-lg font-medium bg-background/50 border-border/50 focus:border-primary h-12"
//                     />
//                   </div>

//                   {/* Description - Primary Field */}
//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-base font-semibold flex items-center space-x-2">
//                       <FileText className="w-5 h-5 text-primary" />
//                       <span>Description</span>
//                       <Badge variant="destructive" className="text-xs px-2 py-0">
//                         Required
//                       </Badge>
//                     </Label>
//                     <Textarea
//                       id="description"
//                       placeholder="Tell us about your creation..."
//                       value={assetData.description}
//                       onChange={handleDescriptionChange}
//                       rows={4}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none text-base"
//                     />
//                   </div>

//                   {/* Media Upload - Optional */}
//                   <div className="space-y-3">
//                     <Label className="text-base font-semibold flex items-center space-x-2">
//                       <ImageLucide className="w-5 h-5 text-primary" />
//                       <span>Media</span>
//                       <Badge variant="secondary" className="text-xs px-2 py-0">
//                         Optional
//                       </Badge>
//                     </Label>

//                     <Tabs value={mediaType} onValueChange={handleMediaTypeChange}>
//                       <TabsList className="grid w-full grid-cols-2 bg-muted/50">
//                         <TabsTrigger value="upload" className="data-[state=active]:bg-background">
//                           <Upload className="w-4 h-4 mr-2" />
//                           Upload File
//                         </TabsTrigger>
//                         <TabsTrigger value="url" className="data-[state=active]:bg-background">
//                           <LinkIcon className="w-4 h-4 mr-2" />
//                           Media URL
//                         </TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="upload" className="mt-4">
//                         <div
//                           className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${isDragOver
//                             ? "border-primary bg-primary/5"
//                             : "border-border/50 hover:border-primary/50 hover:bg-muted/20"
//                             }`}
//                           onDragOver={handleDragOver}
//                           onDragLeave={handleDragLeave}
//                           onDrop={handleDrop}
//                           onClick={handleFileInputClick}
//                         >
//                           <input
//                             ref={fileInputRef}
//                             type="file"
//                             className="hidden"
//                             onChange={handleFileSelect}
//                             accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
//                           />

//                           {!mediaPreview ? (
//                             <div className="space-y-3">
//                               <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto">
//                                 <Camera className="w-6 h-6 text-primary" />
//                               </div>
//                               <div>
//                                 <p className="font-medium text-foreground mb-1">Drop files here or click to browse</p>
//                                 <p className="text-sm text-muted-foreground">
//                                   Images, videos, audio, documents (Max 100MB)
//                                 </p>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="space-y-3">
//                               <div className="relative">
//                                 <Image
//                                   src={mediaPreview || "/placeholder.svg"}
//                                   alt="Preview"
//                                   width={300}
//                                   height={150}
//                                   className="w-full h-32 object-cover rounded-lg mx-auto"
//                                 />
//                                 <Button
//                                   size="sm"
//                                   variant="secondary"
//                                   className="absolute top-2 right-2 h-6 w-6 p-0"
//                                   onClick={clearMedia}
//                                 >
//                                   <X className="w-3 h-3" />
//                                 </Button>
//                               </div>
//                               <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
//                                 <CheckCircle className="w-4 h-4 text-green-500" />
//                                 <span>{mediaFile?.name}</span>
//                               </div>
//                             </div>
//                           )}

//                           {isUploading && (
//                             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
//                               <div className="text-center space-y-2">
//                                 <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
//                                 <div className="space-y-1">
//                                   <p className="text-sm font-medium">Uploading...</p>
//                                   <Progress value={uploadProgress} className="w-32" />
//                                   <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="url" className="mt-4">
//                         <div className="space-y-3">
//                           <Input
//                             placeholder="https://example.com/media.jpg"
//                             value={assetData.mediaUrl}
//                             onChange={(e) => handleUrlChange(e.target.value)}
//                             className="bg-background/50 border-border/50 focus:border-primary"
//                           />
//                           {assetData.mediaUrl && (
//                             <div className="border rounded-lg overflow-hidden bg-muted/20">
//                               <Image
//                                 src={assetData.mediaUrl || "/placeholder.svg"}
//                                 alt="URL Preview"
//                                 width={300}
//                                 height={150}
//                                 className="w-full h-32 object-cover"
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </TabsContent>
//                     </Tabs>
//                   </div>

//                   {/* External URL - Primary Field */}
//                   <div className="space-y-2">
//                     <Label htmlFor="external-url" className="text-base font-semibold flex items-center space-x-2">
//                       <ExternalLink className="w-5 h-5 text-primary" />
//                       <span>External URL</span>
//                       <Badge variant="secondary" className="text-xs px-2 py-0">
//                         Optional
//                       </Badge>
//                     </Label>
//                     <Input
//                       id="external-url"
//                       placeholder="https://yourwebsite.com (optional)"
//                       value={assetData.externalUrl}
//                       onChange={handleExternalUrlChange}
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Advanced Options - Expandable */}
//               <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
//                 <CollapsibleTrigger asChild>
//                   <Card className="bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer hover:bg-card/70 transition-colors">
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
//                             <Settings className="w-5 h-5 text-muted-foreground" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-foreground">Advanced Options</h3>
//                             <p className="text-sm text-muted-foreground">
//                               Asset type, tags, collection, and licensing settings
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Badge variant="outline" className="text-xs">
//                             {isAdvancedOpen ? "Hide" : "Show"}
//                           </Badge>
//                           {isAdvancedOpen ? (
//                             <ChevronUp className="w-4 h-4 text-muted-foreground" />
//                           ) : (
//                             <ChevronDown className="w-4 h-4 text-muted-foreground" />
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </CollapsibleTrigger>

//                 <CollapsibleContent>
//                   <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-4">
//                     <CardContent className="p-6 space-y-6">
//                       {/* Asset Type */}
//                       <div className="space-y-3">
//                         <Label className="text-sm font-medium flex items-center space-x-2">
//                           <Wand2 className="w-4 h-4 text-primary" />
//                           <span>Asset Type</span>
//                         </Label>
//                         <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
//                           {assetTypes.map((type) => {
//                             const Icon = type.icon
//                             return (
//                               <button
//                                 key={type.id}
//                                 onClick={() => handleTypeSelect(type.id)}
//                                 className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${assetData.type === type.id
//                                   ? "border-primary bg-primary/5 shadow-lg"
//                                   : "border-border hover:border-primary/50"
//                                   }`}
//                               >
//                                 <div className="text-center space-y-2">
//                                   <div
//                                     className={`w-8 h-8 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mx-auto`}
//                                   >
//                                     <Icon className="w-4 h-4 text-white" />
//                                   </div>
//                                   <p className="text-xs font-medium">{type.label}</p>
//                                 </div>
//                               </button>
//                             )
//                           })}
//                         </div>
//                       </div>

//                       <Separator />

//                       {/* Collection & Author */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="collection" className="text-sm font-medium flex items-center space-x-2">
//                             <Folder className="w-4 h-4 text-primary" />
//                             <span>Collection</span>
//                           </Label>
//                           <Select value={assetData.collection} onValueChange={handleCollectionChange}>
//                             <SelectTrigger className="bg-background/50 border-border/50">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {collections.map((collection) => (
//                                 <SelectItem key={collection.value} value={collection.value}>
//                                   <div>
//                                     <div className="font-medium">{collection.label}</div>
//                                     <div className="text-xs text-muted-foreground">{collection.description}</div>
//                                   </div>
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="author" className="text-sm font-medium">
//                             Author
//                           </Label>
//                           <Input
//                             id="author"
//                             value={assetData.author}
//                             onChange={handleAuthorChange}
//                             className="bg-background/50 border-border/50"
//                           />
//                         </div>
//                       </div>

//                       {/* Tags */}
//                       <div className="space-y-3">
//                         <Label className="text-sm font-medium flex items-center space-x-2">
//                           <Hash className="w-4 h-4 text-primary" />
//                           <span>Tags</span>
//                         </Label>

//                         {/* Quick Tags */}
//                         <div className="flex flex-wrap gap-2">
//                           {quickTags.map((tag) => (
//                             <button
//                               key={tag}
//                               onClick={() => addTag(tag)}
//                               disabled={assetData.tags.includes(tag)}
//                               className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${assetData.tags.includes(tag)
//                                 ? "bg-primary text-primary-foreground"
//                                 : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary"
//                                 }`}
//                             >
//                               #{tag}
//                             </button>
//                           ))}
//                         </div>

//                         {/* Custom Tag Input */}
//                         <div className="flex space-x-2">
//                           <Input
//                             placeholder="Add custom tag..."
//                             value={newTag}
//                             onChange={handleNewTagChange}
//                             onKeyPress={handleNewTagKeyPress}
//                             className="bg-background/50 border-border/50"
//                           />
//                           <Button onClick={handleAddNewTag} size="sm" disabled={!newTag} className="px-4">
//                             <Plus className="w-4 h-4" />
//                           </Button>
//                         </div>

//                         {/* Selected Tags */}
//                         {assetData.tags.length > 0 && (
//                           <div className="flex flex-wrap gap-2">
//                             {assetData.tags.map((tag, index) => (
//                               <Badge
//                                 key={index}
//                                 variant="secondary"
//                                 className="bg-primary/10 text-primary border-primary/20 pr-1"
//                               >
//                                 #{tag}
//                                 <button onClick={() => removeTag(tag)} className="ml-2 hover:text-destructive">
//                                   <X className="w-3 h-3" />
//                                 </button>
//                               </Badge>
//                             ))}
//                           </div>
//                         )}
//                       </div>

//                       <Separator />

//                       {/* License Settings */}
//                       <div className="space-y-4">
//                         <div className="flex items-center space-x-2">
//                           <Shield className="w-4 h-4 text-primary" />
//                           <h4 className="font-medium text-foreground">License & Protection</h4>
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="license-type" className="text-sm font-medium">
//                             License Type
//                           </Label>
//                           <Select value={assetData.licenseType} onValueChange={handleLicenseTypeChange}>
//                             <SelectTrigger className="bg-background/50 border-border/50">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="all-rights">All Rights Reserved</SelectItem>
//                               <SelectItem value="creative-commons">Creative Commons</SelectItem>
//                               <SelectItem value="open-source">Open Source</SelectItem>
//                               <SelectItem value="custom">Custom License</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         {/* License Permissions */}
//                         <div className="space-y-3">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <Label className="text-sm font-medium">Commercial Use</Label>
//                               <p className="text-xs text-muted-foreground">Allow commercial usage</p>
//                             </div>
//                             <Switch checked={assetData.commercialUse} onCheckedChange={handleCommercialUseChange} />
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <Label className="text-sm font-medium">Modifications</Label>
//                               <p className="text-xs text-muted-foreground">Allow derivative works</p>
//                             </div>
//                             <Switch checked={assetData.modifications} onCheckedChange={handleModificationsChange} />
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <Label className="text-sm font-medium">Require Attribution</Label>
//                               <p className="text-xs text-muted-foreground">Credit required when used</p>
//                             </div>
//                             <Switch checked={assetData.attribution} onCheckedChange={handleAttributionChange} />
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </CollapsibleContent>
//               </Collapsible>

//               {/* Protection Info */}
//               <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
//                 <CardContent className="p-6">
//                   <div className="flex items-start space-x-4">
//                     <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
//                       <Shield className="w-6 h-6 text-primary-foreground" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-bold text-foreground mb-2">Blockchain Protection</h3>
//                       <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
//                         Your IP will be protected on Starknet with immutable proof of ownership and global copyright
//                         protection.
//                       </p>
//                       <div className="grid grid-cols-3 gap-4">
//                         <div className="text-center">
//                           <Clock className="w-6 h-6 mx-auto text-primary mb-1" />
//                           <p className="text-xs font-medium">~2 minutes</p>
//                         </div>
//                         <div className="text-center">
//                           <Globe className="w-6 h-6 mx-auto text-green-500 mb-1" />
//                           <p className="text-xs font-medium">181 Countries</p>
//                         </div>
//                         <div className="text-center">
//                           <Zap className="w-6 h-6 mx-auto text-blue-500 mb-1" />
//                           <p className="text-xs font-medium">Zero Fees</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Creation Success */}
//               {txHash && (
//                 <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 animate-fade-in">
//                   <CardContent className="pt-6">
//                     <div className="flex items-start space-x-4">
//                       <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <CheckCircle className="w-6 h-6 text-white" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">IP Asset Created!</h3>
//                         <div className="space-y-2">
//                           <p className="text-sm text-green-700 dark:text-green-300">
//                             Your intellectual property has been successfully minted and protected on the blockchain.
//                           </p>
//                           <div className="space-y-1">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-sm font-medium text-green-900 dark:text-green-100">Token ID:</span>
//                               <code className="text-xs bg-green-200 dark:bg-green-800 px-2 py-1 rounded font-mono">
//                                 {tokenId}
//                               </code>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <span className="text-sm font-medium text-green-900 dark:text-green-100">Transaction:</span>
//                               <code className="text-xs bg-green-200 dark:bg-green-800 px-2 py-1 rounded font-mono break-all">
//                                 {txHash}
//                               </code>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => window.open(`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${txHash}`, '_blank')}
//                                 className="shrink-0"
//                               >
//                                 <ExternalLink className="w-3 h-3" />
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Create Button */}
//               <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
//                 <CardContent className="pt-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="font-bold text-lg">Ready to Mint?</h3>
//                         <p className="text-sm text-muted-foreground">
//                           {walletData ? "Your wallet is connected and ready" : "Loading wallet..."}
//                         </p>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <div className={`w-3 h-3 rounded-full ${walletData ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
//                         <span className="text-sm text-muted-foreground">
//                           {walletData ? "Ready" : "Loading"}
//                         </span>
//                       </div>
//                     </div>

//                     <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
//                       <DialogTrigger asChild>
//                         <Button
//                           onClick={handleCreate}
//                           disabled={!isEssentialComplete || isMinting || !walletData}
//                           className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
//                         >
//                           {isMinting ? (
//                             <div className="flex items-center space-x-3">
//                               <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
//                               <span>Minting Your IP Asset...</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-center space-x-3">
//                               <Sparkles className="w-6 h-6" />
//                               <span>Mint IP Asset</span>
//                             </div>
//                           )}
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-md">
//                         <DialogHeader>
//                           <DialogTitle className="sr-only">Authenticate Minting</DialogTitle>
//                         </DialogHeader>
//                         <PinInput
//                           onSubmit={handlePinSubmit}
//                           isLoading={isPinSubmitting}
//                           title="Authenticate Minting"
//                           description="Enter your wallet PIN to mint your IP asset"
//                           submitText="Mint Asset"
//                           error={pinError}
//                           onCancel={() => setShowPinDialog(false)}
//                         />
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

import CreateAssetView from "@/src/components/assets/create-asset";

export default function page() {
  return <CreateAssetView />;
}
