"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToolIcon } from '@/components/tool-icon'
import { useFavorites } from '@/hooks/use-favorites'
import type { Tool } from '@/lib/tools-data'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [mounted, setMounted] = useState(false)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsFav(isFavorite(tool.slug))
  }, [tool.slug, isFavorite])

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isFav) {
      removeFavorite(tool.slug)
      setIsFav(false)
    } else {
      addFavorite(tool.slug, tool.name)
      setIsFav(true)
    }
  }

  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5"
    >
      {mounted && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn("h-5 w-5", isFav && "fill-red-500 text-red-500")} />
        </button>
      )}

      <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-lg", tool.color)}>
        <ToolIcon name={tool.iconName} className="h-6 w-6" />
      </div>
      
      <h3 className="mb-2 font-semibold text-foreground">{tool.name}</h3>
      <p className="mb-4 flex-1 text-sm text-muted-foreground">{tool.description}</p>
      
      <div className="flex items-center text-sm font-medium text-foreground">
        <span>Use tool</span>
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
