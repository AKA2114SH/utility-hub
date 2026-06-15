"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, Sun, Wrench, Heart } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/use-favorites'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { favorites } = useFavorites()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Wrench className="h-4 w-4" />
          </div>
          <span className="text-lg">UtilityHub</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/trending" className="text-sm font-medium hover:text-primary transition-colors">
              Trending
            </Link>
            <Link href="/guides" className="text-sm font-medium hover:text-primary transition-colors">
              Guides
            </Link>
          </div>
          
          {mounted && (
            <Link href="/favorites" className="relative flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative"
              >
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {Math.min(favorites.length, 9)}
                  </span>
                )}
              </Button>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
