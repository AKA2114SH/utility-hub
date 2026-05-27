"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ToolIcon } from '@/components/tool-icon'
import type { Tool } from '@/lib/tools-data'

interface ToolWrapperProps {
  tool: Tool
  children: React.ReactNode
}

export function ToolWrapper({ tool, children }: ToolWrapperProps) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Back Navigation */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tools
        </Button>
      </Link>

      {/* Tool Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl", tool.color)}>
          <ToolIcon name={tool.iconName} className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{tool.name}</h1>
          <p className="mt-1 text-muted-foreground">{tool.description}</p>
          <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Tool Content */}
      <div className="rounded-xl border border-border bg-card p-6">
        {children}
      </div>

      {/* Privacy Notice */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </p>
    </div>
  )
}
