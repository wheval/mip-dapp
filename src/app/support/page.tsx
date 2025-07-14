"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion"
import {
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  Zap,
  Shield,
  Code,
  CreditCard,
  Users,
  ExternalLink,
  Send,
  CheckCircle,
  Clock,
  Star,
  BookOpen,
  Video,
  Globe,
  Calendar,
  AlertTriangle,
  MailCheck,
  Diamond,
  Gem,
} from "lucide-react"
import { useState } from "react"
import { SiTelegram } from "react-icons/si"

const supportChannels = [
  {
    title: "Live Chat",
    description: "Connect with our team on Telegram",
    icon: MessageCircle,
    color: "bg-green-500",
    responseTime: "minutes",
    availability: "24/7",
    bestFor: "Quick questions, urgent issues, real-time troubleshooting",
    satisfaction: "98%",
    languages: ["English", "Portuguese"],
  },
  {
    title: "Email Support",
    description: "Detailed assistance with comprehensive solutions",
    icon: Mail,
    color: "bg-blue-500",
    responseTime: "< 1 hour",
    availability: "24/7",
    bestFor: "Complex issues, detailed explanations, documentation requests",
    satisfaction: "96%",
    languages: ["English", "Spanish", "Portuguese"],
  },
  {
    title: "Phone Support",
    description: "Direct phone support for critical matters",
    icon: Phone,
    color: "bg-purple-500",
    responseTime: "Immediate",
    availability: "Business hours",
    bestFor: "Urgent issues, enterprise customers, complex integrations",
    satisfaction: "99%",
    languages: ["English", "Spanish"],
  },
  {
    title: "Video Call",
    description: "Screen sharing and personalized assistance",
    icon: Video,
    color: "bg-orange-500",
    responseTime: "Scheduled",
    availability: "Business hours",
    bestFor: "Integration help, training sessions, complex troubleshooting",
    satisfaction: "99%",
    languages: ["English"],
  },
]

