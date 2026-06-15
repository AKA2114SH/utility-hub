import type { Metadata } from 'next'
import { tools } from '@/lib/tools-data'
import { ToolCard } from '@/components/tool-card'

export const metadata: Metadata = {
  title: 'Explore Tools - UtilityHub',
  description: 'Discover and explore all our free online tools organized by category. Find the perfect tool for your needs.',
  openGraph: {
    title: 'Explore Tools - UtilityHub',
    description: 'Discover and explore all our free online tools organized by category.',
  },
}

export default function ExplorePage() {
  const toolsByCategory = tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = []
      }
      acc[tool.category].push(tool)
      return acc
    },
    {} as Record<string, typeof tools>
  )

  const categories = Object.keys(toolsByCategory).sort()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Explore All Tools</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of free online tools. No registration required, everything runs in your browser.
          </p>
        </div>

        {/* Tools by Category */}
        <div className="space-y-16">
          {categories.map(category => (
            <section key={category}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{category}</h2>
                <p className="text-muted-foreground mt-2">
                  {toolsByCategory[category].length} tool{toolsByCategory[category].length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsByCategory[category].map(tool => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-muted p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">{tools.length}</p>
              <p className="text-muted-foreground mt-2">Tools Available</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">{categories.length}</p>
              <p className="text-muted-foreground mt-2">Categories</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">100%</p>
              <p className="text-muted-foreground mt-2">Free & Private</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
