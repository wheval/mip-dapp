"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion"
import {
  HelpCircle,
  Search,
  Zap,
  Shield,
  Code,
  CreditCard,
  BookOpen,
  MessageCircle,
  Clock,
  Lightbulb,
  Globe,
  FileText,
  Video,
  Phone,
  Filter,
  X,
  ChevronRight,
} from "lucide-react"

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Everything you need to know to start tokenizing your content onchain",
    icon: Zap,
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    questions: [
      {
        question: "What is MIP and how does it protect my intellectual property?",
        answer:
          "MIP (My Intellectual Property) is a blockchain-based platform that provides immutable proof of creation and ownership for your intellectual property. When you upload content, we create a cryptographic hash (digital fingerprint) and register it on the Starknet blockchain with a timestamp and your wallet address. This creates tamper-proof evidence that can be used in legal proceedings to establish creation date and authorship, recognized under international copyright law including the Berne Convention.",
        tags: ["basics", "blockchain", "protection"],
      },
      {
        question: "How do I create my first IP asset on MIP?",
        answer:
          "Creating your first asset is simple: 1) Sign in with your Google Account, 2) Navigate to the 'Create' page, 3) Upload your file or add content details, 4) Fill in metadata (title, description, tags), 5) Select your preferred license type, 6) Click 'Protect Asset'. The process takes seconds and costs nothing - we cover all blockchain fees. You'll receive confirmation once your asset is created on the blockchain.",
        tags: ["tutorial", "create", "wallet"],
      },
      {
        question: "What file types and formats are supported?",
        answer:
          "MIP supports a comprehensive range of file types: Images (JPG, PNG, GIF, SVG, WebP, TIFF), Videos (MP4, MOV, AVI, WebM, MKV), Audio (MP3, WAV, FLAC, OGG, AAC), Documents (PDF, DOC, DOCX, TXT, RTF), 3D Models (GLB, GLTF, OBJ, FBX), Code files (JS, PY, HTML, CSS, JSON), and Archives (ZIP, RAR). File size limits: 100MB for free accounts, 1GB for Pro accounts, 10GB for Enterprise. We also support text-only submissions for concepts, ideas, and written works.",
        tags: ["files", "formats", "limits"],
      },
      {
        question: "Do I need cryptocurrency or technical knowledge to use MIP?",
        answer:
          "No cryptocurrency is required! MIP covers all blockchain transaction costs, so you never pay gas fees. You only need to login with your Google Account for identity verification - think of it like creating a digital signature. Our interface is designed for creators, not developers. No coding knowledge needed. We provide step-by-step guidance, video tutorials, and live chat support to help you through the process.",
        tags: ["beginner", "wallet", "costs", "no-crypto"],
      },
      {
        question: "How long does it take to protect an asset and what happens next?",
        answer:
          "Asset protection typically takes seconds with Starknet technology. Here's what happens: 1) Upload and metadata processing, 2) Cryptographic hash generation, 3) Blockchain registration on Starknet, 4) Confirmation and certificate generation. Your asset is immediately searchable and shareable once protected.",
        tags: ["timeline", "process", "confirmation"],
      },
      {
        question: "Can I protect ideas, concepts, or works in progress?",
        answer:
          "Yes! MIP protects various forms of intellectual property: completed works (images, videos, documents), work-in-progress files, written concepts and ideas, business plans and strategies, research notes and findings, creative briefs and proposals, code snippets and algorithms. For concepts, provide detailed descriptions, sketches, or documentation. The key is establishing a clear record of your idea's development and your authorship at a specific point in time.",
        tags: ["concepts", "ideas", "wip", "types"],
      },
    ],
  },
  {
    id: "legal-licensing",
    title: "Legal & Licensing",
    description: "Understanding legal aspects and licensing options",
    icon: Shield,
    color: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/20",
    iconColor: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    questions: [
      {
        question: "What licensing options are available and which should I choose?",
        answer:
          "MIP offers comprehensive licensing options: Creative Commons (CC0 - public domain, CC-BY - attribution required, CC-BY-SA - share-alike, CC-BY-NC - non-commercial, CC-BY-ND - no derivatives), All Rights Reserved (full copyright protection), Custom Commercial licenses with flexible terms, Open Source licenses (MIT, GPL, Apache), and Enterprise licensing. Choose based on your goals: CC licenses for sharing with specific restrictions, All Rights Reserved for maximum control, Custom Commercial for monetization, Open Source for collaborative development.",
        tags: ["licensing", "creative-commons", "commercial", "rights"],
      },
      {
        question: "How legally binding are blockchain records in court?",
        answer:
          "Blockchain records provide strong legal evidence admissible in courts worldwide. The immutable timestamp and cryptographic proof establish creation date and authorship, recognized under the Berne Convention (173 countries) and various national copyright laws. While not a replacement for traditional copyright registration in all jurisdictions, blockchain evidence significantly strengthens your legal position. We provide legal documentation packages and can connect you with IP attorneys familiar with blockchain evidence for complex cases.",
        tags: ["legal", "court", "validity", "international"],
      },
      {
        question: "Can I change licensing terms after creating an asset?",
        answer:
          "You can add new licensing options and update certain metadata, but existing licenses remain valid to protect licensees' rights and maintain legal certainty. For significant changes, we recommend creating a new version of your asset with updated terms while maintaining the original's protection. You can also set expiration dates on licenses or create tiered licensing with different terms for different use cases.",
        tags: ["licensing", "updates", "versioning", "changes"],
      },
      {
        question: "Does blockchain protection work internationally?",
        answer:
          "Yes! Blockchain-based IP protection is recognized internationally under the Berne Convention (173 countries) and various bilateral agreements. Your blockchain protection provides evidence of creation and ownership that's admissible in courts worldwide.",
        tags: ["international", "global", "berne-convention", "enforcement"],
      },
    ],
  },
  {/* Technical & API 
  {
    id: "technical-api",
    title: "Technical & API",
    description: "Integration, development, and technical questions",
    icon: Code,
    color: "from-purple-500/10 to-violet-500/10",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    questions: [
      {
        question: "How do I integrate MIP into my application?",
        answer:
          "Integration is straightforward with our comprehensive SDKs and documentation: 1) Get your API key from the dashboard, 2) Install our SDK (npm install @mip/sdk for JavaScript, pip install mip-sdk for Python), 3) Initialize the client with your API key, 4) Use our extensive code examples and documentation. We provide SDKs for JavaScript/Node.js, Python, and REST API for other languages. Free tier includes 1,000 API calls per hour. Our documentation includes interactive examples, webhook setup, and error handling best practices.",
        tags: ["api", "integration", "sdk", "developers"],
      },
      {
        question: "What are the API rate limits and how is pricing structured?",
        answer:
          "API rate limits by tier: Free (1,000 requests/hour, 10 asset uploads/month), Pro ($29/month - 10,000 requests/hour, 100 uploads/month), Enterprise (unlimited with dedicated infrastructure, custom pricing). Additional charges: storage ($0.10/GB/month), premium features (advanced analytics, priority support), API overages ($0.01 per request above limit). Enterprise includes SLA guarantees, dedicated support, custom integrations, and volume discounts. All tiers include webhook support and comprehensive documentation.",
        tags: ["api", "limits", "pricing", "tiers"],
      },
      {
        question: "Is there a sandbox environment for testing integrations?",
        answer:
          "Yes! We provide a full-featured sandbox environment at sandbox-api.mip.dev that mirrors production functionality without affecting real data or blockchain records. Sandbox features: all API endpoints, test assets and collections, mock blockchain transactions, webhook testing, same rate limits as your production tier, realistic response times and error scenarios. Perfect for development, testing integrations, training team members, and validating workflows before going live. Sandbox data resets monthly.",
        tags: ["sandbox", "testing", "development", "environment"],
      },
      {
        question: "How do webhooks work and what events can I subscribe to?",
        answer:
          "Webhooks provide real-time notifications for asset and account events. Available events: asset.created, asset.protected, asset.updated, asset.licensed, asset.verified, license.granted, license.expired, license.renewed, payment.received, payment.failed, account.upgraded, account.downgraded. Setup: configure webhook URLs in your dashboard, choose events, set secret for signature verification. We include retry logic (5 attempts with exponential backoff), delivery confirmation, and detailed logs. Webhook payloads include full event data and can be filtered by asset, collection, or user.",
        tags: ["webhooks", "events", "real-time", "notifications"],
      },
      {
        question: "What security measures protect API access and data?",
        answer:
          "MIP implements enterprise-grade security: API key authentication with scoped permissions, HTTPS/TLS 1.3 encryption for all communications, rate limiting and DDoS protection, IP whitelisting for enterprise accounts, webhook signature verification, SOC 2 Type II compliance, regular security audits and penetration testing. Data protection: encryption at rest and in transit, blockchain immutability, GDPR compliance, data residency options. We never store your private keys or have access to your wallet - you maintain full control of your assets.",
        tags: ["security", "authentication", "encryption", "compliance"],
      },
    ],
  },
  */}
  
]

