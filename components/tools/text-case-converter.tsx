'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

type CaseType = 'uppercase' | 'lowercase' | 'title' | 'sentence' | 'toggle'

const caseOptions: { label: string; value: CaseType }[] = [
  { label: 'UPPERCASE', value: 'uppercase' },
  { label: 'lowercase', value: 'lowercase' },
  { label: 'Title Case', value: 'title' },
  { label: 'Sentence case', value: 'sentence' },
  { label: 'tOGGLE cASE', value: 'toggle' },
]

export function TextCaseConverter() {
  const [input, setInput] = useState('')
  const [caseType, setCaseType] = useState<CaseType>('uppercase')
  const [copied, setCopied] = useState(false)

  const convertCase = (text: string, type: CaseType): string => {
    switch (type) {
      case 'uppercase':
        return text.toUpperCase()
      case 'lowercase':
        return text.toLowerCase()
      case 'title':
        return text
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      case 'sentence':
        return text.toLowerCase().replace(/^\w/, c => c.toUpperCase())
      case 'toggle':
        return text
          .split('')
          .map(c => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
          .join('')
      default:
        return text
    }
  }

  const output = convertCase(input, caseType)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert..."
          className="w-full h-32 p-4 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Conversion Type</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {caseOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setCaseType(option.value)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                caseType === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Output</label>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          className="w-full h-32 p-4 border border-border rounded-lg bg-muted text-foreground"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Character count: {output.length}</p>
        <p>Word count: {output.trim().split(/\s+/).filter(w => w).length}</p>
      </div>
    </div>
  )
}
