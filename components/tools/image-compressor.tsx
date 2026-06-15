"use client"

import { useState, useCallback, useEffect } from 'react'
import { Download, Loader2, Image as ImageIcon } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { FileDropzone } from '@/components/file-dropzone'

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quality, setQuality] = useState([80])
  const [maxWidth, setMaxWidth] = useState([1920])

  // Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
      if (compressed) URL.revokeObjectURL(compressed.url)
    }
  }, [])

  const compressImage = useCallback(async () => {
    if (!file) return
    
    setLoading(true)
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: maxWidth[0],
        useWebWorker: true,
        initialQuality: quality[0] / 100,
      }

      const compressedFile = await imageCompression(file, options)
      const url = URL.createObjectURL(compressedFile)
      
      setCompressed({ url, size: compressedFile.size })
    } catch (error) {
      console.error('Compression error:', error)
    } finally {
      setLoading(false)
    }
  }, [file, quality, maxWidth])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null)
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setCompressed(null)
  }, [])

  const handleFileError = useCallback((error: string) => {
    setError(error)
    setFile(null)
    setPreview(null)
  }, [])

  const downloadCompressed = useCallback(() => {
    if (!compressed || !file) return
    const a = document.createElement('a')
    a.href = compressed.url
    a.download = `compressed-${file.name}`
    a.click()
  }, [compressed, file])

  const reset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setCompressed(null)
  }, [])

  const compressionRatio = file && compressed 
    ? Math.round((1 - compressed.size / file.size) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFileSelect={handleFileSelect}
          onError={handleFileError}
          label="Drop your image here or click to upload"
          hint="Supports JPG, PNG, WebP, and more"
          maxSize={50}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Original: {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              Choose Another
            </Button>
          </div>

          {/* Settings */}
          <div className="grid gap-6 rounded-lg bg-secondary p-4 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Quality: {quality[0]}%</Label>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={10}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-3">
              <Label>Max Width: {maxWidth[0]}px</Label>
              <Slider
                value={maxWidth}
                onValueChange={setMaxWidth}
                min={320}
                max={4096}
                step={64}
              />
            </div>
          </div>

          <Button onClick={compressImage} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compressing...
              </>
            ) : (
              'Compress Image'
            )}
          </Button>

          {/* Preview */}
          {preview && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium">Original</p>
                <img 
                  src={preview} 
                  alt="Original" 
                  className="rounded-lg border"
                />
              </div>
              {compressed && (
                <div>
                  <p className="mb-2 text-sm font-medium">
                    Compressed ({compressionRatio}% smaller)
                  </p>
                  <img 
                    src={compressed.url} 
                    alt="Compressed" 
                    className="rounded-lg border"
                  />
                </div>
              )}
            </div>
          )}

          {compressed && (
            <div className="flex items-center justify-between rounded-lg bg-green-500/10 p-4">
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">
                  Compressed to {(compressed.size / 1024).toFixed(1)} KB
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Saved {compressionRatio}% file size
                </p>
              </div>
              <Button onClick={downloadCompressed}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
