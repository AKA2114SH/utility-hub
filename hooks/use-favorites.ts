'use client'

import { useState, useEffect } from 'react'

export interface FavoriteTool {
  slug: string
  name: string
  addedAt: number
}

const FAVORITES_KEY = 'utilityhub_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteTool[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  }, [favorites, isLoading])

  const addFavorite = (slug: string, name: string) => {
    setFavorites(prev => {
      if (prev.some(f => f.slug === slug)) {
        return prev
      }
      return [{ slug, name, addedAt: Date.now() }, ...prev]
    })
  }

  const removeFavorite = (slug: string) => {
    setFavorites(prev => prev.filter(f => f.slug !== slug))
  }

  const isFavorite = (slug: string) => {
    return favorites.some(f => f.slug === slug)
  }

  const clearAllFavorites = () => {
    setFavorites([])
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites,
    isLoading,
  }
}
