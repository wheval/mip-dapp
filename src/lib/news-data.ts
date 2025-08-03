export interface NewsAuthor {
  id: string
  name: string
  avatar: string
  bio: string
  twitter?: string
  linkedin?: string
  role: string
}

export interface NewsArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  author: NewsAuthor
  publishedAt: string
  category: string
  tags: string[]
  featured: boolean
  isEvent?: boolean
  eventDate?: string
  eventLocation?: string
  readTime?: number
}

const authors: NewsAuthor[] = [
  {
    id: "1",
    name: "MIP",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Lead Developer Relations at Mediolano IP Platform. Passionate about blockchain technology and creator empowerment.",
    twitter: "https://twitter.com/mariasantos",
    linkedin: "https://linkedin.com/in/mariasantos",
    role: "Developer Relations Lead",
  },
  {
    id: "2",
    name: "MIP",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Product Manager focused on IP protection and blockchain innovation. 5+ years in Web3 development.",
    twitter: "https://twitter.com/carlosrodriguez",
    linkedin: "https://linkedin.com/in/carlosrodriguez",
    role: "Product Manager",
  },
  {
    id: "3",
    name: "MIP",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Community Manager and Content Creator. Helping creators understand IP protection in the digital age.",
    twitter: "https://twitter.com/anasilva",
    linkedin: "https://linkedin.com/in/anasilva",
    role: "Community Manager",
  },
]

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "starknet-rio-meetup",
    title: "Starknet Rio Meetup + IP Lounge",
    excerpt:
      "Join us in Rio de Janeiro for an exclusive meetup about Starknet technology and IP protection. Network with developers, creators, and blockchain enthusiasts.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>Estamos empolgados em anunciar o <strong>Starknet Rio Meetup 2025</strong>, um evento exclusivo que reunirá desenvolvedores, criadores e entusiastas de blockchain no coração do Rio de Janeiro.</p>
        
        <h2>O que esperar do evento</h2>
        <p>Este meetup será uma oportunidade única para:</p>
        <ul>
          <li>Aprender sobre as últimas inovações em Starknet</li>
          <li>Descobrir como proteger propriedade intelectual usando blockchain</li>
          <li>Fazer networking com profissionais da área</li>
          <li>Participar de workshops práticos</li>
        </ul>

        <h2>Programação</h2>
        <p>O evento contará com palestras de especialistas, demonstrações ao vivo da plataforma MIP, e sessões de networking. Haverá também um workshop prático sobre como tokenizar propriedade intelectual.</p>

        <h2>Local e Data</h2>
        <p>📅 <strong>Data:</strong> 6 de agosto, 2025<br>
        📍 <strong>Local:</strong> CCDiversa<br>
        🕐 <strong>Horário:</strong> 15h - 23h</p>

        <p>Não perca esta oportunidade de estar na vanguarda da revolução da propriedade intelectual no Brasil!</p>
      </div>
    `,
    image: "/starknet-rio-meetup-ip-lounge.png",
    author: authors[0],
    publishedAt: "2025-08-06",
    category: "Events",
    tags: ["Starknet", "Rio", "Meetup", "Blockchain", "Mediolano"],
    featured: true,
    isEvent: true,
    eventDate: "2025-08-06",
    eventLocation: "Rio de Janeiro, Brazil",
    readTime: 5,
  },
  {
    id: "2",
    slug: "ip-protection-guide-2025",
    title: "The Complete Guide to IP Protection in 2025",
    excerpt:
      "Everything creators need to know about protecting their intellectual property in the digital age. From traditional methods to blockchain solutions.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>Intellectual property protection has never been more critical for creators in the digital age. With the rise of AI, NFTs, and digital content creation, understanding how to protect your work is essential.</p>
        
        <h2>Traditional IP Protection Methods</h2>
        <p>Traditional methods include:</p>
        <ul>
          <li>Copyright registration</li>
          <li>Trademark filing</li>
          <li>Patent applications</li>
          <li>Trade secret protection</li>
        </ul>

        <h2>Blockchain-Based Solutions</h2>
        <p>Modern blockchain solutions offer:</p>
        <ul>
          <li>Immutable proof of creation</li>
          <li>Transparent ownership records</li>
          <li>Automated licensing</li>
          <li>Global accessibility</li>
        </ul>

        <h2>Why Choose MIP?</h2>
        <p>The Mediolano IP Platform combines the best of both worlds, offering traditional legal backing with cutting-edge blockchain technology. Our platform provides creators with comprehensive protection that's both legally sound and technologically advanced.</p>
      </div>
    `,
    image: "/placeholder.svg?height=400&width=800",
    author: authors[1],
    publishedAt: "2025-08-06",
    category: "Education",
    tags: ["IP Protection", "Guide", "Blockchain", "Copyright"],
    featured: false,
    readTime: 8,
  },
  {
    id: "3",
    slug: "creator-success-stories",
    title: "Creator Success Stories: How MIP Changed Their Lives",
    excerpt:
      "Real stories from creators who transformed their careers using blockchain-based IP protection. Discover how they increased revenue and protected their work.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>Meet the creators who have transformed their careers using the Mediolano IP Platform. These success stories showcase the real-world impact of blockchain-based IP protection.</p>
        
        <h2>Sarah's Photography Journey</h2>
        <p>Sarah, a freelance photographer from São Paulo, struggled with image theft and unauthorized usage. After joining MIP, she saw a 300% increase in licensing revenue and complete elimination of unauthorized usage.</p>

        <h2>Miguel's Music Revolution</h2>
        <p>Independent musician Miguel used MIP to protect his compositions and automate licensing. He now earns passive income from his music catalog while maintaining full creative control.</p>

        <h2>The Digital Art Collective</h2>
        <p>A group of digital artists formed a collective on MIP, sharing resources and cross-promoting their work. Together, they've generated over $50,000 in licensing revenue in just six months.</p>

        <p>These stories represent just a fraction of the creators who have found success with blockchain-based IP protection. Join them today and start protecting your creative work.</p>
      </div>
    `,
    image: "/placeholder.svg?height=400&width=800",
    author: authors[2],
    publishedAt: "2025-08-01",
    category: "Success Stories",
    tags: ["Success Stories", "Creators", "Revenue", "Protection"],
    featured: false,
    readTime: 6,
  },
  {
    id: "4",
    slug: "blockchain-ip-future",
    title: "The Future of Intellectual Property on Blockchain",
    excerpt:
      "Exploring how blockchain technology is revolutionizing IP protection, licensing, and monetization for creators worldwide.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>The intersection of blockchain technology and intellectual property represents one of the most exciting developments in the creative economy. As we look toward the future, several trends are emerging.</p>
        
        <h2>Programmable IP Rights</h2>
        <p>Smart contracts are enabling programmable IP rights, allowing creators to set automatic licensing terms, royalty distributions, and usage restrictions directly in code.</p>

        <h2>Global IP Registry</h2>
        <p>Blockchain provides the infrastructure for a truly global IP registry, where creators can register and protect their work across borders without complex legal procedures.</p>

        <h2>Micro-Licensing Revolution</h2>
        <p>The ability to license content for micro-payments opens new revenue streams for creators, enabling monetization of previously unprofitable uses.</p>

        <h2>AI and IP Protection</h2>
        <p>Artificial intelligence combined with blockchain creates powerful tools for detecting IP infringement and automating protection measures.</p>
      </div>
    `,
    image: "/placeholder.svg?height=400&width=800",
    author: authors[1],
    publishedAt: "2025-07-12",
    category: "Technology",
    tags: ["Blockchain", "Future", "Technology", "Innovation"],
    featured: false,
    readTime: 7,
  },
  {
    id: "5",
    slug: "mip-platform-updates",
    title: "MIP Platform Updates: New Features and Improvements",
    excerpt:
      "Discover the latest features and improvements to the Mediolano IP Platform, including enhanced analytics, mobile app updates, and new creator tools.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>We're excited to announce several major updates to the Mediolano IP Platform that will enhance your experience and provide new opportunities for creators.</p>
        
        <h2>Enhanced Analytics Dashboard</h2>
        <p>Our new analytics dashboard provides deeper insights into your IP portfolio performance, including:</p>
        <ul>
          <li>Real-time licensing revenue tracking</li>
          <li>Geographic usage analytics</li>
          <li>Trend analysis and predictions</li>
          <li>Comparative performance metrics</li>
        </ul>

        <h2>Mobile App Improvements</h2>
        <p>The MIP mobile app now features:</p>
        <ul>
          <li>Faster upload and processing</li>
          <li>Offline mode for viewing your portfolio</li>
          <li>Push notifications for licensing opportunities</li>
          <li>Enhanced security features</li>
        </ul>

        <h2>New Creator Tools</h2>
        <p>We've added several new tools to help creators maximize their IP value:</p>
        <ul>
          <li>Automated pricing suggestions</li>
          <li>Bulk licensing management</li>
          <li>Collaboration features for teams</li>
          <li>Integration with popular creative software</li>
        </ul>
      </div>
    `,
    image: "/placeholder.svg?height=400&width=800",
    author: authors[0],
    publishedAt: "2025-07-10",
    category: "Platform Updates",
    tags: ["Updates", "Features", "Mobile", "Analytics"],
    featured: false,
    readTime: 4,
  },
  {
    id: "6",
    slug: "legal-aspects-blockchain-ip",
    title: "Legal Aspects of Blockchain-Based IP Protection",
    excerpt:
      "Understanding the legal framework surrounding blockchain IP protection, including enforceability, jurisdiction, and compliance considerations.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p>As blockchain-based IP protection becomes mainstream, understanding the legal implications is crucial for creators and businesses alike.</p>
        
        <h2>Legal Recognition</h2>
        <p>Many jurisdictions now recognize blockchain records as valid evidence of IP ownership and creation dates. This legal recognition strengthens the protection offered by platforms like MIP.</p>

        <h2>Enforceability</h2>
        <p>Smart contracts and blockchain records provide strong evidence in legal disputes, but enforcement still requires traditional legal mechanisms in most jurisdictions.</p>

        <h2>International Considerations</h2>
        <p>Blockchain's global nature creates opportunities and challenges:</p>
        <ul>
          <li>Cross-border IP protection</li>
          <li>Jurisdictional complexities</li>
          <li>International treaty implications</li>
          <li>Regulatory compliance requirements</li>
        </ul>

        <h2>Best Practices</h2>
        <p>To maximize legal protection:</p>
        <ul>
          <li>Maintain detailed creation records</li>
          <li>Use reputable blockchain platforms</li>
          <li>Understand local IP laws</li>
          <li>Consider traditional registration alongside blockchain protection</li>
        </ul>
      </div>
    `,
    image: "/placeholder.svg?height=400&width=800",
    author: authors[1],
    publishedAt: "2025-07-08",
    category: "Legal",
    tags: ["Legal", "Compliance", "Blockchain", "IP Law"],
    featured: false,
    readTime: 9,
  },
]

// Helper functions
export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug)
}

export function getFeaturedArticles(): NewsArticle[] {
  return newsArticles.filter((article) => article.featured)
}

export function getArticlesByCategory(category: string): NewsArticle[] {
  return newsArticles.filter((article) => article.category === category)
}

export function searchArticles(query: string): NewsArticle[] {
  const lowercaseQuery = query.toLowerCase()
  return newsArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getRelatedArticles(currentArticle: NewsArticle, limit = 3): NewsArticle[] {
  return newsArticles
    .filter(
      (article) =>
        article.id !== currentArticle.id &&
        (article.category === currentArticle.category || article.tags.some((tag) => currentArticle.tags.includes(tag))),
    )
    .slice(0, limit)
}

export function getAllCategories(): string[] {
  return [...new Set(newsArticles.map((article) => article.category))]
}

export function getAllTags(): string[] {
  return [...new Set(newsArticles.flatMap((article) => article.tags))]
}

export function getTrendingTags(): string[] {
  const tagCounts = newsArticles.reduce(
    (acc, article) => {
      article.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag)
}
