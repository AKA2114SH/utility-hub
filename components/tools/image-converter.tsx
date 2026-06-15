"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Download, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileDropzone } from '@/components/file-dropzone'

const formats = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

export function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [targetFormat, setTargetFormat] = useState('image/webp')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [])

  const convertImage = useCallback(async () => {
    if (!file || !canvasRef.current) return
    
    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      console.error('File exceeds 50MB limit')
      return
    }
    
    setLoading(true)
    
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = preview!
      })

      canvas.width = img.width
      canvas.height = img.height
      
      // Fill with white background for JPEG (no transparency)
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx.drawImage(img, 0, 0)
      setResult(canvas.toDataURL(targetFormat, 0.92))
    } catch (error) {
      console.error('Conversion error:', error)
    } finally {
      setLoading(false)
    }
  }, [file, preview, targetFormat])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
  }, [])

  const downloadResult = useCallback(() => {
    if (!result || !file) return
    const format = formats.find(f => f.value === targetFormat)
    const a = document.createElement('a')
    a.href = result
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}.${format?.ext || 'png'}`
    a.click()
  }, [result, file, targetFormat])

  const reset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }, [])

  const currentFormat = file?.type.split('/')[1]?.toUpperCase() || 'Unknown'

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFileSelect={handleFileSelect}
          label="Drop your image here or click to upload"
          hint="Supports JPG, PNG, WebP, GIF, and more"
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-6 w-6 text-orange-500" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Current format: {currentFormat}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              Choose Another
            </Button>
          </div>

          {/* Format Selection */}
          <div className="rounded-lg bg-secondary p-4">
            <Label className="mb-2 block">Convert to:</Label>
            <Select value={targetFormat} onValueChange={setTargetFormat}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={convertImage} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              `Convert to ${formats.find(f => f.value === targetFormat)?.label}`
            )}
          </Button>

          {/* Preview */}
          {preview && (
            <div>
              <p className="mb-2 text-sm font-medium">Preview</p>
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-80 rounded-lg border object-contain"
              />
            </div>
          )}

          {result && (
            <Button onClick={downloadResult} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download {formats.find(f => f.value === targetFormat)?.label}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
