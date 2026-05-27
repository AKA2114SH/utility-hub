"use client"

import { useState, useCallback, useRef } from 'react'
import { Download, Loader2, Image as ImageIcon, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileDropzone } from '@/components/file-dropzone'

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 })
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [maintainRatio, setMaintainRatio] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
    setResult(null)

    const img = new window.Image()
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height })
      setWidth(img.width)
      setHeight(img.height)
    }
    img.src = url
  }, [])

  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth)
    if (maintainRatio && originalSize.width > 0) {
      const ratio = originalSize.height / originalSize.width
      setHeight(Math.round(newWidth * ratio))
    }
  }, [maintainRatio, originalSize])

  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight)
    if (maintainRatio && originalSize.height > 0) {
      const ratio = originalSize.width / originalSize.height
      setWidth(Math.round(newHeight * ratio))
    }
  }, [maintainRatio, originalSize])

  const resizeImage = useCallback(async () => {
    if (!file || !canvasRef.current || !preview) return
    
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
        img.src = preview
      })

      canvas.width = width
      canvas.height = height
      
      // Use better image smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      ctx.drawImage(img, 0, 0, width, height)
      setResult(canvas.toDataURL('image/png', 1.0))
    } catch (error) {
      console.error('Resize error:', error)
    } finally {
      setLoading(false)
    }
  }, [file, preview, width, height])

  const downloadResult = useCallback(() => {
    if (!result || !file) return
    const a = document.createElement('a')
    a.href = result
    a.download = `resized-${width}x${height}-${file.name}`
    a.click()
  }, [result, file, width, height])

  const reset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }, [])

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFileSelect={handleFileSelect}
          label="Drop your image here or click to upload"
          hint="Resize images to exact dimensions"
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-6 w-6 text-teal-500" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Original: {originalSize.width} x {originalSize.height}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              Choose Another
            </Button>
          </div>

          {/* Size Controls */}
          <div className="rounded-lg bg-secondary p-4">
            <div className="mb-4 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMaintainRatio(!maintainRatio)}
              >
                {maintainRatio ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Aspect Ratio Locked
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Aspect Ratio Unlocked
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  min={1}
                  max={10000}
                />
              </div>
              <div className="space-y-2">
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  min={1}
                  max={10000}
                />
              </div>
            </div>

            {/* Preset Sizes */}
            <div className="mt-4">
              <Label className="mb-2 block text-sm">Presets:</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { w: 1920, h: 1080, label: 'HD' },
                  { w: 1280, h: 720, label: '720p' },
                  { w: 800, h: 600, label: '800x600' },
                  { w: 400, h: 400, label: 'Square' },
                  { w: 150, h: 150, label: 'Thumbnail' },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMaintainRatio(false)
                      setWidth(preset.w)
                      setHeight(preset.h)
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={resizeImage} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resizing...
              </>
            ) : (
              `Resize to ${width} x ${height}`
            )}
          </Button>

          {/* Preview */}
          <div className="grid gap-4 sm:grid-cols-2">
            {preview && (
              <div>
                <p className="mb-2 text-sm font-medium">Original</p>
                <img 
                  src={preview} 
                  alt="Original" 
                  className="max-h-60 rounded-lg border object-contain"
                />
              </div>
            )}
            {result && (
              <div>
                <p className="mb-2 text-sm font-medium">Resized</p>
                <img 
                  src={result} 
                  alt="Resized" 
                  className="max-h-60 rounded-lg border object-contain"
                />
              </div>
            )}
          </div>

          {result && (
            <Button onClick={downloadResult} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Resized Image
            </Button>
          )}
        </>
      )}
    </div>
  )
}
