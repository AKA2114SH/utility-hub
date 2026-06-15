import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Guides & Tutorials - UtilityHub',
  description: 'Learn how to use UtilityHub tools effectively. Comprehensive guides and tutorials for PDF conversion, image processing, JSON formatting, and more.',
  openGraph: {
    title: 'Guides & Tutorials - UtilityHub',
    description: 'Learn how to maximize your productivity with UtilityHub tools.',
  },
}

interface Guide {
  title: string
  description: string
  category: string
  slug: string
  readTime: string
}

const guides: Guide[] = [
  {
    title: 'Complete Guide to PDF Conversion',
    description: 'Learn how to extract text and convert PDFs to Word format. We cover best practices and common challenges.',
    category: 'PDF Tools',
    slug: 'pdf-conversion-guide',
    readTime: '5 min read',
  },
  {
    title: 'Image Optimization for Web',
    description: 'Master image compression, resizing, and format conversion to optimize your website performance.',
    category: 'Image Tools',
    slug: 'image-optimization-guide',
    readTime: '7 min read',
  },
  {
    title: 'JSON Data: Format, Validate & Minify',
    description: 'Comprehensive guide to working with JSON data. Learn formatting, validation, and minification techniques.',
    category: 'Developer Tools',
    slug: 'json-guide',
    readTime: '6 min read',
  },
  {
    title: 'Password Security Best Practices',
    description: 'Create strong, memorable passwords. Understand security levels and what makes a password truly secure.',
    category: 'Developer Tools',
    slug: 'password-security-guide',
    readTime: '4 min read',
  },
  {
    title: 'Understanding Color Formats',
    description: 'Deep dive into HEX, RGB, HSL color formats. Learn when and why to use each format in your projects.',
    category: 'Developer Tools',
    slug: 'color-formats-guide',
    readTime: '5 min read',
  },
  {
    title: 'Productivity Tips & Tricks',
    description: 'Get the most out of UtilityHub. Discover workflows and combinations that save time.',
    category: 'Productivity',
    slug: 'productivity-tips-guide',
    readTime: '6 min read',
  },
]

const categories = [...new Set(guides.map(g => g.category))]

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Guides & Tutorials</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how to use UtilityHub tools effectively. From beginner tips to advanced workflows, we&apos;ve got you covered.
          </p>
        </div>

        {/* Guides by Category */}
        <div className="space-y-12">
          {categories.map(category => {
            const categoryGuides = guides.filter(g => g.category === category)
            return (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryGuides.map(guide => (
                    <article
                      key={guide.slug}
                      className="p-6 border border-border rounded-lg hover:shadow-lg hover:border-primary/50 transition-all"
                    >
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {guide.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                      <p className="text-muted-foreground mb-4">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium"
                        >
                          Read Guide
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 bg-muted p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="font-bold mb-2">Are my files kept private?</h3>
              <p className="text-muted-foreground">
                Yes! UtilityHub is 100% client-side. All processing happens in your browser. We never upload your files to any server.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Do I need to create an account?</h3>
              <p className="text-muted-foreground">
                No account required. All tools are completely free and work without registration. Your favorites can be saved locally.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">What file size limits are there?</h3>
              <p className="text-muted-foreground">
                File sizes are limited only by your browser's capabilities. Most modern browsers support files up to several GB.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Can I use UtilityHub offline?</h3>
              <p className="text-muted-foreground">
                UtilityHub is a web app, so you need internet to load the page. However, once loaded, many tools work offline.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
          <p className="text-muted-foreground mb-6">Explore all our tools and find the perfect one for your needs.</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Explore All Tools
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
