"use client"

import { useCallback } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileDropzoneProps {
  accept: string
  onFileSelect: (file: File) => void
  label?: string
  hint?: string
  className?: string
  maxSize?: number // in MB
  onError?: (error: string) => void
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB default

export function FileDropzone({ 
  accept, 
  onFileSelect, 
  label = "Drop file here or click to upload",
  hint,
  className,
  maxSize = 50, // 50MB default
  onError
}: FileDropzoneProps) {
  const validateFile = useCallback((file: File) => {
    const maxBytes = maxSize * 1024 * 1024
    
    if (file.size > maxBytes) {
      const error = `File size exceeds ${maxSize}MB limit`
      onError?.(error)
      return false
    }
    
    return true
  }, [maxSize, onError])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }, [onFileSelect, validateFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }, [onFileSelect, validateFile])

  return (
    <label
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-foreground/50 hover:bg-accent/50",
        className
      )}
    >
      <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
      <p className="mb-1 text-sm font-medium text-foreground">{label}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />
    </label>
  )
}
