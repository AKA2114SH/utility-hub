"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Download, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { FileDropzone } from '@/components/file-dropzone'

export function BackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [threshold, setThreshold] = useState([200])
  const [tolerance, setTolerance] = useState([30])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImage = useCallback(async () => {
    if (!file || !canvasRef.current) return
    
    setLoading(true)
    
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
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
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Simple background removal based on brightness/color similarity
      // This uses a threshold-based approach for light backgrounds
      const thresholdValue = threshold[0]
      const toleranceValue = tolerance[0]

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // Calculate brightness
        const brightness = (r + g + b) / 3
        
        // Check if pixel is close to white/light background
        const isBackground = brightness > thresholdValue && 
          Math.abs(r - g) < toleranceValue && 
          Math.abs(g - b) < toleranceValue && 
          Math.abs(r - b) < toleranceValue

        if (isBackground) {
          data[i + 3] = 0 // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setResult(canvas.toDataURL('image/png'))
    } catch (error) {
      console.error('Processing error:', error)
    } finally {
      setLoading(false)
    }
  }, [file, preview, threshold, tolerance])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
  }, [])

  const downloadResult = useCallback(() => {
    if (!result || !file) return
    const a = document.createElement('a')
    a.href = result
    a.download = `no-bg-${file.name.replace(/\.[^/.]+$/, '')}.png`
    a.click()
  }, [result, file])

  const reset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }, [])

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      
      {!file ? (
        <>
          <FileDropzone
            accept="image/*"
            onFileSelect={handleFileSelect}
            label="Drop your image here or click to upload"
            hint="Works best with images that have light/white backgrounds"
          />
          <div className="rounded-lg bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
            <strong>Note:</strong> This tool uses browser-based filters for background removal. 
            It works best on images with solid light backgrounds. For complex backgrounds, 
            consider using a dedicated AI-powered service.
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-6 w-6 text-purple-500" />
              <p className="font-medium">{file.name}</p>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              Choose Another
            </Button>
          </div>

          {/* Settings */}
          <div className="grid gap-6 rounded-lg bg-secondary p-4 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Brightness Threshold: {threshold[0]}</Label>
              <Slider
                value={threshold}
                onValueChange={setThreshold}
                min={100}
                max={255}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Higher = removes lighter colors only
              </p>
            </div>
            <div className="space-y-3">
              <Label>Color Tolerance: {tolerance[0]}</Label>
              <Slider
                value={tolerance}
                onValueChange={setTolerance}
                min={5}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Higher = removes more color variations
              </p>
            </div>
          </div>

          <Button onClick={processImage} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Remove Background'
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
                  className="max-h-80 rounded-lg border object-contain"
                />
              </div>
            )}
            {result && (
              <div>
                <p className="mb-2 text-sm font-medium">Result</p>
                <div className="rounded-lg border bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23ccc%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23ccc%22%2F%3E%3C%2Fsvg%3E')]">
                  <img 
                    src={result} 
                    alt="Result" 
                    className="max-h-80 rounded-lg object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {result && (
            <Button onClick={downloadResult} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PNG (Transparent)
            </Button>
          )}
        </>
      )}
    </div>
  )
}
