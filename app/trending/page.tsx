import type { Metadata } from 'next'
import { ToolCard } from '@/components/tool-card'

export const metadata: Metadata = {
  title: 'Trending Tools - UtilityHub',
  description: 'Discover the most popular and trending tools on UtilityHub. See what others are using most.',
  openGraph: {
    title: 'Trending Tools - UtilityHub',
    description: 'Discover the most popular and trending tools on UtilityHub.',
  },
}

interface TrendingTool {
  slug: string
  name: string
  description: string
  category: string
  iconName: string
  color: string
  popularity: number
  badge?: string
}

const trendingTools: TrendingTool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data',
    category: 'Developer Tools',
    iconName: 'code',
    color: 'bg-sky-500/10 text-sky-500 dark:bg-sky-500/20',
    popularity: 95,
    badge: 'Hot'
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, random passwords with custom rules',
    category: 'Developer Tools',
    iconName: 'zap',
    color: 'bg-lime-500/10 text-lime-500 dark:bg-lime-500/20',
    popularity: 88,
    badge: 'Popular'
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images without losing quality',
    category: 'Image Tools',
    iconName: 'minimize-2',
    color: 'bg-green-500/10 text-green-500 dark:bg-green-500/20',
    popularity: 92,
    badge: 'Hot'
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents to editable Word format',
    category: 'PDF Tools',
    iconName: 'file-down',
    color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
    popularity: 89,
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    category: 'Developer Tools',
    iconName: 'palette',
    color: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20',
    popularity: 85,
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes from text or URLs',
    category: 'Developer Tools',
    iconName: 'barcode',
    color: 'bg-red-500/10 text-red-500 dark:bg-red-500/20',
    popularity: 82,
    badge: 'New'
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    category: 'Productivity',
    iconName: 'ruler',
    color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20',
    popularity: 80,
  },
  {
    slug: 'translator',
    name: 'Translator',
    description: 'Translate text between multiple languages',
    category: 'Text Tools',
    iconName: 'languages',
    color: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20',
    popularity: 87,
  },
  {
    slug: 'todo-list',
    name: 'To-Do List',
    description: 'Create and manage tasks with local storage',
    category: 'Productivity',
    iconName: 'list-todo',
    color: 'bg-green-500/10 text-green-500 dark:bg-green-500/20',
    popularity: 83,
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to exact dimensions',
    category: 'Image Tools',
    iconName: 'image',
    color: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20',
    popularity: 78,
  },
]

export default function TrendingPage() {
  const sortedTools = [...trendingTools].sort((a, b) => b.popularity - a.popularity)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Trending Tools</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular tools being used right now. These are the tools that our community loves.
          </p>
        </div>

        {/* Tools with Popularity Bars */}
        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {sortedTools.map((tool, index) => (
            <div key={tool.slug} className="group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-muted-foreground w-8">#{index + 1}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{tool.name}</h3>
                      {tool.badge && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary whitespace-nowrap ml-4">{tool.popularity}%</span>
              </div>
              
              {/* Popularity Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                  style={{ width: `${tool.popularity}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-muted p-8 rounded-xl mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Community Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">{trendingTools.length}</p>
              <p className="text-muted-foreground mt-2">Tools in Trending</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">{trendingTools.filter(t => t.badge).length}</p>
              <p className="text-muted-foreground mt-2">New & Popular</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">
                {Math.round(trendingTools.reduce((acc, t) => acc + t.popularity, 0) / trendingTools.length)}%
              </p>
              <p className="text-muted-foreground mt-2">Avg. Popularity</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16 bg-blue-500/10 border border-blue-500/30 rounded-xl p-8">
          <h3 className="text-lg font-bold mb-4">Why These Tools Are Trending</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ <strong>High Utility:</strong> Tools that solve real problems for users</li>
            <li>✓ <strong>100% Privacy:</strong> All processing happens in your browser</li>
            <li>✓ <strong>Fast & Reliable:</strong> No server uploads, instant results</li>
            <li>✓ <strong>Community Favorite:</strong> Recommended by users like you</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
