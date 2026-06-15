'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function ColorConverter() {
  const [color, setColor] = useState('#3B82F6')
  const [copied, setCopied] = useState<string | null>(null)

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('').toUpperCase()
  }

  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  }

  const [r, g, b] = hexToRgb(color)
  const [h, s, l] = rgbToHsl(r, g, b)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const formats = [
    { label: 'HEX', value: color, type: 'hex' },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})`, type: 'rgb' },
    { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, 1)`, type: 'rgba' },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)`, type: 'hsl' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Pick a Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-16 rounded-lg border border-border cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">HEX Input</label>
          <input
            type="text"
            value={color}
            onChange={(e) => {
              const val = e.target.value
              if (/^#[0-9A-F]{6}$/i.test(val)) {
                setColor(val)
              }
            }}
            placeholder="#000000"
            className="px-3 py-2 border border-border rounded-lg font-mono text-sm w-32"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formats.map(format => (
          <div key={format.type} className="p-4 border border-border rounded-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{format.label}</p>
                <code className="block text-sm font-mono bg-muted p-2 rounded break-all">
                  {format.value}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(format.value, format.type)}
                className="p-2 hover:bg-muted rounded transition-colors flex-shrink-0"
              >
                {copied === format.type ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-3">Color Values</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Red</p>
            <p className="font-mono font-medium">{r}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Green</p>
            <p className="font-mono font-medium">{g}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Blue</p>
            <p className="font-mono font-medium">{b}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Hue</p>
            <p className="font-mono font-medium">{h}°</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'].map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="h-16 rounded-lg border-2 border-border hover:border-primary transition-colors"
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
    </div>
  )
}
