import type { Metadata } from 'next'
import Link from 'next/link'
import { tools } from '@/lib/tools-data'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Collections - UtilityHub',
  description: 'Discover curated collections of tools grouped by use case and workflow. Find tools perfect for your specific needs.',
  openGraph: {
    title: 'Collections - UtilityHub',
    description: 'Discover curated collections of tools grouped by use case and workflow.',
  },
}

interface ToolCollection {
  title: string
  description: string
  icon: string
  tools: string[]
  color: string
}

const collections: ToolCollection[] = [
  {
    title: 'PDF Professional',
    description: 'Complete PDF toolkit for extracting text and converting documents',
    icon: '📄',
    tools: ['pdf-to-text', 'pdf-to-word'],
    color: 'from-red-500/10 to-red-600/10 border-red-500/30',
  },
  {
    title: 'Image Master',
    description: 'All-in-one image toolset for compression, conversion, and resizing',
    icon: '🖼️',
    tools: ['image-compressor', 'image-converter', 'image-resizer', 'background-remover'],
    color: 'from-green-500/10 to-green-600/10 border-green-500/30',
  },
  {
    title: 'Developer Toolkit',
    description: 'Essential tools for developers: JSON formatting, hashing, color conversion',
    icon: '💻',
    tools: ['json-formatter', 'hash-generator', 'color-converter', 'password-generator', 'qr-code-generator'],
    color: 'from-blue-500/10 to-blue-600/10 border-blue-500/30',
  },
  {
    title: 'Writing & Content',
    description: 'Text transformation, markdown preview, and language tools',
    icon: '✍️',
    tools: ['text-case-converter', 'markdown-preview', 'translator', 'voice-typing'],
    color: 'from-purple-500/10 to-purple-600/10 border-purple-500/30',
  },
  {
    title: 'Productivity Suite',
    description: 'Organize your life with task management, calculations, and conversions',
    icon: '⚡',
    tools: ['todo-list', 'age-calculator', 'unit-converter', 'spreadsheet-editor'],
    color: 'from-amber-500/10 to-amber-600/10 border-amber-500/30',
  },
  {
    title: 'Media & Entertainment',
    description: 'Video playback with subtitle support for immersive experience',
    icon: '🎬',
    tools: ['subtitle-player'],
    color: 'from-pink-500/10 to-pink-600/10 border-pink-500/30',
  },
]

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Curated Collections</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked collections of tools organized by workflow and use case. Find the perfect combination of tools for your project.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map(collection => (
            <div
              key={collection.title}
              className={`border rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-br ${collection.color}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{collection.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{collection.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
                </div>
              </div>

              {/* Tools in Collection */}
              <div className="space-y-2 mb-4">
                {collection.tools.map(slug => {
                  const tool = tools.find(t => t.slug === slug)
                  return tool ? (
                    <div
                      key={slug}
                      className="text-sm p-2 rounded bg-background/50 hover:bg-background transition-colors flex items-center justify-between group"
                    >
                      <span>{tool.name}</span>
                      <span className="text-xs text-muted-foreground">{tool.category}</span>
                    </div>
                  ) : null
                })}
              </div>

              {/* Action Button */}
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium"
              >
                View Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Use Cases Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-muted">
            <h3 className="text-lg font-bold mb-2">For Professionals</h3>
            <p className="text-sm text-muted-foreground">PDF tools and productivity suite for document handling and task management.</p>
          </div>
          <div className="p-6 rounded-xl bg-muted">
            <h3 className="text-lg font-bold mb-2">For Developers</h3>
            <p className="text-sm text-muted-foreground">JSON formatting, hashing, color conversion, and QR code generation tools.</p>
          </div>
          <div className="p-6 rounded-xl bg-muted">
            <h3 className="text-lg font-bold mb-2">For Content Creators</h3>
            <p className="text-sm text-muted-foreground">Image tools, text transformation, and media support for your creative workflow.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
