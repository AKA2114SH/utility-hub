'use client'

import { useState, useEffect } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, ArrowRight, Trash2 } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { tools } from '@/lib/tools-data'
import { ToolIcon } from '@/components/tool-icon'

// Since this is a client component, we can't use generateMetadata
// But we can still export metadata from a parent layout if needed

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearAllFavorites, isLoading } = useFavorites()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const favoriteTools = favorites
    .map(fav => tools.find(t => t.slug === fav.slug))
    .filter(Boolean)

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading favorites...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Your Favorites</h1>
          <p className="text-lg text-muted-foreground">
            {favoriteTools.length === 0
              ? 'No favorites yet. Start adding tools to your favorites!'
              : `You have ${favoriteTools.length} favorite tool${favoriteTools.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {favoriteTools.length === 0 ? (
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8 p-8 bg-muted rounded-xl">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-6">
                When you add tools to favorites, they&apos;ll appear here for quick access.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Explore Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteTools.map(tool => {
                if (!tool) return null
                return (
                  <div
                    key={tool.slug}
                    className="p-6 border border-border rounded-lg hover:shadow-lg hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${tool.color}`}>
                        <ToolIcon name={tool.iconName} className="w-6 h-6" />
                      </div>
                      <button
                        onClick={() => removeFavorite(tool.slug)}
                        className="ml-auto p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded mb-4">
                      {tool.category}
                    </span>

                    <Link
                      href={`/tool/${tool.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium"
                    >
                      Use Tool
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Clear All Button */}
            <div className="text-center pt-8 border-t border-border">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all favorites?')) {
                    clearAllFavorites()
                  }
                }}
                className="px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Clear All Favorites
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-blue-500/10 border border-blue-500/30 rounded-xl p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-4">About Your Favorites</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ <strong>Saved Locally:</strong> Your favorites are stored in your browser&apos;s local storage</li>
            <li>✓ <strong>Private:</strong> No data is sent to our servers</li>
            <li>✓ <strong>Persistent:</strong> Your favorites persist across browser sessions</li>
            <li>✓ <strong>Synced Across Tabs:</strong> Changes update automatically in all open tabs</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