const faqCategories = [
  {
    title: "Getting Started",
    icon: Zap,
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    questions: [
      {
        question: "How do I create my first IP asset on MIP?",
        answer:
          "Creating your first asset is simple: 1) Connect your Starknet wallet, 2) Navigate to the Create page, 3) Upload your file or add content details, 4) Add metadata (title, description, tags), 5) Select your license type, 6) Click 'Protect Asset'. Your content will be registered on the blockchain within 2-3 minutes with zero transaction fees.",
        tags: ["beginner", "create", "tutorial"],
      },
      {
        question: "What file types and formats are supported?",
        answer:
          "MIP supports a wide range of file types: Images (JPG, PNG, GIF, SVG, WebP), Videos (MP4, MOV, AVI, WebM), Audio (MP3, WAV, FLAC, OGG), Documents (PDF, DOC, DOCX, TXT), 3D Models (GLB, GLTF, OBJ), and Code files (JS, PY, HTML, CSS). Maximum file size is 100MB for free accounts and 1GB for premium accounts.",
        tags: ["files", "formats", "limits"],
      },
      {
        question: "How does blockchain-based IP protection work?",
        answer:
          "When you upload content to MIP, we create a cryptographic hash (fingerprint) of your work and register it on the Starknet blockchain along with a timestamp and your wallet address. This creates an immutable, tamper-proof record that serves as legal evidence of creation time and authorship, recognized under international copyright law including the Berne Convention.",
        tags: ["blockchain", "protection", "legal"],
      },
      {
        question: "Do I need cryptocurrency or technical knowledge?",
        answer:
          "No cryptocurrency is needed! MIP covers all blockchain transaction costs. You only need a free Starknet wallet (like ArgentX or Braavos) for identity verification. Our interface is designed for creators, not developers - no technical knowledge required. We provide step-by-step guidance throughout the process.",
        tags: ["beginner", "wallet", "costs"],
      },
    ],
  },
  {
    title: "Legal & Licensing",
    icon: Shield,
    color: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/20",
    questions: [
      {
        question: "What licensing options are available on MIP?",
        answer:
          "MIP offers comprehensive licensing options: Creative Commons licenses (CC0, CC-BY, CC-BY-SA, CC-BY-NC, CC-BY-ND), All Rights Reserved (full copyright protection), Custom Commercial licenses with flexible terms, Open Source licenses (MIT, GPL, Apache), and Enterprise licensing for organizations. You can also create custom license templates for specific use cases.",
        tags: ["licensing", "creative-commons", "commercial"],
      },
      {
        question: "How legally binding and enforceable are blockchain records?",
        answer:
          "Blockchain records provide strong legal evidence admissible in courts worldwide. The immutable timestamp and cryptographic proof establish creation date and authorship, which is recognized under the Berne Convention (173 countries). While not a replacement for traditional copyright registration, blockchain evidence significantly strengthens your legal position in IP disputes.",
        tags: ["legal", "validity", "court", "international"],
      },
      {
        question: "Can I change or update licensing terms after creation?",
        answer:
          "You can add new licensing options and update metadata, but existing licenses remain valid to protect licensees' rights. We recommend careful consideration of initial licensing terms. For significant changes, you can create a new version of your asset with updated terms while maintaining the original's protection.",
        tags: ["licensing", "updates", "versioning"],
      },
      {
        question: "How do I handle licensing disputes or infringement?",
        answer:
          "MIP provides comprehensive dispute resolution support: 1) Automated infringement detection tools, 2) Legal documentation package with blockchain evidence, 3) Referrals to IP attorneys in your jurisdiction, 4) Mediation services for licensing disputes, 5) DMCA takedown assistance. Enterprise customers receive priority legal support.",
        tags: ["disputes", "infringement", "legal-support"],
      },
    ],
  },
  {
    title: "Technical & Integration",
    icon: Code,
    color: "from-purple-500/10 to-violet-500/10",
    borderColor: "border-purple-500/20",
    questions: [
      {
        question: "How do I integrate MIP API into my application?",
        answer:
          "Integration is straightforward: 1) Get your API key from the dashboard, 2) Install our SDK (npm install @mip/sdk for JavaScript), 3) Initialize the client with your API key, 4) Use our comprehensive documentation and code examples. We provide SDKs for JavaScript/Node.js, Python, and REST API for other languages. Free tier includes 1,000 API calls per hour.",
        tags: ["api", "integration", "sdk", "developers"],
      },
      {
        question: "What are the API rate limits and pricing?",
        answer:
          "API rate limits: Free tier (1,000 requests/hour), Pro tier (10,000 requests/hour), Enterprise (unlimited with dedicated infrastructure). Pricing: Free tier includes 10 asset uploads/month, Pro tier ($29/month) includes 100 uploads and priority support, Enterprise (custom pricing) includes unlimited uploads, dedicated support, and SLA guarantees.",
        tags: ["api", "limits", "pricing", "tiers"],
      },
      {
        question: "Is there a sandbox environment for testing?",
        answer:
          "Yes! We provide a full-featured sandbox environment at sandbox-api.mip.dev that mirrors production functionality without affecting real data or blockchain records. Perfect for testing integrations, webhooks, and workflows. Sandbox includes test assets, mock blockchain transactions, and all API endpoints with the same rate limits as your production tier.",
        tags: ["sandbox", "testing", "development"],
      },
      {
        question: "How do webhooks work and what events are available?",
        answer:
          "Webhooks provide real-time notifications for asset events: asset.created, asset.protected, asset.licensed, asset.verified, license.granted, license.expired, payment.received, and more. Configure webhook URLs in your dashboard, and we'll send HTTP POST requests with event data. Includes retry logic, signature verification, and delivery confirmation.",
        tags: ["webhooks", "events", "real-time", "notifications"],
      },
    ],
  },
  {
    title: "Pricing & Billing",
    icon: CreditCard,
    color: "from-orange-500/10 to-red-500/10",
    borderColor: "border-orange-500/20",
    questions: [
      {
        question: "What does the free tier include and what are the limitations?",
        answer:
          "Free tier includes: 10 asset uploads per month, basic IP protection on Starknet, standard licensing options, community support, 1,000 API calls/hour, and access to all core features. Limitations: 100MB max file size, standard support response times, and MIP branding on shared assets. Perfect for individual creators getting started.",
        tags: ["free", "tier", "limitations", "features"],
      },
      {
        question: "How is pricing calculated and what payment methods do you accept?",
        answer:
          "Pricing is transparent and based on usage: asset uploads, storage, API calls, and premium features. We accept major credit cards, PayPal, bank transfers, and cryptocurrency (Bitcoin, Ethereum, USDC). Annual subscriptions receive 20% discount. Enterprise customers can arrange custom billing terms and purchase orders.",
        tags: ["pricing", "payment", "methods", "billing"],
      },
      {
        question: "Can I upgrade, downgrade, or cancel my plan anytime?",
        answer:
          "Yes, complete flexibility: upgrade immediately with instant access to new features, downgrade at the end of your billing cycle (existing assets remain protected), cancel anytime with 30-day data retention. No long-term contracts or cancellation fees. Enterprise customers may have custom terms based on their agreement.",
        tags: ["plans", "upgrade", "cancel", "flexibility"],
      },
      {
        question: "Do you offer discounts for students, nonprofits, or bulk purchases?",
        answer:
          "Yes! We offer: 50% student discount with valid .edu email, 30% nonprofit discount for registered organizations, volume discounts for 10+ licenses, academic institution pricing for educational use, and startup credits for early-stage companies. Contact our sales team for custom pricing on large deployments.",
        tags: ["discounts", "students", "nonprofits", "volume"],
      },
    ],
  },
]

