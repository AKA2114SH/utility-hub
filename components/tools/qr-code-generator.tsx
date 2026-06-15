'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

export function QRCodeGenerator() {
  const [input, setInput] = useState('https://example.com')
  const [qrUrl, setQrUrl] = useState('')
  const [size, setSize] = useState(300)
  const [errorCorrection, setErrorCorrection] = useState('M')

  useEffect(() => {
    if (input.trim()) {
      const encodedInput = encodeURIComponent(input)
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedInput}&ecc=${errorCorrection}`
      setQrUrl(url)
    }
  }, [input, size, errorCorrection])

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `qrcode-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter URL, text, or email..."
          className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Create QR codes for URLs, text, emails, phone numbers, etc.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Size: {size}px</label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Error Correction</label>
          <select
            value={errorCorrection}
            onChange={(e) => setErrorCorrection(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="L">L (7% correction)</option>
            <option value="M">M (15% correction) - Recommended</option>
            <option value="Q">Q (25% correction)</option>
            <option value="H">H (30% correction)</option>
          </select>
        </div>
      </div>

      {qrUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="p-6 bg-white rounded-lg border-2 border-border">
            <img
              src={qrUrl}
              alt="Generated QR Code"
              className="w-64 h-64 md:w-80 md:h-80"
            />
          </div>

          <button
            onClick={downloadQR}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>
        </div>
      )}

      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-medium mb-2">Error Correction Levels:</p>
        <ul className="space-y-2 text-xs">
          <li><strong>L:</strong> Can recover if 7% of code is damaged</li>
          <li><strong>M:</strong> Can recover if 15% of code is damaged (default)</li>
          <li><strong>Q:</strong> Can recover if 25% of code is damaged</li>
          <li><strong>H:</strong> Can recover if 30% of code is damaged</li>
        </ul>
      </div>

      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-medium mb-2">What can be encoded:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>URLs and websites</li>
          <li>Plain text</li>
          <li>Email addresses</li>
          <li>Phone numbers</li>
          <li>WiFi credentials</li>
          <li>vCard contact information</li>
        </ul>
      </div>
    </div>
  )
}
