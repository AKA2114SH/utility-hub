"use client"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full",
          selected === null && "bg-foreground text-background hover:bg-foreground/90"
        )}
      >
        All Tools
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category)}
          className={cn(
            "rounded-full",
            selected === category && "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
