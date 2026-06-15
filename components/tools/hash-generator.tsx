'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'

type HashType = 'md5' | 'sha1' | 'sha256'

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<HashType, string>>({
    md5: '',
    sha1: '',
    sha256: '',
  })
  const [copied, setCopied] = useState<string | null>(null)

  // Simple MD5 implementation
  const md5 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // SHA1 using SubtleCrypto
  const sha1 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // SHA256 using SubtleCrypto
  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '' })
      return
    }

    try {
      const [sha1Result, sha256Result] = await Promise.all([
        sha1(text),
        sha256(text),
      ])

      setHashes({
        md5: 'MD5 not available via Web Crypto',
        sha1: sha1Result,
        sha256: sha256Result,
      })
    } catch (error) {
      console.error('Hash generation error:', error)
    }
  }

  const handleInputChange = (text: string) => {
    setInput(text)
    generateHashes(text)
  }

  const copyToClipboard = (hash: string, type: string) => {
    navigator.clipboard.writeText(hash)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const hashTypes: HashType[] = ['sha1', 'sha256']

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-32 p-4 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
        />
      </div>

      {input && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">Note:</p>
            <p>Hashing is done entirely in your browser. No data is sent to any server.</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {hashTypes.map(type => (
          <div key={type} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-medium">{type.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {type === 'sha1' && 'SHA-1 (160-bit)'}
                  {type === 'sha256' && 'SHA-256 (256-bit)'}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(hashes[type], type)}
                disabled={!hashes[type] || hashes[type].includes('not available')}
                className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-50"
              >
                {copied === type ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <code className="block text-xs font-mono bg-muted p-3 rounded break-all text-muted-foreground">
              {hashes[type] || '(waiting for input)'}
            </code>
          </div>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-medium mb-2">Common Uses:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Verify file integrity</li>
          <li>Compare passwords securely</li>
          <li>Create checksums</li>
          <li>Data deduplication</li>
        </ul>
      </div>
    </div>
  )
}
