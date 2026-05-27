"use client"

import { useState, useMemo } from 'react'
import { Zap, Shield, Globe } from 'lucide-react'
import { tools, categories } from '@/lib/tools-data'
import { ToolCard } from '@/components/tool-card'
import { SearchTools } from '@/components/search-tools'
import { CategoryFilter } from '@/components/category-filter'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.category.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = selectedCategory === null || tool.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  const groupedTools = useMemo(() => {
    if (selectedCategory) {
      return { [selectedCategory]: filteredTools }
    }
    
    return filteredTools.reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = []
      }
      acc[tool.category].push(tool)
      return acc
    }, {} as Record<string, typeof tools>)
  }, [filteredTools, selectedCategory])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
          All-in-One Utility Hub
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty">
          Free online tools for PDF, Image, Text, and Productivity tasks. 
          Everything runs in your browser — no file uploads, complete privacy.
        </p>
        
        {/* Feature badges */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
            <Shield className="h-4 w-4 text-green-500" />
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
            <Globe className="h-4 w-4 text-blue-500" />
            <span>No Server Uploads</span>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto flex max-w-md justify-center">
          <SearchTools value={search} onChange={setSearch} />
        </div>
      </section>

      {/* Category Filter */}
      <section className="mb-8">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      {/* Tools Grid */}
      <section>
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category} className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        ))}
        
        {filteredTools.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No tools found matching your search.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        <p>
          Built with Next.js • All processing happens locally in your browser
        </p>
      </footer>
    </div>
  )
}
