'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState('')
  const [copied, setCopied] = useState(false)

  const convertMarkdownToHTML = (md: string): string => {
    let html = md
      // Headers
      .replace(/^### (.*?)$/gm, '<h3 style="font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem 0;">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 style="font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.5rem 0;">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 style="font-size: 2rem; font-weight: 700; margin: 2rem 0 0.5rem 0;">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700;">$1</strong>')
      .replace(/__(.*?)__/g, '<strong style="font-weight: 700;">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
      .replace(/_(.*?)_/g, '<em style="font-style: italic;">$1</em>')
      // Code
      .replace(/`(.*?)`/g, '<code style="background: rgb(var(--color-muted)); padding: 0.2em 0.4em; border-radius: 0.25rem; font-family: monospace;">$1</code>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid rgb(var(--color-border)); margin: 2rem 0;" />')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: rgb(59, 130, 246); text-decoration: underline;">$1</a>')
      // Lists
      .replace(/^\* (.*?)$/gm, '<li style="margin-left: 1.5rem;">$1</li>')
      .replace(/^- (.*?)$/gm, '<li style="margin-left: 1.5rem;">$1</li>')
      .replace(/(<li.*?<\/li>)/s, '<ul style="list-style: disc;">$1</ul>')
      // Line breaks
      .replace(/\n/g, '<br />')

    return html
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const loadSample = () => {
    const sample = `# Welcome to Markdown

## What is Markdown?

Markdown is a **lightweight markup language** for creating formatted text.

### Features

- Easy to read and write
- Supports *italic* and **bold** text
- Supports \`code\` snippets

## Example

Here's a [link to example](https://example.com)

---

\`\`\`
// Code blocks are supported
const message = "Hello, World!";
\`\`\`

Enjoy writing with Markdown!`
    setMarkdown(sample)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={loadSample}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Load Sample
        </button>
        <button
          onClick={copyToClipboard}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Markdown'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Markdown Input</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Enter Markdown here..."
            className="w-full h-96 p-4 font-mono text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">HTML Preview</label>
          <div className="w-full h-96 p-4 border border-border rounded-lg bg-muted overflow-auto">
            <div
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(markdown) }}
              className="prose prose-sm dark:prose-invert max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-medium mb-2">Supported Syntax:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li><code className="bg-background px-1 rounded"># Heading</code> - Main heading</li>
          <li><code className="bg-background px-1 rounded">## Sub-heading</code> - Sub heading</li>
          <li><code className="bg-background px-1 rounded">**bold**</code> - Bold text</li>
          <li><code className="bg-background px-1 rounded">*italic*</code> - Italic text</li>
          <li><code className="bg-background px-1 rounded">[link](url)</code> - Links</li>
          <li><code className="bg-background px-1 rounded">- item</code> - Lists</li>
        </ul>
      </div>
    </div>
  )
}
