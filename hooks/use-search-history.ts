'use client'

import { useState, useEffect } from 'react'

export interface SearchHistoryItem {
  query: string
  timestamp: number
}

const HISTORY_KEY = 'utilityhub_search_history'
const MAX_HISTORY = 20

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
    }
  }, [history, isLoading])

  const addToHistory = (query: string) => {
    if (!query.trim()) return

    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(item => item.query !== query)
      // Add new item at the beginning
      return [{ query: query.trim(), timestamp: Date.now() }, ...filtered].slice(0, MAX_HISTORY)
    })
  }

  const removeFromHistory = (query: string) => {
    setHistory(prev => prev.filter(item => item.query !== query))
  }

  const clearHistory = () => {
    setHistory([])
  }

  const getRecentQueries = (limit: number = 5) => {
    return history.slice(0, limit)
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentQueries,
    isLoading,
  }
}
