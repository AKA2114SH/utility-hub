'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let chars = ''
    if (options.uppercase) chars += uppercase
    if (options.lowercase) chars += lowercase
    if (options.numbers) chars += numbers
    if (options.symbols) chars += symbols

    if (!chars) {
      setError('Please select at least one character type')
      setPassword('')
      return
    }

    setError(null)
    let pass = ''
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(pass)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Generated Password</p>
            <p className="font-mono text-xl break-all">{password || 'Click generate to create a password'}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generatePassword}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Generate
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Password Length: {length}
        </label>
        <input
          type="range"
          min="8"
          max="128"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">Recommended: 12-16 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Include Characters</label>
        <div className="space-y-2">
          {[
            { key: 'uppercase', label: 'Uppercase (A-Z)', checked: options.uppercase },
            { key: 'lowercase', label: 'Lowercase (a-z)', checked: options.lowercase },
            { key: 'numbers', label: 'Numbers (0-9)', checked: options.numbers },
            { key: 'symbols', label: 'Symbols (!@#$%...)', checked: options.symbols },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) =>
                  setOptions(prev => ({
                    ...prev,
                    [item.key]: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-medium mb-2">Security Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use unique passwords for each account</li>
          <li>Longer passwords are stronger (16+ characters recommended)</li>
          <li>Include mix of character types</li>
          <li>Avoid common words or patterns</li>
        </ul>
      </div>
    </div>
  )
}
