'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'

export function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'format' | 'minify' | 'validate'>('format')

  const processJSON = (text: string, currentMode: typeof mode) => {
    try {
      setError('')
      if (!text.trim()) {
        setOutput('')
        return
      }

      const parsed = JSON.parse(text)

      switch (currentMode) {
        case 'format':
          setOutput(JSON.stringify(parsed, null, 2))
          break
        case 'minify':
          setOutput(JSON.stringify(parsed))
          break
        case 'validate':
          setOutput(JSON.stringify({ valid: true, message: 'Valid JSON' }, null, 2))
          break
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setOutput('')
    }
  }

  const handleInputChange = (text: string) => {
    setInput(text)
    processJSON(text, mode)
  }

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode)
    processJSON(input, newMode)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const loadSample = () => {
    const sample = JSON.stringify(
      {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        skills: ['JavaScript', 'React', 'Node.js'],
        address: {
          street: '123 Main St',
          city: 'New York',
          zip: '10001',
        },
      },
      null,
      2
    )
    handleInputChange(sample)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {(['format', 'minify', 'validate'] as const).map(m => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
        <button
          onClick={loadSample}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors ml-auto"
        >
          Load Sample
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-64 p-4 font-mono text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output</label>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-4 font-mono text-sm border border-border rounded-lg bg-muted text-foreground"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
        <p className="font-medium mb-2">File size:</p>
        <p>Input: {(input.length / 1024).toFixed(2)} KB</p>
        <p>Output: {(output.length / 1024).toFixed(2)} KB</p>
        {output && (
          <p className="mt-2">
            Compression: {((1 - output.length / input.length) * 100).toFixed(1)}% smaller
          </p>
        )}
      </div>
    </div>
  )
}