const popularQuestions = [
  {
    question: "How much does it cost to protect my IP on MIP?",
    answer:
      "MIP cover all blockchain fees. No hidden fees or transaction costs.",
    category: "Pricing",
  },
  {
    question: "Is blockchain-based IP protection legally valid?",
    answer:
      "Yes! Blockchain records provide strong legal evidence admissible in courts worldwide under the Berne Convention and various national copyright laws. We provide legal documentation packages for court submission.",
    category: "Legal",
  },
  {
    question: "Do I need to know about cryptocurrency to use MIP?",
    answer:
      "Not at all! You only need your Google Account for identity verification. MIP covers all blockchain costs and provides a user-friendly interface designed for creators.",
    category: "Getting Started",
  },
  {
    question: "How quickly can I protect my intellectual property?",
    answer:
      "Asset protection typically takes seconds from upload to blockchain confirmation, thanks to Starknet's fast transaction processing.",
    category: "Getting Started",
  },
]

const helpfulResources = [
  {
    title: "Video Tutorials",
    description: "Step-by-step guides for all features",
    icon: Video,
    count: "0 videos",
    color: "bg-red-500",
  },
  {
    title: "Documentation",
    description: "Complete guides and references",
    icon: BookOpen,
    count: "0 articles",
    color: "bg-blue-500",
  },
  {
    title: "API Reference",
    description: "Technical documentation for developers",
    icon: Code,
    count: "No endpoints",
    color: "bg-green-500",
  },
  {
    title: "Live Support",
    description: "Chat with our expert team",
    icon: MessageCircle,
    count: "24/7 available",
    color: "bg-purple-500",
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)

  // Filter questions based on search query and category
  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: Array.isArray(category.questions)
        ? category.questions.filter((q) => {
            const matchesSearch =
              searchQuery === "" ||
              q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesCategory = selectedCategory === "all" || category.id === selectedCategory

            return matchesSearch && matchesCategory
          })
        : [],
    }))
    .filter((category) => category.questions.length > 0)

  const totalQuestions = faqCategories.reduce(
    (sum, category) => sum + (Array.isArray(category.questions) ? category.questions.length : 0),
    0
  )
  const filteredQuestionsCount = filteredCategories.reduce((sum, category) => sum + category.questions.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border-b border-border/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Find{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Quick Answers
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get instant answers to common questions about IP protection, licensing, technical integration, and more.
              Can't find what you're looking for? Our support team is here to help.
            </p>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search questions, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base bg-background/80 backdrop-blur-sm border-border/50 rounded-xl"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={showCategoryFilter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="rounded-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Category
                </Button>

                {selectedCategory !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filter
                  </Button>
                )}
              </div>

              {/* Category Selection */}
              {showCategoryFilter && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory("all")
                      setShowCategoryFilter(false)
                    }}
                    className="justify-start rounded-lg"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    All
                  </Button>
                  {faqCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category.id ?? "all")
                          setShowCategoryFilter(false)
                        }}
                        className="justify-start rounded-lg"
                      >
                        {Icon && <Icon className="w-4 h-4 mr-2" />}
                        <span className="truncate">{category.title}</span>
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <HelpCircle className="w-4 h-4" />
                <span>
                  {filteredQuestionsCount} of {totalQuestions} Questions
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Updated recently</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Popular Questions */}
        {selectedCategory === "all" && searchQuery === "" && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Most Popular Questions</h2>
              <p className="text-muted-foreground">The questions our users ask most frequently</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {popularQuestions.map((faq, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors duration-300 leading-tight">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed mb-4">{faq.answer}</CardDescription>
                    <Badge variant="secondary" className="text-xs">
                      {faq.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Categories */}
        <div className="space-y-6 sm:space-y-8">
          {filteredCategories.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or clearing the category filter.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon ?? HelpCircle
              return (
                <Card key={categoryIndex} className={`${category.bgColor} border-border/50 backdrop-blur-sm`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-background/80 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <CategoryIcon className={`w-5 h-5 ${category.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl">{category.title}</CardTitle>
                        <CardDescription className="text-sm sm:text-base">{category.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {category.questions.length} questions
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`item-${categoryIndex}-${faqIndex}`}
                          className="border border-border/30 rounded-lg bg-background/50 backdrop-blur-sm"
                        >
                          <AccordionTrigger className="text-left hover:text-primary transition-colors px-4 py-3 hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="flex-1 text-sm sm:text-base font-medium leading-tight">
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                              <div className="flex flex-wrap gap-2">
                                {faq.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Helpful Resources */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Additional Resources</h2>
            <p className="text-muted-foreground">Explore more ways to get help and learn about MIP</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {helpfulResources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer hover:bg-card/80"
                >
                  <CardHeader className="text-center pb-3">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 ${resource.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{resource.title}</CardTitle>
                    <CardDescription className="text-sm">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="mb-4">
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {resource.count}
                      </Badge>
                    </div>
                    {/*
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 bg-transparent"
                    >
                      Explore
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>*/}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Still Need Help 
        <div className="mt-12 sm:mt-16">
          <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border-border/50">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Still Need Help?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Can't find the answer you're looking for? Our expert support team is ready to help with personalized
                assistance for your specific situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <Button className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Ticket
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                Average response time: {"<"} 1 hour • 24/7 support available
              </p>
            </CardContent>
          </Card>
        </div>
        */}


      </div>
    </div>
  )
}