const supportResources = [
  {
    title: "Knowledge Base",
    description: "Comprehensive guides and tutorials",
    icon: BookOpen,
    articles: "200+",
    color: "bg-blue-500",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    icon: Video,
    articles: "50+",
    color: "bg-green-500",
  },
  {
    title: "API Documentation",
    description: "Complete API reference",
    icon: Code,
    articles: "30+",
    color: "bg-purple-500",
  },
  {
    title: "Community Forum",
    description: "Connect with other users",
    icon: Users,
    articles: "1000+",
    color: "bg-orange-500",
  },
]

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    priority: "",
    category: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Support request submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">


      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <HelpCircle className="w-3 h-3 mr-1" />
              Support Center
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              We're Here to{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Help You
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get support for all your programmable IP needs. Our team is ready to assist the best we can.
            </p>

            {/* Support Stats */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>24/7 onchain</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>Human Support</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>3 Languages</span>
              </div>
            </div>
          </div>
        </div>
      </div>




      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Support Channels */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Support Channel</h2>
            <p className="text-muted-foreground">Multiple ways to get expert help when you need it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${channel.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{channel.title}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Response Time:</span>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          {channel.responseTime}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Availability:</span>
                        <span className="text-sm font-medium">{channel.availability}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Satisfaction:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{channel.satisfaction}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">Best for:</span>
                        <p className="text-sm font-medium mt-1">{channel.bestFor}</p>
                      </div>
                      <div className="pt-2">
                        <span className="text-sm text-muted-foreground">Languages:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {channel.languages.map((lang, langIndex) => (
                            <Badge key={langIndex} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      Start {channel.title}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>



        {/* Emergency Support */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-500/5 to-orange-500/5 border-blue-500/20">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gem className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">MIP Support</h3>
                  <p className="text-muted-foreground mb-4">
                    For critical issues affecting operations, security breaches, contact our support team:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                      <SiTelegram className="w-4 h-4 mr-2" />
                      Telegram @MediolanoApp
                    </Button>
                    <Button variant="outline" size="lg">
                      <MailCheck className="w-4 h-4 mr-2" />
                      Email mediolanoapp@gmail.com
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Available 24/7 • Response time: {"<"} 60 minutes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      

        {/* Support Resources */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">More Resources</h2>
            <p className="text-muted-foreground">Explore our comprehensive resources for immediate answers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportResources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer"
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 ${resource.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {resource.articles} articles
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 bg-transparent"
                    >
                      Explore
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        

        {/* How it works */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border-border/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">How it works?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
               With MIP your intellectual property is protected by the blockchain, ensuring your assets are secure, verifiable, and globally recognized. Here’s how it works: 
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Immutable IP</h4>
                  <p className="text-sm text-muted-foreground">
                    All assets are registered on the blockchain, ensuring permanent, tamper-proof ownership records
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Self Custody</h4>
                  <p className="text-sm text-muted-foreground">
                    You retain full control of your assets with no third-party custody, ensuring maximum security
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Global Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Your IP is recognized under international copyright law, providing worldwide IP protection
                  </p>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
